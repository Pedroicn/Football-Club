import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import UserModel from '../database/models/UserModel';
import { Response } from 'superagent';
import statusCodes from '../utils/statusCodes';


chai.use(chaiHttp);

const { expect } = chai;

describe('Testing route get /login/role', () => {

  const mockUser = {
    id: 1,
    username: "Pedro",
    role: "user",
    password: "$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO",
    email: "user@user.com",
  }

  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(UserModel, "findOne")
      .resolves(mockUser as UserModel);
  });

  afterEach(() => {
    sinon.restore();
  });
  
  it('tests that it is not possible to return an object without a token', async () => {
    
    chaiHttpResponse = await chai.request(app).get('/login/role');
    
    expect(chaiHttpResponse.status).to.be.equal(statusCodes.unauthorized);
    expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
  });

});