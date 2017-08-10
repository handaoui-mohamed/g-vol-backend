import httpStatus from 'http-status';
import Company from '../models/company.model';
import APIError from '../helpers/APIError';

/**
 * Load company and append to req.
 */
function load(req, res, next, id) {
  Company.get(id)
    .then((company) => {
      req.company = company; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}
/**
 * Get company
 * @returns {Company}
 */
function get(req, res) {
  return res.json(req.company);
}

// Create new company
function create(req, res, next) {
    Company.findOne({ code: req.body.code.toLowerCase() }).then((result) => {
    if (result) {
      const err = new APIError('Company code already used', httpStatus.BAD_REQUEST, true);
      next(err);
    } else {
      const company = new Company(req.body);
      company.save()
        .then(savedCompany => res.status(httpStatus.CREATED).json(savedCompany))
        .catch(e => next(e));
    }
  });
}

/**
 * Update existing compny
 * @property {Company} req.body - The company.
 * @returns {Company}
 */
function update(req, res, next) {
  const company = req.company;
  const data = req.body;
  company.name = data.name; 
  company.checklist = data.checklist ;
  company.save()
    .then(savedCompany => res.json(savedCompany))
    .catch(e => next(e));
}

/**
 * Get company list.
 * @property {number} req.query.skip - Number of companiess to be skipped.
 * @property {number} req.query.limit - Limit number of companies to be returned.
 * @returns {Companies[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Company.list({ limit, skip })
    .then(companies => res.json(companies))
    .catch(e => next(e));
}

/**
 * Delete company.
 * @returns {Company}
 */
function remove(req, res, next) {
  const company = req.company;
  company.remove()
    .then(deletedCompany => res.json(deletedCompany))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
