import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/paxReport.validator';
import paxReportCtrl from '../controllers/paxReport.controller';
import authHandler from '../handlers/auth.handler';


const router = express.Router(); 

router.route('/:flightId')
        // Get the pax report of a flight
      .get(authHandler.authAndCheckRoles(['clc','tl']),paxReportCtrl.getPaxReport)
        // Init the pax report from the team leader
      .post(authHandler.authAndCheckRoles(['tl']),validate(paramValidation.initPaxReport),paxReportCtrl.initPaxReport)
        // Update the pax repport from the team leader
      .put(authHandler.authAndCheckRoles(['tl']),validate(paramValidation.updatePaxReport),paxReportCtrl.updatePaxReport);

export default router ;