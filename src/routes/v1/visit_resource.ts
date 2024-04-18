/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { Op } from 'sequelize';
import output from '../../utils/response';
import { asyncMiddleware } from '../../middleware/error_middleware';
import { ResidentUser, User, Village, Visit, Visitor } from '../../db/models';
import { isResident } from '../../middleware/access_middleware';
import { validate } from '../../middleware/middleware';
import { db } from '../../db';
import { NationalIDRegex, phoneNumberRegex } from '../../utils/globalValidations';
import { gender } from '../../interfaces/userInterface';
import cloudinaryUpload from '../../utils/file_upload';

const router = express.Router();

// visit validations
const visitValidations = Joi.object({
    origin: Joi.string().required(),
    visitReason: Joi.string().required(),
    duration: Joi.string().required(),
    arrivalDate: Joi.string().required(),

    visitorId: Joi.string().uuid(),
    visitor: Joi.object({
        fullName: Joi.string().required(),
        NID: Joi.string().regex(NationalIDRegex).required().messages({
            'string.base': 'Please provide a valid National ID',
            'string.pattern.base': 'Please provide a valid National ID',
            'string.empty': 'National ID is required',
        }),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().regex(phoneNumberRegex).required().messages({
            'string.base': 'Please provide phone number, starting with country code.',
            'string.pattern.base': 'Please provide phone number, starting with country code.',
            'string.empty': 'Phone number is required',
        }),
        gender: Joi.string().valid(...gender).required(),
        nationality: Joi.string().required(),
        profession: Joi.string().required(),
    }),
}).or('visitorId', 'visitor');

router.post('/', isResident, cloudinaryUpload.single('file'), validate(visitValidations), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { villageId, residentUserId } = req.user;
    const { visitorId, visitor: visitorData } = req.body;
    const file = req.file as Express.Multer.File;

    const userPromise = User.findOne({ where: { id: residentUserId }, include: [{ model: ResidentUser, as: 'resident_user' }] });
    const villagePromise = Village.findOne({ where: { id: villageId } });

    const [village, user] = await Promise.all([villagePromise, userPromise]);
    if (!user) {
        return output(res, 400, 'User does not exixt', null, 'BAD_REQUEST');
    }
    if (!village) {
        return output(res, 400, 'Village does not exixt', null, 'BAD_REQUEST');
    }

    try {
        const visit = await db.transaction(async (t) => {

            let visitorID: string;
            if (!visitorId) {
                const { fullName, NID, phoneNumber, email, gender: gendername, nationality, profession } = visitorData;
                const visitor = await Visitor.findOne({ where: { [Op.or]: [{ NID }, { phoneNumber, email }] } });
                if (visitor) {
                    visitorID = visitor.id;
                } else {

                    const newVisitor = await Visitor.create({
                        fullName,
                        NID,
                        phoneNumber,
                        email,
                        gender: gendername,
                        nationality,
                        profession,
                    }, { transaction: t });
                    visitorID = newVisitor.id;
                }
            } else {
                const visitorExists = await Visitor.findOne({ where: { id: visitorId }, transaction: t });
                if (!visitorExists) {
                    throw new Error('Visitor not found');
                }
                visitorID = visitorId;
            }
            const existing_created_visitor = await Visitor.findOne({ where: { id: visitorID }, transaction: t });
            const newVisit = await Visit.create({
                ...req.body,
                file: file?.path,
                residentUserId: user.resident_user.id,
                visitorId: visitorID,
                villageId: villageId,
            }, { transaction: t });

            return {
                ...newVisit.dataValues,
                visitor : { ...existing_created_visitor.dataValues },
            };
        });
        return output(res, 201, 'A visit registered successfully', visit, null);

    } catch (error) {
        return output(res, 400, error.message || error, null, 'BAD_REQUEST');
    }
})
);

export default router;
