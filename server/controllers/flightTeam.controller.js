import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import APIError from '../helpers/APIError';
import socketHandler from '../handlers/socket.handler';


function add(req, res, next) {
    const flightId = req.params.flightId;
    const accountId = req.body.accountId;
    const account = req.loggedAccount; // current connected account;

    if (account.function.name !== "clc" && account._id.toString() !== accountId) {
        let err = new APIError('UNAUTHORIZED', httpStatus.UNAUTHORIZED, true);
        return next(err);
    }
    Flight.findByIdAndUpdate(flightId, { $addToSet: { team: accountId } }, { "new": true }, (err, flight) => {
        if (err) return next(err);
        res.status(httpStatus.CREATED).json(flight.team);
    });
}

function remove(req, res, next) {
    const flightId = req.params.flightId;
    const accountId = req.body.accountId;
    const account = req.loggedAccount; // current connected account;

    if (account.function.name !== "clc" && account._id.toString() !== accountId) {
        let err = new APIError('UNAUTHORIZED', httpStatus.UNAUTHORIZED, true);
        return next(err);
    }
    Flight.findByIdAndUpdate(flightId, { $pull: { team: accountId } }, { "new": true }, (err, flight) => {
        if (err) return next(err);

        // remove account from flight socket
        socketHandler.removeAccountfromFlight(accountId, flightId);

        res.status(httpStatus.CREATED).json(flight.team);
    });
}

export default {
    add,
    remove
}