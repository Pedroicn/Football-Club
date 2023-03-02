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

  const mockInProgressTrue = [
    {
      id: 1,
      homeTeamId: 16,
      homeTeamGoals: 1,
      awayTeamId: 8,
      awayTeamGoals: 1,
      inProgress: true,
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

  // beforeEach(async () => {
  //   sinon
  //     .stub(MatchModel, "findAll")
  //     .resolves(expectedReturn as mock[]);
  // });

  afterEach(() => {
    sinon.restore();
  });
  
  it('Tests if get all all matches', async () => {
    sinon
      .stub(MatchModel, "findAll")
      .resolves(expectedReturn as mock[]);
    
    chaiHttpResponse = await chai.request(app).get('/matches');
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.ok);

    expect(chaiHttpResponse.body).to.be.deep.equal(expectedReturn);
  });

  it('Tests if get all matches in progress', async () => {
    sinon
      .stub(MatchModel, "findAll")
      .resolves(mockInProgressTrue as mock[]);
    
    chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.ok);

    expect(chaiHttpResponse.body).to.be.deep.equal(mockInProgressTrue);
  });

});

describe('Testing route /matches/:id/finish', () => {

  let chaiHttpResponse: Response;

  afterEach(() => {
    sinon.restore();
  });
  
  it('Tests if a match is finished', async () => {
    sinon
      .stub(MatchModel, "update")
      .resolves();

    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJpYXQiOjE2Nzc3Njc3MzR9.LwGoTmw2tSlGOAkcZjSaoe4Es-uvZlSvR-ZkxyLQs-4';

    chaiHttpResponse = await chai.request(app).patch('/matches/43/finish')
    .set({authorization: validToken});
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.ok);

    expect(chaiHttpResponse.body.message).to.be.equal("Finished");
  });

  it('Tests route finish with invalid token', async () => {
    sinon
      .stub(MatchModel, "update")
      .resolves();

    chaiHttpResponse = await chai.request(app).patch('/matches/43/finish')
    .set({authorization: 'INVALID_TOKEN'});
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);

    expect(chaiHttpResponse.body.message).to.be.equal("Token must be a valid token");
  });

  it('Tests route finish without a token', async () => {
    sinon
      .stub(MatchModel, "update")
      .resolves();

    chaiHttpResponse = await chai.request(app).patch('/matches/43/finish')
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);

    expect(chaiHttpResponse.body.message).to.be.equal("Token not found");
  });


});

describe('Testing route /matches/:id', () => {

  let chaiHttpResponse: Response;

  afterEach(() => {
    sinon.restore();
  });
  
  it('Tests if a match was uptdated', async () => {
    sinon
      .stub(MatchModel, "update")
      .resolves();

    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJpYXQiOjE2Nzc3Njc3MzR9.LwGoTmw2tSlGOAkcZjSaoe4Es-uvZlSvR-ZkxyLQs-4';

    chaiHttpResponse = await chai.request(app).patch('/matches/2')
    .send({
      homeTeamGoals: 3,
      awayTeamGoals: 1
    })
    .set({authorization: validToken});
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.ok);

    expect(chaiHttpResponse.body.message).to.be.equal("Updated");
  });

  it('Tests route /matches/:id with invalid token', async () => {
    sinon
      .stub(MatchModel, "update")
      .resolves();

    chaiHttpResponse = await chai.request(app).patch('/matches/2')
    .send({
      homeTeamGoals: 3,
      awayTeamGoals: 1
    })
    .set({authorization: 'INVALID_TOKEN'});
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);

    expect(chaiHttpResponse.body.message).to.be.equal("Token must be a valid token");
  });

  it('Tests route /matches/:id without a token', async () => {
    sinon
      .stub(MatchModel, "update")
      .resolves();

    chaiHttpResponse = await chai.request(app).patch('/matches/2')
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);

    expect(chaiHttpResponse.body.message).to.be.equal("Token not found");
  });


});