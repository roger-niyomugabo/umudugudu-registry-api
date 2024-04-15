/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import output from '../../utils/response';
import { asyncMiddleware } from '../../middleware/error_middleware';
import { Village } from '../../db/models';
import { isAdmin } from '../../middleware/access_middleware';
import { validate } from '../../middleware/middleware';

const router = express.Router();

// Village validations
const villageValidations = Joi.object({
    province: Joi.string().required(),
    district: Joi.string().required(),
    sector: Joi.string().required(),
    cell: Joi.string().required(),
    village: Joi.string().required(),
    aboutVillage: Joi.string().required(),
});

router.post('/', isAdmin, validate(villageValidations), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { cell, village } = req.body;
    const villageExists = await Village.findOne({ where: { cell, village } });
    if (villageExists) {
        return output(res, 409, 'Village already exixts', null, 'CONFLICT_ERROR');
    }
    const newVillage = await Village.create({ ...req.body });
    return output(res, 201, 'Vilage created successfully', newVillage, null);
})
);

export default router;
