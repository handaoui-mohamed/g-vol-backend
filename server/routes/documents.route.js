import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/document.validator';
import documentCtrl from '../controllers/document.controller';
import authHandler from '../handlers/auth.handler';
import baggageReportCtrl from '../controllers/baggageReport.controller';
import baggageReportParamValidation from '../validators/baggageReport.validator';
import flightInfoCtrl from '../controllers/flightInfo.controller';
import flightInfoParamValidation from '../validators/flightInfo.validator';
import offloadListCtrl from '../controllers/offloadList.controller';
import offloadListParamValidation from '../validators/offloadList.validator';


const router = express.Router(); // eslint-disable-line new-cap
const updatePropBaggageReport = {
  clc: ['uldType'],
  trc: ['baggageType', 'nbPieces', 'position', 'uldNumber']
}
const updatePropFlightInfo = {
  clc: ['ezfw'],
  trc: ['blockFuel', 'chocksOn', 'crew', 'doi', 'dow', 'flightTime', 'landingTime', 'rtow', 'taxiFuel', 'tripFuel', 'waterUpLift']
}

/**
 * Docs routing
 */

router.route('/:flightId')
  // init docs of the flight
  .put(authHandler.authAndCheckRoles(['clc']), documentCtrl.init);

// Update flight documents satatus 
//: typeIdDoc examples: "fi", "other _docid" 
router.route('/:flightId/:typeIdDoc/status')
  .put(authHandler.authAndCheckRoles(['trc']), validate(paramValidation.updateFlightDoc), documentCtrl.loadDoc, documentCtrl.updateDocStatus);

/**
 * Baggage Report routing 
 */
router.route('/:flightId/' + documentCtrl.docTypes.baggageReport)
  // Get baggages report of specific flight 
  .get(authHandler.authAndCheckRoles(['clc', 'trc']), baggageReportCtrl.getBaggageReport)
  // Init table of baggage report from clc 
  .post(authHandler.authAndCheckRoles(['clc']), validate(baggageReportParamValidation.initTable), baggageReportCtrl.initTableBaggageReport)
  // update baggage report table 
  .put(authHandler.authAndCheckRoles(['clc', 'trc']), authHandler.checkAcceptedPropreties(updatePropBaggageReport), validate(baggageReportParamValidation.updateTable), baggageReportCtrl.updateTableBaggageReport)
  // delete baggage report table items
  .delete(authHandler.authAndCheckRoles(['clc']), validate(baggageReportParamValidation.deleteTableItems), baggageReportCtrl.removeBaggageReportTableItems);

/**
 * Flight Info routing 
 */
router.route('/:flightId/' + documentCtrl.docTypes.flightInfo)
  // Get flight info from a specific flight
  .get(authHandler.authAndCheckRoles(['clc', 'trc']), flightInfoCtrl.getFlightInfo)
  // Init flight info from clc
  .post(authHandler.authAndCheckRoles(['clc']), validate(flightInfoParamValidation.initFlightInfo), flightInfoCtrl.initFlightInfo)
  // Update flight info 
  .put(authHandler.authAndCheckRoles(['clc', 'trc']), validate(flightInfoParamValidation.updateFlightInfo), flightInfoCtrl.updateFlightInfo);

/**
 * Offload list routing
 */
router.route('/:flightId/' + documentCtrl.docTypes.offloadList)
  .post(authHandler.authAndCheckRoles(['tl']),offloadListCtrl.initOffloadList) 
  .put(authHandler.authAndCheckRoles(['tl','trc']),offloadListCtrl.updateOffloadList);

export default router;