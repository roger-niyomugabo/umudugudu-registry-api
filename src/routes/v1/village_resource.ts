/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import output from '../../utils/response';
import { asyncMiddleware } from '../../middleware/error_middleware';
import { Village } from '../../db/models';
import { isAdmin } from '../../middleware/access_middleware';
import { pagination, validate } from '../../middleware/middleware';
import { computePaginationRes } from '../../utils';

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

// Get all villages
router.get('/', isAdmin, pagination, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const orderClause = Village.getOrderQuery(req.query);
    const selectClause = Village.getSelectionQuery(req.query);
    // const whereClause = Village.getWhereQuery(req.query);

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
