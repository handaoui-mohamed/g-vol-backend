import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import Company from '../models/company.model'
import APIError from '../helpers/APIError';
import mongoose from 'mongoose';

const docTypes = { 
    others: 'oth',
    baggageReport: 'br',
    flightInfo: 'fi',
    offloadList: 'ol'
}

function loadDoc(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        var doc;
        const paramsDoc = req.params.typeIdDoc.split(' ');
        var typeDoc = paramsDoc[0] ; 
        const idDoc = paramsDoc[1] ; 
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
        req.typeDoc = typeDoc ;
        req.idDoc = idDoc ; 
        next();
    })
        .catch(e => next(e));
}

function updateDocStatus(req, res, next) {

    const doc = req.doc;
    doc.status = req.body.status;
    req.flight.save()
        .then(savedFlight => {
            let response;
            if (req.typeDoc == docTypes.others) response = savedFlight.otherDocuments.id(req.idDoc);
            else if (req.typeDoc == docTypes.baggageReport) response = savedFlight.baggageReport;
            else if (req.typeDoc == docTypes.flightInfo) response = savedFlight.flightInfo;
            else if (req.typeDoc == docTypes.offloadList) response = savedFlight.offloadList;
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
            flight.status = 'en cours';
            flight.save()
                .then(savedFlight => res.json(savedFlight))
                .catch(e => next(e));
        })
            .catch(e => next(e));
    })
        .catch(e => next(e));
}

export default { init, loadDoc, updateDocStatus, docTypes }



