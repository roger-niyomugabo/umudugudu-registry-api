import express, { NextFunction, Request, Response } from 'express';
import { asyncMiddleware } from '../../middleware/error_middleware';
import output from '../../utils/response';

const router = express.Router();

// Admin signup
router.post('/signup', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {

    return output(res, 201, 'Signup successfully', null, null);
})
);

export default router;
