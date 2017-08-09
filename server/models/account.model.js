import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import APIError from '../helpers/APIError';

/**
 * Account Schema
 */
const funcs = ['TRC', 'CLC', 'TL', 'Tri bagage'];
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
  function: func,
  adress: String,
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
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});
/**
 * Methods
 */
AccountSchema.method({
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
   * @param {number} skip - Number of accounts to be skipped.
   * @param {number} limit - Limit number of accounts to be returned.
   * @returns {Promise<Account[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
  hashPassword(password, rounds = 10) {
    return bcrypt.hashSync(password, rounds);
  },
  comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
};

/**
 * @typedef Account
 */
export default mongoose.model('Account', AccountSchema);
