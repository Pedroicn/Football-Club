import { Request, Response } from 'express';
import statusCodes from '../../utils/statusCodes';
import TeamService from '../services/teamService';

class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  public getAllTeams = async (_req: Request, res: Response) => {
    const teams = await this.teamService.getAllTeams();
    res.status(statusCodes.ok).json(teams);
  };
}

export default TeamController;
