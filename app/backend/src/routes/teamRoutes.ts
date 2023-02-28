import { Router } from 'express';
import TeamController from '../database/controllers/teamController';

const router = Router();

const teamController = new TeamController();

router.get('/teams', teamController.getAllTeams);

export default router;
