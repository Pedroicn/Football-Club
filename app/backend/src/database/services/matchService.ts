import MatchModel from '../models/MatchModel';
import Team from '../models/TeamModel';

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
    console.log(inProgress);
    const matches = await this.matchModel.findAll(
      { where: { inProgress },
        include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'] },
          { model: Team, as: 'awayTeam', attributes: ['teamName'] },
        ] },
    );
    return matches;
  }
}
export default MatchService;
