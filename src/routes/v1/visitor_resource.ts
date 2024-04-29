/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import output from '../../utils/response';
import { asyncMiddleware } from '../../middleware/error_middleware';
import { ResidentUser, User, Village, Visit, Visitor } from '../../db/models';
import { isResident } from '../../middleware/access_middleware';
import { pagination } from '../../middleware/middleware';
import { computePaginationRes } from '../../utils';

const router = express.Router();

// Get all visitors
router.get('/', isResident, pagination, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const orderClause = Visit.getOrderQuery(req.query);
    const selectClause = Visit.getSelectionQuery(req.query);
    const whereClause = Visit.getWhereQuery(req.query);
    const { residentUserId, villageId } = req.user;

    const user = await User.findOne({ where: { id: residentUserId, role: 'resident' } });
    if (!user) {
        return output(res, 400, 'User does not exist', null, 'BAD_REQUEST');
    }
    const residentPromise = ResidentUser.findOne({ where: { userId: user.id } });
    const villagePromise = Village.findOne({ where: { id: villageId } });
    const [resident, village] = await Promise.all([residentPromise, villagePromise]);

    if (!village) {
        return output(res, 400, 'Village does not exist', null, 'BAD_REQUEST');
    }
    const visitors = await Visit.findAndCountAll({
        order: orderClause,
        attributes: selectClause,
        where: { ...whereClause, villageId, residentUserId: resident.id }, include: [
            { model: Visitor, as: 'visitor' },
        ],
        limit: res.locals.pagination.limit,
        offset: res.locals.pagination.offset,
    });
    return output(
        res, 200, 'Visitors retrieved successfully',
        computePaginationRes(
            res.locals.pagination.page,
            res.locals.pagination.limit,
            visitors.count,
            visitors.rows),
        null);
})
);

export default router;
