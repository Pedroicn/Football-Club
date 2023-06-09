import { Request, Response } from 'express';
import statusCodes from '../../utils/statusCodes';
import MatchService from '../services/matchService';

class MatchController {
  private matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  public getAllMatches = async (req: Request, res: Response) => {
    const { inProgress } = req.query;
    if (inProgress === undefined) {
      const matches = await this.matchService.getAllMatches();
      return res.status(statusCodes.ok).json(matches);
    }
    const bool = inProgress === 'true';
    const matches = await this.matchService.getAllMatches(bool);
    return res.status(statusCodes.ok).json(matches);
  };

  public finishMatches = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { code, message } = await this.matchService.finishMatch(+id);
    return res.status(code).json(message);
  };

  public updateMatch = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { code, message } = await this.matchService.updateMatch(+id, req.body);
    return res.status(code).json(message);
  };

  public createMatch = async (req: Request, res: Response) => {
    const { homeTeamId, awayTeamId } = req.body;
    if (homeTeamId === awayTeamId) {
      return res.status(statusCodes.unprocessable)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    const { code, message } = await this.matchService.createMatch(req.body);
    return res.status(code).json(message);
  };
}

export default MatchController;
