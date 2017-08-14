import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import APIError from '../helpers/APIError';
import mongoose from 'mongoose';

// Create new message into a flight
function create(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        req.body.accountId = req.jwtAccount.id ; 
        flight.messages.unshift(req.body);
        flight.save()
            .then(savedFlight => res.status(httpStatus.CREATED).json(savedFlight.messages[0]))
            .catch(e => next(e));
    })
        .catch(e => next(e));

}

// List messages of a flight 

function list(req, res, next) {
    const { limit = 20, skip = 0 } = req.query;
    Flight.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.flightId) } },
        { $project: { messages: { $slice: ["$messages",parseInt(skip), parseInt(limit)] } } }
    ], function (err, result) {
        // const messages = result
        if (err) { return next(err) }
        else if (result.lenght > 0) res.json(result[0].messages); 
        else res.json(result) ;

    });
}

export default { create, list }; 