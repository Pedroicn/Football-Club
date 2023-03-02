import statusCodes from '../../utils/statusCodes';
import MatchModel from '../models/MatchModel';
import Team from '../models/TeamModel';

interface Body {
  homeTeamGoals: 3,
  awayTeamGoals: 1
}

class MatchService {
  private matchModel = MatchModel;

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
}
export default MatchService;
