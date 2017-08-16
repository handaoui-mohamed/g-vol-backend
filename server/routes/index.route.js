import express from 'express';
import accountRoutes from './account.route';
import authRoutes from './auth.route';
import companyRoutes from './company.route'
import flightRoutes from './flight.route'
import flightMessagesRoutes from './message.route'
import flightDocumentsRoutes from './documents.route'
import flightPaxReportRoutes from './paxReport.route'

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount account routes at /accounts
router.use('/accounts', accountRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount company routes at /companies
router.use('/companies', companyRoutes);

// mount flight routes at /flights
router.use('/flights', flightRoutes);
// mount messages of a flight at /flight-messages
router.use('/flight-messages',flightMessagesRoutes);
// mount documents of a flight at /flight-documents
router.use('/flight-documents',flightDocumentsRoutes);
// mount pax report of a flight at /flight-paxreport
router.use('/flight-paxreport',flightPaxReportRoutes); 


export default router;
