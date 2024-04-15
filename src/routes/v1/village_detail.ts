import express, { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Joi from 'joi';
import { validate } from '../../middleware/middleware';
import { asyncMiddleware } from '../../middleware/error_middleware';
import output from '../../utils/response';
import { isAdmin } from '../../middleware/access_middleware';
const router = express.Router({ mergeParams: true });

// model imports
import { Village } from '../../db/models';

// village update validations
const villageUpdateValidations = Joi.object({
    province: Joi.string().required(),
    district: Joi.string().required(),
    sector: Joi.string().required(),
    cell: Joi.string().required(),
    village: Joi.string().required(),
    aboutVillage: Joi.string().required(),
});

// Update a village
router.patch('/', isAdmin, validate(villageUpdateValidations), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { villageId } = req.params;
    const { cell, village: villageName } = req.body;

    const villagePromise = Village.findOne({ where: { id: villageId } });
    const villageExistsPromise = Village.findOne({ where: {
        cell, village: villageName,
        id: { [Op.ne]: villageId },
    } });
    const [village, villageExists] = await Promise.all([villagePromise, villageExistsPromise]);
    if (!village) {
        return output(res, 400, 'Village not found', null, 'BAD_REQUEST');
    }
    if (villageExists) {
        return output(res, 409, 'Village already exists', null, 'CONFLICT_ERROR');
    }
    const updatedVillage = await Village.update({ ...req.body }, { where: { id: villageId }, returning: true });
    const updatedVillageData = updatedVillage[1][0].dataValues;
    return output(res, 200, 'Village updated successfully', updatedVillageData, null);
})
);

// village delete
router.delete('/', isAdmin, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { villageId } = req.params;
    const village = await Village.findOne({ where: { id: villageId } });
    if (!village) {
        return output(res, 400, 'Village not found', null, 'BAD_REQUEST');
    }
    await village.destroy();
    return output(res, 200, 'Village deleted successfully', null, null);
})
);

export default router;
