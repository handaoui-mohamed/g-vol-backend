import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, {
  expect
} from 'chai';
import app from '../../index';
import Company from '../models/company.model';
import Account from '../models/account.model';

chai.config.includeStack = true;

describe('## Company APIs', () => {
  let company = {
    name: 'swissport',
    code: 'sp',
    checklist: [
      'document1',
      'document2',
      'document3',
      'document4'
    ]
  };

  after((done) => {
    Company.remove({
      code: 'sp'
    }).then(() => {
      done();
    });
  });

  const validUserCredentials = {
    username: 'useradmin',
    password: 'password'
  };

  let jwtToken;

  describe('# POST /api/auth/login-admin', () => {
    it('should login with Admin', (done) => {
      request(app)
        .post('/api/auth/login-admin')
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

  describe('# POST /api/companies', () => {
    it('should create a new company', (done) => {
      request(app)
        .post('/api/companies')
        .set('Authorization', jwtToken)
        .send(company)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.name).to.equal(company.name);
          expect(res.body.code).to.equal(company.code);
          expect(res.body.checklist.length).to.equal(company.checklist.length);
          company = res.body;
          done();
        })
        .catch(done);
    });

    it('should not create a new company', (done) => {
      request(app)
        .post('/api/companies')
        .set('Authorization', jwtToken)
        .send(company)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('Company code already used');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/companies/:companyId', () => {
    it('should get company details', (done) => {
      request(app)
        .get(`/api/companies/${company.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(company.name);
          expect(res.body.code).to.equal(company.code);
          expect(res.body.checklist.length).to.equal(company.checklist.length);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when compnay does not exists', (done) => {
      request(app)
        .get('/api/companies/56c787ccc67fc16ccc1aeaff')
        .expect(httpStatus.NOT_FOUND)
        .set('Authorization', jwtToken)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/companies/:companyId', () => {
    it('should update company details', (done) => {
      company.name = 'turkish';
      request(app)
        .put(`/api/companies/${company.id}`)
        .set('Authorization', jwtToken)
        .send(company)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('turkish');
          expect(res.body.code).to.equal(company.code);
          expect(res.body.checklist.length).to.equal(company.checklist.length);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/companies', () => {
    it('should get all companies', (done) => {
      request(app)
        .get('/api/companies')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all companies (with limit and skip)', (done) => {
      request(app)
        .get('/api/companies')
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
