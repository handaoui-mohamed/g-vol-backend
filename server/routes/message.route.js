import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/message.validator';
import messageCtrl from '../controllers/message.controller';
import authHandler from '../handlers/auth.handler';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:flightId')
    /** get /api/flitght-messages/:flightId - list messages */
    .get(authHandler.authAndCheckRoles(['clc','trc','tl','tb','superadmin']),messageCtrl.list)
    /** post /api/flight-messages/:flightId - post message */
    .post(authHandler.authAndCheckRoles(['clc','trc','tl','tb','superadmin']),validate(paramValidation.createMessage),messageCtrl.create);


export default router;