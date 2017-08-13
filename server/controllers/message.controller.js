import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import APIError from '../helpers/APIError';

// Create new message
function create(req, res, next) {
    const flight = req.flight;
    flight.messages.push(req.body);
    flight.save()
        .then(savedFlight => res.status(httpStatus.CREATED).json(savedFlight.messages[savedFlight.messages.lenght - 1]))
        .catch(e => next(e));
}