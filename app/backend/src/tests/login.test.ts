import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import statusCodes from '../utils/statusCodes';

import UserModel from '../database/models/UserModel';
import { Response } from 'superagent';


chai.use(chaiHttp);

const { expect } = chai;

describe('Testing route /login', () => {
 
  const mockUser = {
    id: 1,
    username: "Pedro",
    role: "user",
    password: "$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO",
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
    // (UserModel.findOne as sinon.SinonStub).restore();
    sinon.restore();
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
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

});

describe('Testing route /login with incorrect params', () => {
 
  const mockUser = {
    id: 1,
    username: "Pedro",
    role: "user",
    password: "secret_user",
    email: "user@user.com",
  }

  const mockInvalidEmail = {
    email: 'test.com', 
    password:'secret_user'
  };
  
  const mockInvalidPass = {
    email: 'user@user.com', 
    password:'123'
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

  it('Tests login user with incorrect email', async () => {
   
    chaiHttpResponse = await chai
      .request(app)
      .post('/login').send(mockInvalidEmail)
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');

  });

  it('Tests login user with incorrect password', async () => {
   
    chaiHttpResponse = await chai
      .request(app)
      .post('/login').send(mockInvalidPass)
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');
  });

  it('Tests loginUser with email in the correct format but is not registered', async () => {
  
    chaiHttpResponse = await chai
      .request(app)
      .post('/login').send({
        email: 'pedro@test.com',
        password: 'secret_user',
      })
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');

  });

  it('Tests loginUser with password in the correct format but is not registered', async () => {
  
    chaiHttpResponse = await chai
      .request(app)
      .post('/login').send({
        email: 'user@user.com',
        password: '12345678',
      })
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');

  });


});