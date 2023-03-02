import { Router } from 'express';
import MatchController from '../database/controllers/matchController';

const router = Router();

const matchController = new MatchController();

router.get('/matches', matchController.getAllMatches);

export default router;
