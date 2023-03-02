import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import { Response } from 'superagent';
import statusCodes from '../utils/statusCodes';


chai.use(chaiHttp);

const { expect } = chai;

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJpYXQiOjE2Nzc3Njc3MzR9.LwGoTmw2tSlGOAkcZjSaoe4Es-uvZlSvR-ZkxyLQs-4';

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

describe('Testing route /matches with method post to create match', () => {

  let chaiHttpResponse: Response;

  afterEach(() => {
    sinon.restore();
  });

  const mockMatchCreated = {
    id: 49,
    homeTeamId: 1,
    awayTeamId: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
    inProgress: true
  }
  
  // it('Tests if a match was created with a valid token', async () => {
  //   sinon.stub(TeamModel, 'findOne').resolves()
  //   sinon
  //     .stub(MatchModel, "create")
  //     .resolves(mockMatchCreated as MatchModel);

  //   const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJpYXQiOjE2Nzc3Njc3MzR9.LwGoTmw2tSlGOAkcZjSaoe4Es-uvZlSvR-ZkxyLQs-4';

  //   chaiHttpResponse = await chai.request(app).post('/matches')
  //   .send({
  //     homeTeamId: 16,
  //     awayTeamId: 8,
  //     homeTeamGoals: 2,
  //     awayTeamGoals: 2
  //   })
  //   .set({authorization: validToken});
    
  //   expect(chaiHttpResponse.status).to.be.equal(statusCodes.created);

  //   expect(chaiHttpResponse.body.message).to.be.deep.equal({
  //     id: 49,
  //     homeTeamId: 16,
  //     awayTeamId: 8,
  //     homeTeamGoals: 2,
  //     awayTeamGoals: 2,
  //     inProgress: true
  //   });
  // });

  it('Tests if there is an error in the route /matches with invalid token', async () => {
    sinon
      .stub(MatchModel, "create")
      .resolves();

    chaiHttpResponse = await chai.request(app).post('/matches')
    .send({
      homeTeamId: 16,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    })
    .set({authorization: 'INVALID_TOKEN'});
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);

    expect(chaiHttpResponse.body.message).to.be.equal("Token must be a valid token");
  });

  it('Tests if there is an error in the route /matches with no token', async () => {
    sinon
      .stub(MatchModel, "create")
      .resolves();

    chaiHttpResponse = await chai.request(app).post('/matches')
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);

    expect(chaiHttpResponse.body.message).to.be.equal("Token not found");
  });

  it('Tests if there is an error in the route /matches with the same teams in the req', async () => {
    sinon
      .stub(MatchModel, "create")
      .resolves();

    chaiHttpResponse = await chai.request(app).post('/matches').send({
      homeTeamId: 8,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    }).set({ authorization: validToken })
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unprocessable);

    expect(chaiHttpResponse.body.message).to.be.equal('It is not possible to create a match with two equal teams');
  });

  it('Tests if there is an error in the route /matches in case one of the teams doesnt exist in the database', async () => {
    sinon
      .stub(MatchModel, "create")
      .resolves();

    chaiHttpResponse = await chai.request(app).post('/matches').send({
      homeTeamId: 100,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    }).set({ authorization: validToken })
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.notFound);

    expect(chaiHttpResponse.body.message).to.be.equal('There is no team with such id!');
  });


});