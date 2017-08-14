import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, {
  expect
} from 'chai';
import app from '../../index';
import Flight from '../models/flight.model';

chai.config.includeStack = true;

describe('## Messages APIs', () => {
  after((done) => {
    Flight.remove({
      _id: flight.id
    }).then(() => {
      done();
    });
  })
  let flight = {
    flightNumber: 'QR1999',
    arrivalDate: '03/03/2010',
    departureDate: '06/03/2000',
    acType: 'random',
    sta: '1000',
    std: '1200',
    ata: '2315',
    atd: '2100',
    eta: '1800',
    etd: '1830',
    configuration: 'y180',
    registration: '181206',
    dest: 'alg',
    company: '5991563c1a754023d0aa988e'
  };

  const validAdminCredentials = {
    username: 'useradmin',
    password: 'password'
  };

  const validClcCredentials = {
    username: 'userclc',
    password: 'password'
  };

  let adminToken;
  let clcToken;
  let clcAccount;

  describe('# POST /api/auth/login-admin', () => {
    it('should login with Admin', (done) => {
      request(app)
        .post('/api/auth/login-admin')
        .send(validAdminCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          adminToken = `Bearer ${res.body.token}`;
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/login-clc', () => {
    it('should login with CLC', (done) => {
      request(app)
        .post('/api/auth/login-clc')
        .send(validClcCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          clcToken = `Bearer ${res.body.token}`;
          clcAccount = res.body.account;
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/flights', () => {
    it('should create a new flight', (done) => {
      request(app)
        .post('/api/flights')
        .set('Authorization', adminToken)
        .send(flight)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.flightNumber).to.equal(flight.flightNumber);
          expect(res.body.configuration).to.equal(flight.configuration);
          expect(res.body.registration).to.equal(flight.registration);
          expect(res.body.company).to.equal(flight.company);
          expect(res.body.dest).to.equal(flight.dest);
          expect(res.body.acType).to.equal(flight.acType);
          expect(res.body.sta).to.equal(flight.sta);
          expect(res.body.std).to.equal(flight.std);
          expect(res.body.ata).to.equal(flight.ata);
          expect(res.body.atd).to.equal(flight.atd);
          expect(res.body.eta).to.equal(flight.eta);
          expect(res.body.etd).to.equal(flight.etd);
          expect(res.body.arrivalDate).to.equal((new Date(flight.arrivalDate)).toISOString());
          expect(res.body.departureDate).to.equal((new Date(flight.departureDate)).toISOString());

          flight = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/flight-messages/:flightId', () => {
    it('should not send a new message - when admin account', (done) => {
      request(app)
        .post(`/api/flight-messages/${flight.id}`)
        .set('Authorization', adminToken)
        .send(flight)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('UNAUTHORIZED');
          done();
        })
        .catch(done);
    });

    it('should not send a new message - when invalid flight id', (done) => {
      request(app)
        .get('/api/flight-messages/56c787ccc67fc16ccc1aeaff')
        .expect(httpStatus.OK)
        .set('Authorization', clcToken)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should send a new message', (done) => {
      request(app)
        .post(`/api/flight-messages/${flight.id}`)
        .set('Authorization', clcToken)
        .send({
          content: "hello"
        })
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.content).to.equal('hello');
          expect(res.body.accountId).to.equal(clcAccount.id);
          done();
        })
        .catch(done);
    });

    it('should send a new message', (done) => {
      request(app)
        .post(`/api/flight-messages/${flight.id}`)
        .set('Authorization', clcToken)
        .send({
          content: "hello2"
        })
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.content).to.equal('hello2');
          expect(res.body.accountId).to.equal(clcAccount.id);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/flight-messages/:flightId', () => {
    it('should get max 20 messages by CLC', (done) => {
      request(app)
        .get(`/api/flight-messages/${flight.id}`)
        .set('Authorization', clcToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
          expect(res.body.length).to.below(20);
          done();
        })
        .catch(done);
    });

    it('should get all messages by CLC', (done) => {
      request(app)
        .get(`/api/flight-messages/${flight.id}?skip=1&limit=1`)
        .set('Authorization', clcToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(1);
          done();
        })
        .catch(done);
    });
  });
});
