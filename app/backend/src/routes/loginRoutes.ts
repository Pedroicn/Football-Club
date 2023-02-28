import { Router } from 'express';
import UserController from '../database/controllers/userController';
import { validationEmail, validationPassword } from '../database/middlewares/validationLogin';

const router = Router();

const userController = new UserController();

router.post('/login', validationEmail, validationPassword, userController.user);

export default router;
