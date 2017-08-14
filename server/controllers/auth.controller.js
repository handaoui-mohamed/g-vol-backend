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
  const accountType = req.params.accountType;
  Account.findOne({
    username: req.body.username
  }).then((account) => {
    if (account) {
      if ((account.function.name).indexOf(accountType) === -1) {
        return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
      }
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
    return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
  });
}

export default {
  login
};
