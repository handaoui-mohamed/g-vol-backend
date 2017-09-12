import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import Company from '../models/company.model'
import APIError from '../helpers/APIError';



function initOffloadList(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {

        flight.offloadList.createdAt = new Date();
        req.body.table.forEach(function (ele) {
            if (ele.offloadBaggage) {
                ele.offloadBaggage.forEach(function (element) {
                    if (element.position) delete element.position;
                });
            }
        });
        flight.offloadList.table = req.body.table;
        flight.save()
            .then((savedFlight) => {
                res.json(savedFlight.offloadList)
                // Notify TRC and CLC of the offload list
            })
            .catch(e => next(e));
    })
        .catch(e => next(e));
}

function getOffloadList(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        res.json(flight.offloadList);
    })
}

function updateOffloadList(req, res, next) {
    Flight.get(req.params.flightId).then((flight) => {
        if (flight.offloadList.createdAt) {
            let table = [];
            if (req.loggedAccount.function.name == 'tl') {
                req.body.table.forEach((element, index) => {
                    if (element.offloadBaggage) {
                        element.offloadBaggage.forEach(function (ele) {
                            if (ele.position) delete ele.position;
                        });
                        table[index] = {
                            _id: element._id,
                            nbPcs: element.nbPcs,
                            passengerName: element.passengerName,
                            totalWeight: element.totalWeight,
                            offloadBaggage: element.offloadBaggage
                        }
                    }

                });
            }
            else {
                table = flight.offloadList.table;
                let eleTable, eleOB;
                req.body.table.forEach(function (element) {
                    eleTable = table.id(element._id);
                    if (eleTable) {
                        if (element.offloadBaggage) {
                            element.offloadBaggage.forEach(function (e) {
                                eleOB = eleTable.offloadBaggage.id(e._id);
                                if (eleOB) eleOB.position = e.position;
                            });
                        }
                    }
                });

            }
            flight.offloadList.table = table;
            flight.save()
                .then(savedFlight => res.json(savedFlight.offloadList))
                .catch(e => next(e));
        }
        else {

            const err = new APIError("Offload list not initialized yet", httpStatus.UNAUTHORIZED);
        }

    })
        .catch(e => next(e));



}

export default { initOffloadList, updateOffloadList, getOffloadList };