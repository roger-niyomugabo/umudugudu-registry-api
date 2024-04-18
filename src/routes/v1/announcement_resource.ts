/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import output from '../../utils/response';
import { asyncMiddleware } from '../../middleware/error_middleware';
import { Announcement, User, Village } from '../../db/models';
import { isChiefUser, isChiefUserOrResident } from '../../middleware/access_middleware';
import { pagination, validate } from '../../middleware/middleware';
import { computePaginationRes } from '../../utils';

const router = express.Router();

// Announcement validations
const announcementValidations = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
});

router.post('/', isChiefUser, validate(announcementValidations), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { chiefUserId, villageId } = req.user;

    const villagePromise = Village.findOne({ where: { id: villageId } });
    const userPromise = User.findOne({ where: { id: chiefUserId } });
    const [village, user] = await Promise.all([villagePromise, userPromise]);
    if (!village) {
        return output(res, 400, 'Village does not exixt', null, 'BAD_REQUEST');
    }
    if (!user) {
        return output(res, 400, 'User does not exixt', null, 'BAD_REQUEST');
    }
    const announcement = await Announcement.create({ ...req.body, userId: user.id, villageId });

    return output(res, 201, 'Announcement created successfully', { announcement, createdby: user }, null);
})
);

// Get all announcements
router.get('/', isChiefUserOrResident, pagination, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const orderClause = Announcement.getOrderQuery(req.query);
    const selectClause = Announcement.getSelectionQuery(req.query);
    const whereClause = Announcement.getWhereQuery(req.query);

    const { villageId } = req.user;
    const village = await Village.findOne({ where: { id: villageId } });
    if (!village) {
        return output(res, 400, 'Village does not exist', null, 'BAD_REQUEST');
    }
    const announcements = await Announcement.findAndCountAll({
        order: orderClause,
        attributes: selectClause,
        where: { ...whereClause, villageId }, include: [
            { model: User, as: 'user' },
        ],
        limit: res.locals.pagination.limit,
        offset: res.locals.pagination.offset,
    });
    return output(
        res, 200, 'Announcements retrieved successfully',
        computePaginationRes(
            res.locals.pagination.page,
            res.locals.pagination.limit,
            announcements.count,
            announcements.rows),
        null);
})
);

export default router;
