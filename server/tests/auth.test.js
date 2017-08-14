import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, {
  expect
} from 'chai';
import app from '../../index';
import config from '../../config/config';
import Account from '../models/account.model';

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  let accountToDelete = {};
  before((done) => {
    Account.create({
      username: 'accounttodelete',
      firstname: 'firstname',
      lastname: 'lastname',
      sexe: 'male',
      function: {
        name: 'clc'
      },
      password: 'password'
    }).then((account) => {
      accountToDelete = account;
      done();
    });
  });

  const validUserCredentials = {
    username: 'useradmin',
    password: 'password'
  };

  const invalidUserCredentials = {
    username: 'username',
    password: 'IDontKnow'
  };

  let jwtToken;

  describe('# POST /api/auth/login-:accountType', () => {
    it('should return Authentication error due to invalid account - /login-admin', (done) => {
      request(app)
        .post('/api/auth/login-admin')
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Authentication error');
          done();
        })
        .catch(done);
    });

    it('should return Authentication error due to account type is admin - /login-clc', (done) => {
      request(app)
        .post('/api/auth/login-clc')
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Authentication error');
          done();
        })
        .catch(done);
    });

    it('should get valid JWT token', (done) => {
      request(app)
        .post('/api/auth/login-admin')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            Account.get(decoded.id).then((account) => {
              expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
              expect(account.username).to.equal(validUserCredentials.username);
              validUserCredentials.id = account.id;
              jwtToken = `Bearer ${res.body.token}`;
              done();
            });
          });
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/accounts/:accountId', () => {
    it('should fail to delete account because of missing Authorization', (done) => {
      request(app)
        .delete(`/api/accounts/${accountToDelete.id}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('UNAUTHORIZED');
          done();
        })
        .catch(done);
    });

    it('should fail to delete account because of wrong token', (done) => {
      request(app)
        .delete(`/api/accounts/${accountToDelete.id}`)
        .set('Authorization', 'Bearer inValidToken')
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('UNAUTHORIZED');
          done();
        })
        .catch(done);
    });

    it('should delete account', (done) => {
      request(app)
        .delete(`/api/accounts/${accountToDelete.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(accountToDelete.username);
          done();
        })
        .catch(done);
    });
  });
});
