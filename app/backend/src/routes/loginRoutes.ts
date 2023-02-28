import { Router } from 'express';
import UserController from '../database/controllers/userController';

const router = Router();

const userController = new UserController();

router.post('/login', userController.user);

export default router;
