import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import APIError from '../helpers/APIError';

/**
 * Load flight and append to req.
 */
function load(req, res, next, id) {
  Flight.get(id)
    .then((flight) => {
      req.flight = flight; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get flight
 * @returns {Flight}
 */
function get(req, res) {
  return res.json(req.flight);
}

// Create new flight
function create(req, res, next) {
  const flight = new Flight(req.body);
  flight.save()
    .then(savedFlight => res.status(httpStatus.CREATED).json(savedFlight))
    .catch(e => next(e));
}

// Create new flights batch
function createFlights(req, res, next) {
  const flights = req.body.flights;
  Flight.collection.insertMany(flights, (err, r) => {
    if (err) return next(e)
    res.status(httpStatus.CREATED).json({});
  })
}

/**
 * Update existing flight
 * @property {Flight} req.body - The flight.
 * @returns {Flight}
 */
function update(req, res, next) {
  const flight = req.flight;
  const data = req.body;

  req.acceptedProps.forEach((proprety) => {
    flight.set(proprety, data[proprety]);
  });

  flight.save()
    .then(savedFlight => res.json(savedFlight))
    .catch(e => next(e));
}

/**
 * Get flight list.
 * @property {number} req.query.skip - Number of flights to be skipped.
 * @property {number} req.query.limit - Limit number of flights to be returned.
 * @returns {Flight[]}
 */
function list(req, res, next) {
  const {
    limit = 50, skip = 0, q, status
  } = req.query;

  const query = Object.assign({}, q ? {
    flightNumber: {
      $regex: q,
      $options: "i"
    }
  } : null, status ? {
    status: {
      $in: status
    }
  } : null);

  const arrivalDate = Object.assign({},
    req.query.arrivalstart ? {
      $gte: new Date(req.query.arrivalstart)
    } : null,
    req.query.arrivalend ? {
      $lte: new Date(req.query.arrivalend)
    } : null);

  const departureDate = Object.assign({},
    req.query.departurestart ? {
      $gte: new Date(req.query.departurestart)
    } : null,
    req.query.departureend ? {
      $lte: new Date(req.query.departureend)
    } : null);

  if (arrivalDate.$gte || arrivalDate.$lte) {
    query.$or = [{
      arrivalDate
    }];
  }

  if (departureDate.$gte || departureDate.$lte) {
    const departure = {
      departureDate
    }
    query.$or = query.$or ? query.$or.push(departure) : [departure];
  }

  Flight.list(query, {
      limit,
      skip
    })
    .then(flights => res.json(flights))
    .catch(e => next(e));
}
/**
 * Get flights count.
 * @returns {Number}
 */
function count(req, res, next) {
  Flight.count({})
    .then(count => res.json({
      count
    }))
    .catch(e => next(e));
}

/**
 * Delete flight.
 * @returns {Flight}
 */
function remove(req, res, next) {
  const flight = req.flight;
  flight.remove()
    .then(deletedFlight => res.json(deletedFlight))
    .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  count,
  remove,
  createFlights
};
