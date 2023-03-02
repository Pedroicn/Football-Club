import MatchModel from '../models/MatchModel';
import Team from '../models/TeamModel';

class MatchService {
  private matchModel = MatchModel;

  public async getAllMatches(): Promise<MatchModel[]> {
    const matches = await this.matchModel.findAll(
      { include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ] },
    );
    console.log(matches);
    return matches;
  }
}
export default MatchService;
