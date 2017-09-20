import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/account.validator';
import accountCtrl from '../controllers/account.controller';
import authHandler from '../handlers/auth.handler';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/accounts - Get list of accounts */
  .get(authHandler.authAndCheckRoles(['superadmin', 'admin', 'clc']), accountCtrl.list)

  /** POST /api/accounts - Create new account */
  .post(authHandler.authAndCheckRoles(['superadmin', 'admin']), validate(paramValidation.createAccount), accountCtrl.create);
  
router.route('/count').get(authHandler.authenticate, accountCtrl.count);

router.route('/:accountId')
  /** GET /api/accounts/:accountId - Get account */
  .get(authHandler.authenticate, accountCtrl.get)

  /** PUT /api/accounts/:accountId - Update account */
  .put(authHandler.authAndCheckRoles(['superadmin', 'admin']), validate(paramValidation.updateAccount), accountCtrl.update)

  /** DELETE /api/accounts/:accountId - Delete account */
  .delete(authHandler.authAndCheckRoles(['superadmin', 'admin']), accountCtrl.remove)

  /** PATCH /api/accounts/:accountId  - Restore account */
  .patch(authHandler.authAndCheckRoles(['superadmin', 'admin']), accountCtrl.restore);

/** Load account when API with accountId route parameter is hit */
router.param('accountId', accountCtrl.load);

export default router;
