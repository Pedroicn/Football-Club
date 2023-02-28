import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import UserModel from '../database/models/UserModel';
import { Response } from 'superagent';


chai.use(chaiHttp);

const { expect } = chai;

describe('Testing route /login', () => {
 
  const mockUser = {
    id: 1,
    username: "Pedro",
    role: "user",
    password: "secret_user",
    email: "user@user.com",
  }

  const mockLogin = {
    email: 'user@user.com', 
    password:'secret_user'
  };
  
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(UserModel, "findOne")
      .resolves(mockUser as UserModel);
  });

  afterEach(() => {
    (UserModel.findOne as sinon.SinonStub).restore();
  });

  it('Tests login user with correct params', async () => {
   
    chaiHttpResponse = await chai
      .request(app)
      .post('/login').send(mockLogin)
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).not.to.be.empty;
    expect(chaiHttpResponse.body).to.haveOwnProperty('token');

  });

});