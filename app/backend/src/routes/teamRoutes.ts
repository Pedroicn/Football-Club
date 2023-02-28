import { Router } from 'express';
import TeamController from '../database/controllers/teamController';

const router = Router();

const teamController = new TeamController();

router.get('/teams', teamController.getAllTeams);
router.get('/teams/:id', teamController.getTeamById);
export default router;
