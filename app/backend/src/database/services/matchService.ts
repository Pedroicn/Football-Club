import statusCodes from '../../utils/statusCodes';
import MatchModel from '../models/MatchModel';
import Team from '../models/TeamModel';

interface Body {
  homeTeamGoals: 3,
  awayTeamGoals: 1
}

export interface IcreateMatch {
  homeTeamId: 16,
  awayTeamId: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
}

class MatchService {
  private matchModel = MatchModel;
  private teamModel = Team;

  public async getAllMatches(inProgress?: boolean): Promise<MatchModel[]> {
    if (inProgress === undefined) {
      const matches = await this.matchModel.findAll(
        { include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'] },
          { model: Team, as: 'awayTeam', attributes: ['teamName'] },
        ] },
      );
      return matches;
    }
    const matches = await this.matchModel.findAll(
      { where: { inProgress },
        include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'] },
          { model: Team, as: 'awayTeam', attributes: ['teamName'] },
        ] },
    );
    return matches;
  }

  public async finishMatch(id: number) {
    await this.matchModel.update({ inProgress: false }, {
      where: { id },
    });
    return { code: statusCodes.ok, message: { message: 'Finished' } };
  }

  public async updateMatch(id: number, body: Body) {
    await this.matchModel.update({
      homeTeamGoals: body.homeTeamGoals,
      awayTeamGoals: body.awayTeamGoals,
    }, { where: { id } });

    return { code: statusCodes.ok, message: { message: 'Updated' } };
  }

  public async createMatch(body: IcreateMatch) {
    const homeTeam = await this.teamModel.findOne({
      where: { id: body.homeTeamId },
    });
    const awayTeam = await this.teamModel.findOne({
      where: { id: body.awayTeamId },
    });
    if (homeTeam === null || awayTeam === null) {
      return { code: statusCodes.notFound, message: { message: 'There is no team with such id!' } };
    }

    const matchData = await this.matchModel.create({
      ...body,
      inProgress: true,
    });
    console.log(matchData);
    return { code: statusCodes.created, message: matchData };
  }
}
export default MatchService;
