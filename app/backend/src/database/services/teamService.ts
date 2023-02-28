import TeamModel from '../models/TeamModel';
import Team from '../interfaces/TeamInterface';

class TeamService {
  private teamModel = TeamModel;

  public async getAllTeams(): Promise<Team[]> {
    const teams = await this.teamModel.findAll();
    return teams;
  }
}
export default TeamService;
