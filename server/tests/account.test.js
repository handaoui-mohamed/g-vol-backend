import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, {
  expect
} from 'chai';
import app from '../../index';
import Account from '../models/account.model';

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Account APIs', () => {
  let account = {
    username: 'username',
    phone: '0217777777',
    firstname: 'firstname',
    lastname: 'lastname',
    email: 'user@gmail.com',
    sexe: 'female',
    birthday: '05/05/1988',
    address: 'user test town',
    function: {
      name: 'trc'
    },
    password: 'password'
  };

  after((done) => {
    Account.remove({
      username: 'username'
    }).then(() => {
      done();
    });
  });

  const validUserCredentials = {
    username: 'useradmin',
    password: 'password'
  };

  let jwtToken;

  describe('# POST /api/auth/login', () => {
    it('should login with Admin', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwtToken = `Bearer ${res.body.token}`;
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/accounts', () => {
    it('should create a new account', (done) => {
      request(app)
        .post('/api/accounts')
        .set('Authorization', jwtToken)
        .send(account)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.username).to.equal(account.username);
          expect(res.body.firstname).to.equal(account.firstname);
          expect(res.body.lastname).to.equal(account.lastname);
          expect(res.body.email).to.equal(account.email);
          expect(res.body.phone).to.equal(account.phone);
          expect(res.body.sexe).to.equal(account.sexe);
          expect(res.body.address).to.equal(account.address);
          expect(res.body.function.name).to.equal(account.function.name);
          expect(res.body.function.description).to.equal(account.function.description);
          account = res.body;
          done();
        })
        .catch(done);
    });

    it('should not create a new account', (done) => {
      request(app)
        .post('/api/accounts')
        .set('Authorization', jwtToken)
        .send(account)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('Username already exists');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/accounts/:accountId', () => {
    it('should get account details', (done) => {
      request(app)
        .get(`/api/accounts/${account.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(account.username);
          expect(res.body.firstname).to.equal(account.firstname);
          expect(res.body.lastname).to.equal(account.lastname);
          expect(res.body.email).to.equal(account.email);
          expect(res.body.phone).to.equal(account.phone);
          expect(res.body.sexe).to.equal(account.sexe);
          expect(res.body.address).to.equal(account.address);
          expect(res.body.function.name).to.equal(account.function.name);
          expect(res.body.function.description).to.equal(account.function.description);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when account does not exists', (done) => {
      request(app)
        .get('/api/accounts/56c787ccc67fc16ccc1aeaff')
        .expect(httpStatus.NOT_FOUND)
        .set('Authorization', jwtToken)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/accounts/:accountId', () => {
    it('should update account details', (done) => {
      account.firstname = 'new firstname';
      request(app)
        .put(`/api/accounts/${account.id}`)
        .set('Authorization', jwtToken)
        .send(account)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.firstname).to.equal('new firstname');
          expect(res.body.username).to.equal(account.username);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/accounts/', () => {
    it('should get all accounts', (done) => {
      request(app)
        .get('/api/accounts')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all accounts (with limit and skip)', (done) => {
      request(app)
        .get('/api/accounts')
        .set('Authorization', jwtToken)
        .query({
          limit: 10,
          skip: 1
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
});
