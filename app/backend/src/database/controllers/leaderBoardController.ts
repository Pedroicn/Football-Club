import { Request, Response } from 'express';
import statusCodes from '../../utils/statusCodes';
import LeaderBoardService from '../services/LeaderBoardService';
import TeamService from '../services/teamService';

class LeaderBoardController {
  private leaderBoardService: LeaderBoardService;
  private teamService = new TeamService();

  constructor() {
    this.leaderBoardService = new LeaderBoardService();
  }

  public getFinishedMatches = async (_req: Request, res: Response) => {
    const finishedMatches = await this.leaderBoardService.getFinishedMatches();
    const allTeams = await this.teamService.getAllTeams();
    const board = LeaderBoardService.createBoard(allTeams, finishedMatches);
    console.log(board);
    res.status(statusCodes.ok).json(board);
  };
}

export default LeaderBoardController;
