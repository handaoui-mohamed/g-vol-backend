import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import Account from '../models/account.model';
import APIError from '../helpers/APIError';
import config from '../../config/config';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  Account.findOne({
    username: req.body.username
  }).then((account) => {
    if (account) {
      if (account.comparePasswords(req.body.password)) {
        const token = jwt.sign({
          id: account.id
        }, config.jwtSecret, {
          expiresIn: '10h'
        });
        return res.json({
          token,
          account
        });
      }
    }
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    account: req.account,
    num: Math.random() * 100
  });
}

export default {
  login,
  getRandomNumber
};
