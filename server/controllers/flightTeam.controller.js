import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import APIError from '../helpers/APIError';


function add(req, res, next) {
    Flight.findByIdAndUpdate(req.params.flightId, { $push: { team: req.body.accountId } }, (err, flight) => {
        if (err) return next(err);
        res.status(httpStatus.CREATED).json(flight.team);
    }).catch(e => next(e));
}

function remove(req, res, next) {
    Flight.findByIdAndUpdate(req.params.flightId, { $pull: { team: req.body.accountId } }, (err, flight) => {
        if (err) return next(err);
        res.status(httpStatus.CREATED).json(flight.team);
    }).catch(e => next(e));
}

export default {
    add,
    remove
}