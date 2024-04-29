import express, { NextFunction, Request, Response } from 'express';
import { asyncMiddleware } from '../../middleware/error_middleware';
import output from '../../utils/response';
import { isChiefUser, isLoggedIn } from '../../middleware/access_middleware';
import { Announcement, User, Village } from '../../db/models';

const router = express.Router({ mergeParams: true });

// announcement delete
router.delete('/', isChiefUser, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { announcementId } = req.params;
    const { villageId, chiefUserId } = req.user;

    const villagePromise = Village.findOne({ where: { id: villageId } });
    const userPromise = User.findOne({ where: { id: chiefUserId } });
    const announcementPromise = Announcement.findOne({ where: { id: announcementId, villageId } });
    const [village, user, announcement] = await Promise.all([villagePromise, userPromise, announcementPromise]);
    if (!village) {
        return output(res, 400, 'Village does not exixt', null, 'BAD_REQUEST');
    }
    if (!user) {
        return output(res, 400, 'User does not exixt', null, 'BAD_REQUEST');
    }
    if (!announcement) {
        return output(res, 400, 'Announcement does not exixt', null, 'BAD_REQUEST');
    }

    await announcement.destroy();

    return output(res, 200, 'Announcement deleted successfully', null, null);
})
);

// Get a single announcement
router.get('/', isLoggedIn, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { announcementId } = req.params;
    const { villageId, role } = req.user;

    let announcement: Announcement | null;
    if (role === 'village_chief' || role === 'resident') {
        const village = await Village.findOne({ where: { id: villageId } });
        if (!village) {
            return output(res, 400, 'Village does not exixt', null, 'BAD_REQUEST');
        }
        announcement = await Announcement.findOne({ where: { id: announcementId, villageId }, include: [
            { model: User, as: 'user' },
        ] });
        if (!announcement) {
            return output(res, 400, 'No announcement found for your village', null, 'BAD_REQUEST');
        }
    }
    if (role === 'admin') {
        announcement = await Announcement.findOne({ where: { id: announcementId } });
        if (!announcement) {
            return output(res, 404, 'Announcement not found', null, 'NOT_FOUND_ERROR');
        }
    }
    return output(res, 200, 'Announcement retrieved successfully', announcement, null);
})
);

export default router;
