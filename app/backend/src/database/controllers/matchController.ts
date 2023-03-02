import { Request, Response } from 'express';
import statusCodes from '../../utils/statusCodes';
import MatchService from '../services/matchService';

class MatchController {
  private matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  public getAllMatches = async (_req: Request, res: Response) => {
    const matches = await this.matchService.getAllMatches();
    res.status(statusCodes.ok).json(matches);
  };
}

export default MatchController;
