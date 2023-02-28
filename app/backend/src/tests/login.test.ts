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

  it('test login without email in the parameter', async () => {
   
    chaiHttpResponse = await chai
      .request(app)
      .post('/login').send({ password:'secret_user' })
    expect(chaiHttpResponse.status).to.be.equal(400);

    expect(chaiHttpResponse.body.message).to.be.equal("All fields must be filled");

  });

  it('test login without password in the parameter', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send({ email: 'user@user.com' });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields muts be filled');
  });

});