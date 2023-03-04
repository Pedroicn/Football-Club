import { Router } from 'express';
import LeaderBoardController from '../database/controllers/leaderBoardController';

const router = Router();

const leaderBoardController = new LeaderBoardController();

router.get('/leaderboard/home', leaderBoardController.getFinishedMatches);

router.get('/leaderboard/away', leaderBoardController.getFinishedMatches);

export default router;
