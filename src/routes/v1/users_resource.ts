/* eslint-disable sonarjs/no-duplicate-string */
import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { validate } from '../../middleware/middleware';
import { asyncMiddleware } from '../../middleware/error_middleware';
import output from '../../utils/response';
import { sign } from '../../utils/jwt';
import { check } from '../../utils/bcrypt';
const router = express.Router({ mergeParams: true });

// model imports
import { AdminUser, ChiefUser, ResidentUser, User } from '../../db/models';

// Users login validations
const adminLoginValidations = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Users login
router.post('/login', validate(adminLoginValidations), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email },
        include: [
            { model: AdminUser, as: 'admin_user' },
            { model: ChiefUser, as: 'chief_user' },
            { model: ResidentUser, as: 'resident_user' },
        ],
    });
    if (!user || !['admin', 'village_chief', 'resident'].includes(user.role)) {
        return output(res, 404, 'Email not registered', null, 'NOT_FOUND_ERROR');
    }
    const isMatch = check(user.password, password);
    if (!isMatch) {
        return output(res, 400, 'Incorrect email or password', null, 'BAD_REQUEST');
    }
    user.password = undefined;

    if (user.role === 'admin') {
        const token = sign({ adminUserId: user.id, role: user.role });
        return output(res, 200, 'Logged in successfully', { user, token }, null);
    }
    if (user.role === 'village_chief') {
        const token = sign({ chiefUserId: user.id, role: user.role });
        return output(res, 200, 'Logged in successfully', { user, token }, null);
    }
    if (user.role === 'resident') {
        const token = sign({ residentUserId: user.id, role: user.role });
        return output(res, 200, 'Logged in successfully', { user, token }, null);
    }
    return output(res, 400, 'Invalid login cridentials', null, 'BAD_REQUEST');
})
);

export default router;
