import fs from "fs";
import Account from "./server/models/account.model";

export default {
  generateAdmin() {
    Account.findOne({
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
          role: 'super-admin',
          function: {
            name: 'CLC'
          },
          password: '$2a$10$DZel0LYKKMTfYeNsSDOT3.dNgVvGbk20e1X.IsiqAIy9pMy4tAXm6'
        };
        Account.create(admin).then(() => {
          console.log('-- Admin account succefully created');
        })
      }
    });
  },
  generateFakers() {
    console.log('\n1- Creating fakers....');
    console.log('\n   1.1- Creating account fakers....');
    fs.readFile('./fakers/accounts.json', 'utf8', function (err, data) {
      if (err) throw err;
      var accounts = JSON.parse(data);
      Account.collection.insertMany(accounts, (err, r) => {
        console.log('\n   ---- Fakers account succefully created');
      })
    });

    console.log('\n   1.2- Creating companies fakers....');
  }
}
