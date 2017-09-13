import httpStatus from 'http-status';
import Flight from '../models/flight.model';
import Company from '../models/company.model'
import APIError from '../helpers/APIError';
import socket from '../../config/socket';



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
                // emit using socket
                let flightId = savedFlight._id;

                socket.io.to(flightId).emit('offload-report/' + flightId, JSON.stringify({
                    flightId,
                    offloadReport: generateOffloadReport(savedFlight.offloadList)
                }));

                socket.io.to(flightId).emit('offload-list/' + flightId, JSON.stringify({
                    flightId,
                    offloadList: savedFlight.offloadList
                }));
                //return http response
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

function generateOffloadReport(offloadList) {
    if (offloadList && offloadList.createdAt) {
        let offloadReport = {
            pax: {
                total: 0,
                male: 0,
                female: 0,
                child: 0,
                infant: 0
            },
            totalWeight: 0,
            nbPcs: 0,
            table: [/*{pieceId, position}*/]
        }
        offloadList.table.forEach((row) => {
            offloadReport.pax[row.passengerType]++;
            offloadReport.pax.total++;
            offloadReport.totalWeight += row.totalWeight;
            offloadReport.nbPcs += row.nbPcs;
            offloadReport.table = offloadReport.table.concat(row.offloadBaggage);
        });
        return offloadReport;
    }
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
                            offloadBaggage: element.offloadBaggage,
                            passengerType: element.passengerType
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
                .then(savedFlight => {
                    // emit using socket
                    let flightId = savedFlight._id;
                    socket.io.to(flightId).emit('offload-report/' + flightId, JSON.stringify({
                        flightId,
                        offloadReport: generateOffloadReport(savedFlight.offloadList)
                    }));

                    socket.io.to(flightId).emit('offload-list/' + flightId, JSON.stringify({
                        flightId,
                        offloadList: savedFlight.offloadList
                    }));
                    //return http response
                    res.json(savedFlight.offloadList);
                })
                .catch(e => next(e));
        }
        else {

            const err = new APIError("Offload list not initialized yet", httpStatus.UNAUTHORIZED);
        }

    })
        .catch(e => next(e));



}

export default { initOffloadList, updateOffloadList, getOffloadList, generateOffloadReport };