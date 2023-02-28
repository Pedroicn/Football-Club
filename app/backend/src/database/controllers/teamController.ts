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

  public getTeamById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const team = await this.teamService.getTeamById(Number(id));
    res.status(statusCodes.ok).json(team);
  };
}

export default TeamController;
