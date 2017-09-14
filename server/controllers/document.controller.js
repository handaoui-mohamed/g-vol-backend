import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import Company from '../models/company.model'
import APIError from '../helpers/APIError';
import mongoose from 'mongoose';
import socket from '../../config/socket';

const docTypes = {
    others: 'oth',
    baggageReport: 'br',
    flightInfo: 'fi',
    offloadList: 'ol'
}

function loadDoc(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        var doc;
        const typeDoc = req.params.type;
        const idDoc = req.body.docId;
        if (typeDoc == docTypes.others) doc = flight.otherDocuments.id(idDoc);
        else if (typeDoc == docTypes.baggageReport) doc = flight.baggageReport;
        else if (typeDoc == docTypes.flightInfo) doc = flight.flightInfo;
        else if (typeDoc == docTypes.offloadList) doc = flight.offloadList;
        else {
            const err = new APIError('Bad request', httpStatus.BAD_REQUEST);
            next(err);
        }
        if (doc) req.doc = doc;
        else if (typeDoc == docTypes.others) {
            const err = new APIError('Document not found', httpStatus.NOT_FOUND)
            next(err);
        }
        req.flight = flight;
        req.typeDoc = typeDoc;
        req.idDoc = idDoc;
        next();
    })
        .catch(e => next(e));
}

function updateDocStatus(req, res, next) {

    const doc = req.doc;
    doc.status = req.body.status;
    if (doc.status) doc.finishedAt = new Date();
    req.flight.save()
        .then(savedFlight => {
            let response;
            let flightId = savedFlight._id;
            if (req.typeDoc == docTypes.others) response = savedFlight.otherDocuments.id(req.idDoc);
            else if (req.typeDoc == docTypes.baggageReport) response = savedFlight.baggageReport;
            else if (req.typeDoc == docTypes.flightInfo) response = savedFlight.flightInfo;
            else if (req.typeDoc == docTypes.offloadList) response = savedFlight.offloadList;
            socket.io.to(flightId).emit('flight-documents-status/' + flightId, JSON.stringify({
                flightId,
                type: req.typeDoc,
                docId: req.idDoc,
                status: response.status,
                finishedAt: response.finishedAt
            }));
            res.json(response);
        })
        .catch(e => next(e));
}

// Init documents of a flight
function init(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        Company.get(flight.company).then((company) => {
            company.checklist.forEach(function (title) {
                flight.otherDocuments.push({ title: title });
            });
            flight.baggageReport.status = false;
            flight.flightInfo.status = false;
            flight.offloadList.status = false;
            flight.status = 'inprogress';
            flight.save()
                .then(savedFlight => {
                    let flightId = flight._id;
                    socket.io.to(req.params.flightId).emit('docs-init/' + req.params.flightId, JSON.stringify({
                        flightId,
                        documents: {
                            baggageReport: flight.baggageReport,
                            flightInfo: flight.flightInfo,
                            offloadList: flight.offloadList,
                            otherDocuments: flight.otherDocuments
                        }
                    }));
                    res.json(savedFlight)
                })
                .catch(e => next(e));
        })
            .catch(e => next(e));
    })
        .catch(e => next(e));
}

function getDocuments(req, res, next) {
    Flight.findOne({ _id: req.params.flightId }).select({ baggageReport: 1, flightInfo: 1, offloadList: 1, otherDocuments: 1, paxReport: 1 }).then((flight) => {
        res.json(flight);
    });
}

export default { init, loadDoc, updateDocStatus, docTypes, getDocuments }



