import express from 'express';
import accountRoutes from './account.route';
import authRoutes from './auth.route';
import companyRoutes from './company.route'

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
router.use('/companies',companyRoutes);

export default router;
