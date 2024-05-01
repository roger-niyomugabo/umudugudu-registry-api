/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { Op } from 'sequelize';
import output from '../../utils/response';
import { asyncMiddleware } from '../../middleware/error_middleware';
import { ResidentUser, User, Village } from '../../db/models';
import { isAdminOrChiefUser, isChiefUser } from '../../middleware/access_middleware';
import { pagination, validate } from '../../middleware/middleware';
import { db } from '../../db';
import { generate } from '../../utils/bcrypt';
import { NationalIDRegex, phoneNumberRegex } from '../../utils/globalValidations';
import { gender, maritalStatus, ResidentResult } from '../../interfaces/userInterface';
import { generatePassword } from '../../utils/generatePassword';
import mailer from '../../utils/mailer';
import { computePaginationRes } from '../../utils';

const router = express.Router();

// Resident validations
const residentValidations = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    NID: Joi.string().regex(NationalIDRegex).required().messages({
        'string.base': 'Please provide a valid National ID',
        'string.pattern.base': 'Please provide a valid National ID',
        'string.empty': 'National ID is required',
    }),
    gender: Joi.string().valid(...gender).required(),
    phoneNumber: Joi.string().regex(phoneNumberRegex).required().messages({
        'string.base': 'Please provide phone number, starting with country code.',
        'string.pattern.base': 'Please provide phone number, starting with country code.',
        'string.empty': 'Phone number is required',
    }),

    dateOfBirth: Joi.string().required(),
    nationality: Joi.string().required(),
    profession: Joi.string().required(),
    maritalStatus: Joi.string().valid(...maritalStatus).required(),
});

router.post('/register', isChiefUser, validate(residentValidations), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { villageId } = req.user;
    const { email, NID, phoneNumber } = req.body;

    const villagePromise = Village.findOne({ where: { id: villageId } });
    const userExistsPromise = User.findOne({ where: { [Op.or] :[{ email }, { NID }, { phoneNumber }] } });

    const [village, userExists] = await Promise.all([villagePromise, userExistsPromise]);
    if (!village) {
        return output(res, 400, 'Village does not exixt', null, 'BAD_REQUEST');
    }
    if (userExists) {
        return output(res, 409, 'User already exixts', null, 'CONFLICT_ERROR');
    }
    const password = generatePassword();
    const hashedPassword = await generate(password);
    try {
        await db.transaction(async (t) => {
            const user = await User.create({ ...req.body, password: hashedPassword, role: 'resident' }, { transaction: t });
            const resident = await ResidentUser.create({ ...req.body, userId: user.id, villageId: village.id }, { transaction: t });
            user.password = undefined;
            const residentUser = {
                ...user.dataValues,
                ...resident.dataValues,
            };

            await mailer({ email: residentUser.email, fullName: residentUser.fullName, password, village: village.village }, 'residentRegistrationRequest');
            return output(res, 201, 'Resident registered successfully', residentUser, null);
        });
    } catch (error) {
        return output(res, 500, error.message || error, null, 'INTERNAL_SERVER_ERROR');
    }
})
);

// Get all residents
router.get('/', isAdminOrChiefUser, pagination, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const orderClause = ResidentUser.getOrderQuery(req.query);
    const selectClause = ResidentUser.getSelectionQuery(req.query);
    const whereClause = ResidentUser.getWhereQuery(req.query);
    const { chiefUserId, villageId, role } = req.user;

    let residents: ResidentResult;

    if (role === 'village_chief') {
        const userPromise = User.findOne({ where: { id: chiefUserId } });
        const villagePromise = Village.findOne({ where: { id: villageId } });
        const [village, user] = await Promise.all([userPromise, villagePromise]);
        if (!user) {
            return output(res, 400, 'User does not exist', null, 'BAD_REQUEST');
        }
        if (!village) {
            return output(res, 400, 'Village does not exist', null, 'BAD_REQUEST');
        }

        residents = await ResidentUser.findAndCountAll({
            order: orderClause,
            attributes: selectClause,
            where: { ...whereClause, villageId }, include: [
                { model: User, as: 'user' },
            ],
            limit: res.locals.pagination.limit,
            offset: res.locals.pagination.offset,
        });
    }
    if (role === 'admin') {
        residents = await ResidentUser.findAndCountAll({
            order: orderClause,
            attributes: selectClause,
            include: [{ model: User, as: 'user' }],
            limit: res.locals.pagination.limit,
            offset: res.locals.pagination.offset,
        });
    }

    return output(
        res, 200, 'Residents retrieved successfully',
        computePaginationRes(
            res.locals.pagination.page,
            res.locals.pagination.limit,
            residents.count,
            residents.rows),
        null);
})
);

export default router;
