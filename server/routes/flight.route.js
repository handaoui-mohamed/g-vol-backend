import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/flight.validator';
import flightCtrl from '../controllers/flight.controller';
import authHandler from '../handlers/auth.handler';

const router = express.Router(); // eslint-disable-line new-cap
const updateProp = {
  admin: ['flightNumber', 'arrivalDate', 'departureDate', 'acType', 'sta', 'std', 'ata', 'atd', 'eta', 'etd', 'comment', 'configurtion', 'registration', 'status', 'team'],
  superadmin: ['flightNumber', 'arrivalDate', 'departureDate', 'acType', 'sta', 'std', 'ata', 'atd', 'eta', 'etd', 'comment', 'configurtion', 'registration', 'status', 'team'],
  clc: ['team', 'comment', 'status'],
  trc: ['eta', 'etd']
}
router.route('/')
  /** GET /api/flights - Get list of flights */
  .get(authHandler.authenticate(), flightCtrl.list)

  /** POST /api/flights - Create new flight */
  .post(authHandler.authAndCheckRoles(['superadmin', 'admin']), validate(paramValidation.createFlight), flightCtrl.create);

router.route('/:flightId')
  /** GET /api/flights/:flightId - Get flight */
  .get(authHandler.authenticate(), flightCtrl.get)

  /** PUT /api/flights/:flightId - Update flight */
  .put(authHandler.authAndCheckRoles(['superadmin', 'admin', 'clc', 'trc']), authHandler.checkAcceptedPropreties(updateProp), validate(paramValidation.updateFlight), flightCtrl.update)

  /** DELETE /api/flights/:flightId - Delete flight */
  .delete(authHandler.authAndCheckRoles(['superadmin', 'admin']), flightCtrl.remove);

/** Load flight when API with flightId route parameter is hit */
router.param('flightId', flightCtrl.load);

export default router;
