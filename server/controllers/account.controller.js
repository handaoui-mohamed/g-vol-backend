import httpStatus from 'http-status';
import Account from '../models/account.model';
import APIError from '../helpers/APIError';

/**
 * Load account and append to req.
 */
function load(req, res, next, id) {
  Account.get(id)
    .then((account) => {
      req.account = account; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get account
 * @returns {Account}
 */
function get(req, res) {
  return res.json(req.account);
}

// Create new account
function create(req, res, next) {
  Account.findOne({
    username: req.body.username.toLowerCase()
  }).then((result) => {
    if (result) {
      const err = new APIError('Username already exists', httpStatus.BAD_REQUEST, true);
      next(err);
    } else {
      const account = new Account(req.body);
      account.password = Account.hashPassword(account.password);
      account.save()
        .then(savedAccount => res.status(httpStatus.CREATED).json(savedAccount))
        .catch(e => next(e));
    }
  });
}

/**
 * Update existing account
 * @property {Account} req.body - The account.
 * @returns {Account}
 */
function update(req, res, next) {
  const account = req.account;
  const data = req.body;
  account.firstname = data.firstname;
  account.lastname = data.lastname;
  account.phone = data.phone;
  account.email = data.email;
  account.sexe = data.sexe;
  account.birthday = data.birthday;
  account.function.name = data.function.name;
  account.function.description = data.function.description;

  if (data.password) account.password = Account.hashPassword(data.password);

  account.save()
    .then(savedAccount => res.json(savedAccount))
    .catch(e => next(e));
}

/**
 * Get account list.
 * @property {number} req.query.skip - Number of accounts to be skipped.
 * @property {number} req.query.limit - Limit number of accounts to be returned.
 * @returns {Account[]}
 */
function list(req, res, next) {
  const {
    limit = 50, skip = 0, q, functions = ['clc', 'trc', 'tl', 'tb']
  } = req.query;

  const query = Object.assign({}, q ? {
    $or: [{
        username: {
          $regex: q,
          $options: "i"
        }
      },
      {
        firstname: {
          $regex: q,
          $options: "i"
        }
      },
      {
        lastname: {
          $regex: q,
          $options: "i"
        }
      }
    ]
  } : null);
  
  query["function.name"] = {
    $in: functions
  };

  Account.list(query, {
      limit,
      skip
    })
    .then(accounts => res.json(accounts))
    .catch(e => next(e));
}

/**
 * Get accounts count.
 * @returns {Number}
 */
function count(req, res, next) {
  Account.count({})
    .then(count => res.json({
      count
    }))
    .catch(e => next(e));
}

/**
 * Delete account.
 * @returns {Account}
 */
function remove(req, res, next) {
  const account = req.account;
  let err;
  if (!req.jwtAccount) {
    err = new APIError('UNAUTHORIZED', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }
  if (account._id.toString() === req.jwtAccount.id) {
    err = new APIError('UNAUTHORIZED', httpStatus.UNAUTHORIZED, true);
    return next(err);
  } else
    account.remove()
    .then(deletedAccount => res.json(deletedAccount))
    .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  count,
  remove
};
