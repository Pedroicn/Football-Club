import MatchModel from '../models/MatchModel';
import TeamModel from '../models/TeamModel';
import MatchService from './matchService';

interface TeamBoardShape {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number
  goalsBalance: number
  efficiency: number
}

class LeaderBoardService {
  // private matchModel = MatchModel;
  private matchService = new MatchService();
  static teamModel = TeamModel;

  public getFinishedMatches = (): Promise<MatchModel[]> => this.matchService.getAllMatches(false);

  static createBoard(teams: TeamModel[], matches: MatchModel[]) {
    const boardTeams = teams.map((team) => ({
      name: team.teamName,
      totalPoints: LeaderBoardService.sumPoints(matches, team.id),
      totalGames: LeaderBoardService.totalGames(matches, team.id),
      totalVictories: LeaderBoardService.totalVictories(matches, team.id),
      totalDraws: LeaderBoardService.totalDraws(matches, team.id),
      totalLosses: LeaderBoardService.totalLosses(matches, team.id),
      goalsFavor: LeaderBoardService.goalsFavor(matches, team.id),
      goalsOwn: LeaderBoardService.goalsOwn(matches, team.id),
      goalsBalance: LeaderBoardService
        .goalsFavor(matches, team.id) - LeaderBoardService.goalsOwn(matches, team.id),
      efficiency: LeaderBoardService.calculateEfficiency(matches, team.id),
    }));

    const sortedTeams = LeaderBoardService.sortTeams(boardTeams);
    return sortedTeams;
  }

  static sortTeams(array: TeamBoardShape[]) {
    return array.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (a.totalVictories !== b.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      if (a.goalsFavor !== b.goalsFavor) {
        return b.goalsFavor - a.goalsFavor;
      }
      if (a.goalsOwn !== b.goalsOwn) {
        return b.goalsOwn - a.goalsOwn;
      }
      return 0;
    });
  }

  static calculateEfficiency = (matches: MatchModel[], id: number) => {
    const totalPoints = LeaderBoardService.sumPoints(matches, id);
    const totalGames = LeaderBoardService.totalGames(matches, id);
    return Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));
  };

  static sumPoints = (matches: MatchModel[], id: number): number => {
    let total = 0;
    const filterTeams = matches.filter((item) => item.homeTeamId === id);
    filterTeams.forEach((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        total += 3;
      } else if (match.homeTeamGoals < match.awayTeamGoals) {
        total += 0;
      } else {
        total += 1;
      }
    });
    return total;
  };

  static totalGames(matches: MatchModel[], id: number) {
    const getTotalGames = matches.filter((match) => match.homeTeamId === id).length;
    return getTotalGames;
  }

  static totalVictories(matches: MatchModel[], id: number) {
    const getMatches = matches.filter((match) =>
      match.homeTeamId === id);
    const getVictories = getMatches
      .filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;

    return getVictories;
  }

  static totalDraws(matches: MatchModel[], id: number) {
    const getMatches = matches.filter((match) => match.homeTeamId === id);
    const getDraws = getMatches.filter((match) =>
      match.homeTeamGoals === match.awayTeamGoals).length;

    return getDraws;
  }

  static totalLosses(matches: MatchModel[], id: number) {
    const getMatches = matches.filter((match) => match.homeTeamId === id);
    const getLosses = getMatches.filter((match) =>
      match.homeTeamGoals < match.awayTeamGoals).length;

    return getLosses;
  }

  static goalsFavor(matches: MatchModel[], id: number): number {
    const getMatches = matches.filter((match) => match.homeTeamId === id);
    return getMatches.reduce((acc, actual) => acc + actual.homeTeamGoals, 0);
  }

  static goalsOwn(matches: MatchModel[], id: number): number {
    const getMatches = matches.filter((match) => match.homeTeamId === id);
    return getMatches.reduce((acc, actual) => acc + actual.awayTeamGoals, 0);
  }
}

export default LeaderBoardService;
