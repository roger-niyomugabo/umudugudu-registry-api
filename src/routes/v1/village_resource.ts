/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { Op } from 'sequelize';
import output from '../../utils/response';
import { asyncMiddleware } from '../../middleware/error_middleware';
import { ChiefUser, User, Village } from '../../db/models';
import { isAdmin } from '../../middleware/access_middleware';
import { pagination, validate } from '../../middleware/middleware';
import { computePaginationRes } from '../../utils';
import { db } from '../../db';
import { generate } from '../../utils/bcrypt';
import { NationalIDRegex, passwordRegex, phoneNumberRegex } from '../../utils/globalValidations';
import { gender } from '../../interfaces/userInterface';
import { generatePassword } from '../../utils/generatePassword';
import mailer from '../../utils/mailer';

const router = express.Router();

// Village validations
const villageValidations = Joi.object({
    province: Joi.string().required(),
    district: Joi.string().required(),
    sector: Joi.string().required(),
    cell: Joi.string().required(),
    village: Joi.string().required(),
    aboutVillage: Joi.string().required(),

    firstname: Joi.string().required(),
    surname: Joi.string().required(),
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

    username: Joi.string().min(2).required(),
    dateOfBirth: Joi.string().required(),
    nationality: Joi.string().required(),
    profession: Joi.string().required(),
});

router.post('/', isAdmin, validate(villageValidations), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { cell, village: vilageName, username, email, NID, phoneNumber } = req.body;

    const villageExistsPromise = Village.findOne({ where: { cell, village: vilageName } });
    const userExistsPromise = User.findOne({ where: { [Op.or] :[{ email }, { NID }, { phoneNumber }] } });
    const chiefExistsPromise = ChiefUser.findOne({ where: { username } });

    const [villageExists, userExists, chiefExists] = await Promise.all([villageExistsPromise, userExistsPromise, chiefExistsPromise]);
    if (villageExists) {
        return output(res, 409, 'Village already exixts', null, 'CONFLICT_ERROR');
    }
    if (userExists) {
        return output(res, 409, 'User already exixts', null, 'CONFLICT_ERROR');
    }
    if (chiefExists) {
        return output(res, 409, 'User already exixts', null, 'CONFLICT_ERROR');
    }
    const password = generatePassword();
    const hashedPassword = await generate(password);
    try {
        await db.transaction(async (t) => {
            const newVillage = await Village.create({ ...req.body }, { transaction: t });
            const user = await User.create({ ...req.body, password: hashedPassword, role: 'village_chief' }, { transaction: t });
            const chief = await ChiefUser.create({ ...req.body, userId: user.id, villageId: newVillage.id }, { transaction: t });
            user.password = undefined;
            const responseData = {
                chiefUser: {
                    ...user.dataValues,
                    ...chief.dataValues,
                },
                village: newVillage.dataValues,
            };

            await mailer({ email: responseData.chiefUser.email, firstname: responseData.chiefUser.firstname, password, village: responseData.village.village }, 'accountCreationRequest');
            return output(res, 201, 'Vilage created successfully', responseData, null);
        });
    } catch (error) {
        return output(res, 500, error.message || error, null, 'INTERNAL_SERVER_ERROR');
    }
})
);

// Get all villages
router.get('/', isAdmin, pagination, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const orderClause = Village.getOrderQuery(req.query);
    const selectClause = Village.getSelectionQuery(req.query);

    const villages = await Village.findAndCountAll({
        order: orderClause,
        attributes: selectClause,
        limit: res.locals.pagination.limit,
        offset: res.locals.pagination.offset,
    });
    return output(
        res, 200, 'Villages retrieved successfully',
        computePaginationRes(
            res.locals.pagination.page,
            res.locals.pagination.limit,
            villages.count,
            villages.rows),
        null);
})
);

export default router;
