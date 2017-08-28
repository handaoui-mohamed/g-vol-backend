import fs from "fs";
import Account from "./server/models/account.model";
import Company from "./server/models/company.model";

import mongoose from 'mongoose';

// config should be imported before importing any other file
import config from './config/config';

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;
let promises = [];

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, {
  server: {
    socketOptions: {
      keepAlive: 1
    }
  }
});

mongoose.connection.on('connected', function () {
  console.log(`connected to database: ${mongoUri}`);
  generateAdmin();
  generateFakers();
  Promise.all(promises).then(() => {
    mongoose.connection.close();
  });
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

function generateAdmin() {
  promises.push(Account.findOne({
    username: "superadmin"
  }).then((account) => {
    if (!account) {
      console.log('\n2- Creating admin account....');
      const admin = {
        username: 'superadmin',
        phone: '0217777777',
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'user@gmail.com',
        sexe: 'male',
        birthday: '05/05/1988',
        address: 'user test town',
        function: {
          name: 'superadmin'
        },
        password: '$2a$10$DZel0LYKKMTfYeNsSDOT3.dNgVvGbk20e1X.IsiqAIy9pMy4tAXm6'
      };
      Account.create(admin).then(() => {
        console.log('-- Admin account succefully created');
      })
    }
  }));
}


function generateFakers() {
  console.log('\n1- Creating fakers....');
  console.log('\n   1.1- Creating account fakers....');
  promises.push(fs.readFile('./fakers/accounts.json', 'utf8', function (err, data) {
    if (err) throw err;
    var accounts = JSON.parse(data);
    promises.push(Account.collection.insertMany(accounts, (err, r) => {
      console.log('\n   ---- Fakers accounts succefully created');
    }))
  }));

  console.log('\n   1.2- Creating companies fakers....');
  promises.push(fs.readFile('./fakers/companies.json', 'utf8', function (err, data) {
    if (err) throw err;
    var companies = JSON.parse(data);
    promises.push(Company.collection.insertMany(companies, (err, r) => {
      console.log('\n   ---- Fakers companies succefully created');
    }))
  }));
}