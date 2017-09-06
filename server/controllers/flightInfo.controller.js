import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import Company from '../models/company.model'
import APIError from '../helpers/APIError';
import mongoose from 'mongoose';
import socket from '../../config/socket';

function getFlightInfo(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        res.json(flight.flightInfo);
    })
        .catch(e => next(e));
}
function initFlightInfo(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        flight.flightInfo.ezfw = req.body.ezfw;
        flight.flightInfo.createdAt = new Date();
        flight.save()
            .then(savedFlight => {
                // emit using socket
                let flightId = savedFlight._id;
                socket.io.to(flightId).emit('flight-info/' + flightId, JSON.stringify({
                    flightId,
                    flightInfo: savedFlight.flightInfo
                }));
                //return http response
                res.json(savedFlight.flightInfo);
            })
            .catch(e => next(e));
    })
        .catch(e => next(e));
}

function updateFlightInfo(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        if (flight.flightInfo.createdAt) {
            if (req.loggedAccount.function.name == 'clc') flight.flightInfo.ezfw = req.body.ezfw;
            else if (req.loggedAccount.function.name == 'trc') {
                flight.flightInfo.blockFuel = req.body.blockFuel;
                flight.flightInfo.chocksOn = req.body.chocksOn;
                flight.flightInfo.crew = req.body.crew;
                flight.flightInfo.doi = req.body.doi;
                flight.flightInfo.dow = req.body.dow;
                flight.flightInfo.flightTime = req.body.flightTime;
                flight.flightInfo.landingTime = req.body.landingTime;
                flight.flightInfo.rtow = req.body.rtow;
                flight.flightInfo.taxiFuel = req.body.taxiFuel;
                flight.flightInfo.waterUpLift = req.body.waterUpLift;
                flight.flightInfo.tripFuel = req.body.tripFuel;
            }
            flight.save()
                .then((savedFlight) => {
                    // emit using socket
                    let flightId = savedFlight._id;
                    socket.io.to(flightId).emit('flight-info/' + flightId, JSON.stringify({
                        flightId,
                        flightInfo: savedFlight.flightInfo
                    }));
                    //return http response
                    res.json(savedFlight.flightInfo)
                })
                .catch(e => next(e));
        }
        else {
            const err = new APIError("flight info not initialized yet", httpStatus.FORBIDDEN);
            next(err);
        }

    })
        .catch(e => next(e));
}

export default { initFlightInfo, getFlightInfo, updateFlightInfo }