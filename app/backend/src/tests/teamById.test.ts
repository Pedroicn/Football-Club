import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing route /teams/:id', () => {

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

});