import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import APIError from '../helpers/APIError';
import socketHandler from '../handlers/socket.handler';


function add(req, res, next) {
    const flightId = req.params.flightId;
    const accountId = req.body.accountId;

    Flight.findByIdAndUpdate(flightId, { $push: { team: accountId } }, (err, flight) => {
        if (err) return next(err);
        res.status(httpStatus.CREATED).json(flight.team);
    }).catch(e => next(e));
}

function remove(req, res, next) {
    const flightId = req.params.flightId;
    const accountId = req.body.accountId;

    Flight.findByIdAndUpdate(flightId, { $pull: { team: accountId } }, (err, flight) => {
        if (err) return next(err);
        res.status(httpStatus.CREATED).json(flight.team);
        
        // remove account from flight socket
        socketHandler.removeAccountfromRoom(accountId, flightId);
    }).catch(e => next(e));
}

export default {
    add,
    remove
}