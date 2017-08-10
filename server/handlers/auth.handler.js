import httpStatus from 'http-status';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import Account from '../models/account.model';
import config from '../../config/config';
import APIError from '../helpers/APIError';

/**
 * Authenticate using Token
 * usage:
 * import roleHandler from "..../roles.handler"
 * app.use('/random/route').get(authHandler.authenticate(), handlers..)
 * @returns {function(req,res,next)}
 */
function authenticate() {
  return expressJwt({
    secret: config.jwtSecret,
    requestProperty: 'jwtAccount'
  });
}

/**
 * Check for Account Roles
 * usage:
 * import authHandler from "..../auth.handler"
 * app.use('/random/route').get(authHandler.checkRoles(['super-admin', 'admin']), handlers..)
 * @param acceptedRoles -contains all accepted roles for a route
 * @returns {function(req,res,next)} -function that handles account role validation
 */
function authAndCheckRoles(acceptedRoles) {
  return (req, res, next) => {
    let token;
    let err;
    if (req.headers.authorization) token = req.headers.authorization.split(' ')[1];
    try {
      req.jwtAccount = jwt.verify(token, config.jwtSecret);
    } catch (e) {
      err = new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true);
    }
    if (req.jwtAccount) {
      Account.get(req.jwtAccount.id).then((account) => {
        if (!acceptedRoles.includes(account.role)) {
          err = new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true);
        }
      });
    }
    return next(err);
  };
}

export default {
  authenticate,
  authAndCheckRoles
};
