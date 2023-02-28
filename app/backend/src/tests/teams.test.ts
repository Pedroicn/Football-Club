import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

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

});