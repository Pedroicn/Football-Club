import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
// import Example from '../database/models/ExampleModel';
import TeamModel from '../database/models/TeamModel';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing route /teams', () => {

  const mockTeams = [
    {
      "id": 1,
      "teamName": "Avaí/Kindermann"
    },
    {
      "id": 2,
      "teamName": "Bahia"
    },
    {
      "id": 3,
      "teamName": "Botafogo"
    },
  ]

  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(TeamModel, "findAll")
      .resolves(mockTeams as TeamModel[]);
  });

  afterEach(() => {
    (TeamModel.findAll as sinon.SinonStub).restore();
  });
  
  it('Tests if get all teams', async () => {
    
    chaiHttpResponse = await chai.request(app).get('/teams');
    
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  

  // it('Seu sub-teste', () => {
  //   expect(false).to.be.eq(true);
  // });
});

describe('Testing route /teams/:id', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */
  const mockTeam = {id:5, teamName:"Cruzeiro"};
  
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(TeamModel, "findOne")
      .resolves(mockTeam as TeamModel);
  });

  afterEach(() => {
    (TeamModel.findOne as sinon.SinonStub).restore();
  });

  it('Tests if get team by id', async () => {
   

    chaiHttpResponse = await chai.request(app).get('/teams/5')
    expect(chaiHttpResponse.status).to.be.equal(200)
    expect(chaiHttpResponse.body).to.be.deep.equal({id:5, teamName:"Cruzeiro"})

  });

  // it('Seu sub-teste', () => {
  //   expect(false).to.be.eq(true);
  // });
});


