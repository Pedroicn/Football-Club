import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';

import { Response } from 'superagent';
import statusCodes from '../utils/statusCodes';


chai.use(chaiHttp);

const { expect } = chai;

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJpYXQiOjE2Nzc3Njc3MzR9.LwGoTmw2tSlGOAkcZjSaoe4Es-uvZlSvR-ZkxyLQs-4';

describe('Testing route /leaderboard/home', () => {

  interface LeaderBoardShape {
    name: string;
    totalPoints: number;
    totalGames: number;
    totalVictories: number;
    totalDraws: number;
    totalLosses: number;
    goalsFavor: number;
    goalsOwn: number;   
  }

  interface mock extends MatchModel {
    home_team_id: number,
    away_team_id: number,
    homeTeam: {
      teamName: string;
    },
    awayTeam: {
      teamName: string;
    }      
  }

 
  const mockTeams = [
    { id: 4, teamName: 'Corinthians' },
    { id: 14, teamName: 'Santos' }
  ]

  const mockMatches = [
    {
      id: 1,
      homeTeamId: 4,
      homeTeamGoals: 2,
      awayTeamId: 14,
      awayTeamGoals: 0,
      inProgress: false,
      home_team_id: 4,
      away_team_id: 14,
      homeTeam: {
        teamName: "Corinthians"
      },
      awayTeam: {
        teamName: "Santos"
      }
    },
    {
      id: 2,
      homeTeamId: 14,
      homeTeamGoals: 0,
      awayTeamId: 4,
      awayTeamGoals: 2,
      inProgress: false,
      home_team_id: 14,
      away_team_id: 4,
      homeTeam: {
        teamName: "Santos"
      },
      awayTeam: {
        teamName: "Corinthians"
      }
    }
  ]

  const leaderHomeBoardMock = [
    {
      name: "Corinthians",
      totalPoints: 3,
      totalGames: 1,
      totalVictories: 1,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 2,
      goalsOwn: 0,
      goalsBalance: 2,
      efficiency: 100
    },
    {
      name: "Santos",
      totalPoints: 0,
      totalGames: 1,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 1,
      goalsFavor: 0,
      goalsOwn: 2,
      goalsBalance: -2,
      efficiency: 0
    },
  ]


  let chaiHttpResponse: Response;
  
  afterEach(() => {
    sinon.restore();
  });
  
  it('Tests if get all all leaderBoard', async () => {
    sinon
      .stub(TeamModel, 'findAll')
      .resolves(mockTeams as TeamModel[]);

    sinon
      .stub(MatchModel, 'findAll')
      .resolves(mockMatches as mock[]);
    
    chaiHttpResponse = await chai.request(app).get('/leaderboard/home');
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.ok);

    expect(chaiHttpResponse.body).to.be.deep.equal(leaderHomeBoardMock);
  });

});