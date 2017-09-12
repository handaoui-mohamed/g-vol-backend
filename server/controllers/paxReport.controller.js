import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import Company from '../models/company.model'
import APIError from '../helpers/APIError';
import mongoose from 'mongoose';
import socket from '../../config/socket';

function initPaxReport(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        flight.paxReport.crewBaggage = req.body.crewBaggage;
        flight.paxReport.daa = req.body.daa;
        flight.paxReport.rush = req.body.rush;
        flight.paxReport.totalBaggagePax = req.body.totalBaggagePax;
        flight.paxReport.createdAt = new Date();
        flight.save()
            .then(savedFlight => {
                // emit using socket
                let flightId = savedFlight._id;
                socket.io.to(flightId).emit('pax-report/' + flightId, JSON.stringify({
                    flightId,
                    paxReport: savedFlight.paxReport
                }));
                //return http response
                res.json(savedFlight.paxReport)
            })
            .catch(e => next(e));
    })
        .catch(e => next(e));
}

function updatePaxReport(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        if (flight.paxReport.createdAt) {
            flight.paxReport.crewBaggage = req.body.crewBaggage;
            flight.paxReport.daa = req.body.daa;
            flight.paxReport.rush = req.body.rush;
            flight.paxReport.totalBaggagePax = req.body.totalBaggagePax;
            flight.save()
                .then(savedFlight => {
                    // emit using socket
                    let flightId = savedFlight._id;
                    socket.io.to(flightId).emit('pax-report/' + flightId, JSON.stringify({
                        flightId,
                        paxReport: savedFlight.paxReport
                    }));
                    //return http response
                    res.json(savedFlight.paxReport)
                })
                .catch(e => next(e));
        }
        else {
            const err = new APIError("pax report not initialized yet", httpStatus.UNAUTHORIZED);
            next(err);
        }

    })
        .catch(e => next(e))
}

function getPaxReport(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        res.json(flight.paxReport);
    })
        .catch(e => next(e));
}

export default { initPaxReport, getPaxReport, updatePaxReport }
