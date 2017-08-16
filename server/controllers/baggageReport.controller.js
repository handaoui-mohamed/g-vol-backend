import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import Company from '../models/company.model'
import APIError from '../helpers/APIError';
import mongoose from 'mongoose';


function initTableBaggageReport(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        flight.baggageReport.createdAt = new Date();
        req.body.table.forEach(function (element) {
            flight.baggageReport.table.push({ uldType: element });
        });
        flight.save()
            .then(savedFlight => res.json(savedFlight.baggageReport))
            .catch(e => next(e));
    })
        .catch(e => next(e));
}

function getBaggageReport(req, res, next) {
    Flight.get(req.params.flightId).then(flight => res.json(flight.baggageReport))
        .catch(e => next(e));
}

function updateTableBaggageReport(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        req.body.table.forEach(function (element) {
            var tableEle;
            req.acceptedProps.forEach((proprety) => {
                tableEle = flight.baggageReport.table.id(element.id);
                if (tableEle) tableEle.set(proprety, element[proprety]);
            });
        });
        flight.save()
            .then(savedFlight => res.json(savedFlight.baggageReport))
            .catch(e => next(e));
    })
        .catch(e => next(e));

}
function removeBaggageReportTableItems(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        var tableEle
        req.body.table.forEach(function (element) {
            tableEle = flight.baggageReport.table.id(element) ;
            if (tableEle) tableEle.remove()
        });
        flight.save()
            .then(savedFlight => res.json(savedFlight.baggageReport))
            .catch(e => next(e));
    })
        .catch(e => next(e));
}

export default { initTableBaggageReport, updateTableBaggageReport, getBaggageReport ,removeBaggageReportTableItems }