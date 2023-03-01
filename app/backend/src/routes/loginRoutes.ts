import { Request, Response, Router } from 'express';
import statusCodes from '../utils/statusCodes';
import validateToken from '../database/middlewares/validateToken';
import UserController from '../database/controllers/userController';
import { validationEmail, validationPassword } from '../database/middlewares/validationLogin';

const router = Router();

const userController = new UserController();

router.post('/login', validationEmail, validationPassword, userController.user);

router.get(
  '/login/role',
  validateToken,
  (_req: Request, res: Response) => res.status(statusCodes.ok)
    .json({ role: res.locals.user.role }),
);

export default router;
