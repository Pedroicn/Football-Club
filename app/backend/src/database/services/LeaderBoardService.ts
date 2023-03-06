import MatchModel from '../models/MatchModel';
import TeamModel from '../models/TeamModel';
import TeamService from './teamService';
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
  private teamService = new TeamService();
  private matchService = new MatchService();
  static teamModel = TeamModel;

  public async getFinishedMatches(): Promise<MatchModel[]> {
    const matches = await this.matchService.getAllMatches(false);
    // const allTeams = await this.teamService.getAllTeams();
    return matches;
  }

  static createBoard(teams: TeamModel[], matches: MatchModel[], side: string): TeamBoardShape[] {
    const boardTeams = teams.map((team) => ({
      name: team.teamName,
      totalPoints: LeaderBoardService.totalPoints(matches, team.id, side),
      totalGames: LeaderBoardService.totalGames(matches, team.id, side),
      totalVictories: LeaderBoardService.totalVictories(matches, team.id, side),
      totalDraws: LeaderBoardService.totalDraws(matches, team.id, side),
      totalLosses: LeaderBoardService.totalLosses(matches, team.id, side),
      goalsFavor: LeaderBoardService.goalsFavor(matches, team.id, side),
      goalsOwn: LeaderBoardService.goalsOwn(matches, team.id, side),
      goalsBalance: LeaderBoardService
        .goalsFavor(matches, team.id, side) - LeaderBoardService.goalsOwn(matches, team.id, side),
      efficiency: LeaderBoardService.efficiency(matches, team.id, side),
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

  static efficiency = (matches: MatchModel[], id: number, side: string) => {
    if (side === 'home') {
      return LeaderBoardService.calculateEfficiencyHome(matches, id, side);
    }
    return LeaderBoardService.calculateEfficiencyAway(matches, id, side);
  };

  static totalPoints = (matches: MatchModel[], id: number, side: string) => {
    if (side === 'home') {
      return LeaderBoardService.sumPointsHome(matches, id);
    }
    return LeaderBoardService.sumPointsAway(matches, id);
  };

  static calculateEfficiencyHome = (matches: MatchModel[], id: number, side: string) => {
    const totalPoints = LeaderBoardService.sumPointsHome(matches, id);
    const totalGames = LeaderBoardService.totalGames(matches, id, side);
    return Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));
  };

  static calculateEfficiencyAway = (matches: MatchModel[], id: number, side: string) => {
    const totalPoints = LeaderBoardService.sumPointsAway(matches, id);
    const totalGames = LeaderBoardService.totalGames(matches, id, side);
    return Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));
  };

  static sumPointsHome = (matches: MatchModel[], id: number): number => {
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

  static sumPointsAway = (matches: MatchModel[], id: number): number => {
    let total = 0;
    const filterTeams = matches.filter((item) => item.awayTeamId === id);
    filterTeams.forEach((match) => {
      if (match.awayTeamGoals > match.homeTeamGoals) {
        total += 3;
      } else if (match.awayTeamGoals < match.homeTeamGoals) {
        total += 0;
      } else {
        total += 1;
      }
    });
    return total;
  };

  static totalGames(matches: MatchModel[], id: number, side: string) {
    if (side === 'home') {
      return matches.filter((match) => match.homeTeamId === id).length;
    }
    return matches.filter((match) => match.awayTeamId === id).length;
  }

  static totalVictories(matches: MatchModel[], id: number, side: string) {
    if (side === 'home') {
      const getMatchesHome = matches.filter((match) =>
        match.homeTeamId === id);
      return getMatchesHome
        .filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;
    }
    const getMatchesAway = matches.filter((match) => match.awayTeamId === id);
    return getMatchesAway
      .filter((match) => match.awayTeamGoals > match.homeTeamGoals).length;
  }

  static totalDraws(matches: MatchModel[], id: number, side: string) {
    if (side === 'home') {
      const getMatchesHome = matches.filter((match) => match.homeTeamId === id);
      return getMatchesHome.filter((match) =>
        match.homeTeamGoals === match.awayTeamGoals).length;
    }
    const getMatchesAway = matches.filter((match) => match.awayTeamId === id);
    return getMatchesAway.filter((match) =>
      match.homeTeamGoals === match.awayTeamGoals).length;
  }

  static totalLosses(matches: MatchModel[], id: number, side: string) {
    if (side === 'home') {
      const getMatchesHome = matches.filter((match) => match.homeTeamId === id);
      return getMatchesHome.filter((match) =>
        match.homeTeamGoals < match.awayTeamGoals).length;
    }
    const getMatchesAway = matches.filter((match) => match.awayTeamId === id);
    return getMatchesAway.filter((match) =>
      match.awayTeamGoals < match.homeTeamGoals).length;
  }

  static goalsFavor(matches: MatchModel[], id: number, side: string): number {
    if (side === 'home') {
      const getMatchesHome = matches.filter((match) => match.homeTeamId === id);
      return getMatchesHome.reduce((acc, actual) => acc + actual.homeTeamGoals, 0);
    }
    const getMatchesAway = matches.filter((match) => match.awayTeamId === id);
    return getMatchesAway.reduce((acc, actual) => acc + actual.awayTeamGoals, 0);
  }

  static goalsOwn(matches: MatchModel[], id: number, side: string): number {
    if (side === 'home') {
      const getMatchesHome = matches.filter((match) => match.homeTeamId === id);
      return getMatchesHome.reduce((acc, actual) => acc + actual.awayTeamGoals, 0);
    }
    const getMatchesAway = matches.filter((match) => match.awayTeamId === id);
    return getMatchesAway.reduce((acc, actual) => acc + actual.homeTeamGoals, 0);
  }
}

export default LeaderBoardService;
