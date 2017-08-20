import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, {
  expect
} from 'chai';
import app from '../../index';
import Flight from '../models/flight.model';

chai.config.includeStack = true;

describe('## Flight APIs', () => {
  after((done) => {
    Flight.remove({
      _id: flight._id
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
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/flights', () => {
    it('should not create a new flight', (done) => {
      request(app)
        .post('/api/flights')
        .set('Authorization', clcToken)
        .send(flight)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('UNAUTHORIZED');
          done();
        })
        .catch(done);
    });

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

    it('should not create a new flight', (done) => {
      request(app)
        .post('/api/flights')
        .set('Authorization', adminToken)
        .send(flight)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/flights/:flightId', () => {
    it('should get flight details', (done) => {
      request(app)
        .get(`/api/flights/${flight._id}`)
        .set('Authorization', clcToken)
        .expect(httpStatus.OK)
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
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when compnay does not exists', (done) => {
      request(app)
        .get('/api/flights/56c787ccc67fc16ccc1aeaff')
        .expect(httpStatus.NOT_FOUND)
        .set('Authorization', adminToken)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/flights/:flightId', () => {
    it('should update only flight comment', (done) => {
      flight.comment = 'this is a comment';
      flight.dest = 'france';
      request(app)
        .put(`/api/flights/${flight._id}`)
        .set('Authorization', clcToken)
        .send(flight)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.comment).to.equal('this is a comment');
          expect(res.body.dest).to.equal('alg');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/flights', () => {
    it('should get all flights by Admin', (done) => {
      request(app)
        .get('/api/flights')
        .set('Authorization', adminToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/flights', () => {
    it('should get all flights by CLC', (done) => {
      request(app)
        .get('/api/flights')
        .set('Authorization', clcToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
});
