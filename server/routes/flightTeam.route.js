import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/flightTeam.validator';
import flightTeamCtrl from '../controllers/flightTeam.controller';
import authHandler from '../handlers/auth.handler';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:flightId')
    /** get /api/flight-team/:flightId - list messages */
    .post(authHandler.authAndCheckRoles(['clc', 'trc', 'tl', 'tb']), validate(paramValidation.add), flightTeamCtrl.add)
    /** post /api/flight-team/:flightId - post message */
    .delete(authHandler.authAndCheckRoles(['clc', 'trc', 'tl', 'tb']), validate(paramValidation.delete), flightTeamCtrl.remove);


export default router;