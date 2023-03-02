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

describe('Testing route /matches', () => {

  interface mock extends MatchModel {
    homeTeam: {
      teamName: string;
    },
    awayTeam: {
      teamName: string;
    }      
  }

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

  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(MatchModel, "findAll")
      .resolves(expectedReturn as mock[]);
  });

  afterEach(() => {
    sinon.restore();
  });
  
  it.only('Tests if get all all matches', async () => {
    
    chaiHttpResponse = await chai.request(app).get('/matches');
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.ok);

    expect(chaiHttpResponse.body).to.be.deep.equal(expectedReturn);
  });

});