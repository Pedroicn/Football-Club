import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import MatchModel from '../database/models/MatchModel';
import { Response } from 'superagent';


chai.use(chaiHttp);

const { expect } = chai;

describe('Testing route /matches', () => {

  const expectedReturn = [
    {
      id: 1,
      homeTeamId: 16,
      homeTeamGoals: 1,
      awayTeamId: 8,
      awayTeamGoals: 1,
      inProgress: false,
      homeTeam: {
        teamName: "São Paulo"
      },
      awayTeam: {
        teamName: "Grêmio"
      }      
    },
    {
      id: 41,
      homeTeamId: 16,
      homeTeamGoals: 2,
      awayTeamId: 9,
      awayTeamGoals: 0,
      inProgress: true,
      homeTeam: {
        teamName: "São Paulo"
      },
      awayTeam: {
        teamName: "Internacional"
      }
    }
  ]

  const mockMatches = [
    {
      id: 1,
      homeTeamId: 16,
      homeTeamGoals: 1,
      awayTeamId: 8,
      awayTeamGoals: 1,
      inProgress: false,
    },
    {
      id: 41,
      homeTeamId: 16,
      homeTeamGoals: 2,
      awayTeamId: 9,
      awayTeamGoals: 0,
      inProgress: true,
    }
  ]


  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(MatchModel, "findAll")
      .resolves(mockMatches as MatchModel[]);
  });

  afterEach(() => {
    sinon.restore();
  });
  
  it('Tests if get all all matches', async () => {
    
    chaiHttpResponse = await chai.request(app).get('/matches');
    
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

});