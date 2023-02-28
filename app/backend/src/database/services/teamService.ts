import TeamModel from '../models/TeamModel';
// import Team from '../interfaces/TeamInterface';

class TeamService {
  private teamModel = TeamModel;

  public async getAllTeams(): Promise<TeamModel[]> {
    const teams = await this.teamModel.findAll();
    return teams;
  }

  public async getTeamById(id: number) {
    const team = await this.teamModel.findOne({
      where: { id },
    });
    return team;
  }
}
export default TeamService;
