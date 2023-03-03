import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';

import { Response } from 'superagent';
import statusCodes from '../utils/statusCodes';


chai.use(chaiHttp);

const { expect } = chai;

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJpYXQiOjE2Nzc3Njc3MzR9.LwGoTmw2tSlGOAkcZjSaoe4Es-uvZlSvR-ZkxyLQs-4';

describe('Testing route /matches', () => {

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

  const leaderHomeBoardMock = [
    {
      name: "Corinthians",
      totalPoints: 6,
      totalGames: 2,
      totalVictories: 2,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 6,
      goalsOwn: 1,
    },
    {
      name: "Santos",
      totalPoints: 9,
      totalGames: 3,
      totalVictories: 3,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 9,
      goalsOwn: 3,
    },
  ]


  let chaiHttpResponse: Response;
  
  afterEach(() => {
    sinon.restore();
  });
  
  it('Tests if get all all leaderBoard', async () => {
    sinon
      .stub()
      .resolves(leaderHomeBoardMock as LeaderBoardShape[]);
    
    chaiHttpResponse = await chai.request(app).get('/leaderboard/home');
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.ok);

    expect(chaiHttpResponse.body).to.be.deep.equal(leaderHomeBoardMock);
  });

});