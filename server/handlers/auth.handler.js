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
function authenticate(req, res, next) {
  let token;
  const err = new APIError('UNAUTHORIZED', httpStatus.UNAUTHORIZED, true);;
  if (req.headers.authorization)
    token = req.headers.authorization.split(' ')[1];
  else
    return next(err)

  try {
    req.jwtAccount = jwt.verify(token, config.jwtSecret);
  } catch (e) {
    return next(err)
  }

  if (req.jwtAccount) {
    Account.findOne({_id:req.jwtAccount.id, deleted: false}).then((account) => {
      if (!account)
        return next(err);
      return next();
    });
  } else
    return next(err);
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
    let err = new APIError('UNAUTHORIZED', httpStatus.UNAUTHORIZED, true);
    if (req.headers.authorization)
      token = req.headers.authorization.split(' ')[1];
    else
      return next(err)

    try {
      req.jwtAccount = jwt.verify(token, config.jwtSecret);
    } catch (e) {
      return next(err);
    }

    if (req.jwtAccount) {
      Account.findOne({_id:req.jwtAccount.id, deleted:false}).then((account) => {
        req.loggedAccount = account;
        if (!account || !acceptedRoles.includes(account.function.name)) {
          err = new APIError('FORBIDDEN', httpStatus.FORBIDDEN, true);
          return next(err);
        }
        return next();
      });
    } else
      return next(err);
  };
}

/**
 * 
 * @param {acceptedPropreties} acceptedPropreties {'clc':['comment'],'trc':['etd','eta']}
 */
function checkAcceptedPropreties(acceptedPropreties) {
  return (req, res, next) => {
    req.acceptedProps = acceptedPropreties[req.loggedAccount.function.name];
    if (!req.acceptedProps) {
      const err = new APIError('FORBIDDEN', httpStatus.FORBIDDEN, true);
      return next(err);
    } else {
      return next();
    }
  }
}

export default {
  authenticate,
  authAndCheckRoles,
  checkAcceptedPropreties
};
