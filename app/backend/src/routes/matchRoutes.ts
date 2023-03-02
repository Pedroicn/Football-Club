import { Router } from 'express';
import MatchController from '../database/controllers/matchController';
import validateToken from '../database/middlewares/validateToken';

const router = Router();

const matchController = new MatchController();

router.get('/matches', matchController.getAllMatches);

router.patch('/matches/:id/finish', validateToken, matchController.finishMatches);

export default router;
