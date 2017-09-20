import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import APIError from '../helpers/APIError';

/**
 * Account Schema
 */
const funcs = ['superadmin', 'admin', 'trc', 'clc', 'tl', 'tb'];
const func = new mongoose.Schema({
  name: {
    type: String,
    enum: funcs,
    required: true
  },
  description: String
});
const gender = ['male', 'female'];
const AccountSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    lowercase: true
  },
  lastname: {
    type: String,
    required: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  email: {
    type: String,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Not valid email'],
    lowercase: true
  },
  phone: {
    type: String
  },
  sexe: {
    type: String,
    enum: gender,
    required: true
  },
  birthday: {
    type: Date
  },
  password: {
    type: String
  },
  function: {
    type: func,
    required: true
  },
  deleted: {
	  type: Boolean,
	  default: false
  },
  address: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

AccountSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
  }
});
/**
 * Methods
 */
AccountSchema.method({
  comparePasswords(password) {
    return bcrypt.compareSync(password, this.password);
  }
});

/**
 * Statics
 */
AccountSchema.statics = {
  /**
   * Get account
   * @param {ObjectId} id - The objectId of account.
   * @returns {Promise<Account, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((account) => {
        if (account) {
          return account;
        }
        const err = new APIError('No such account exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List accounts in descending order of 'createdAt' timestamp.
   * @param {object} query - all query to be searched for.
   * @param {number} skip - Number of accounts to be skipped.
   * @param {number} limit - Limit number of accounts to be returned.
   * @returns {Promise<Account[]>}
   */
  list(query = {}, {
    skip = 0,
    limit = 50
  } = {}) {
    return this.find(query)
      .sort({
        createdAt: -1
      })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
  hashPassword(password, rounds = 10) {
    return bcrypt.hashSync(password, rounds);
  }
};

/**
 * @typedef Account
 */
export default mongoose.model('Account', AccountSchema);
