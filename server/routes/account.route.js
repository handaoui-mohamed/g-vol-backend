import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/account.validator';
import accountCtrl from '../controllers/account.controller';
import authHandler from '../handlers/auth.handler';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/accounts - Get list of accounts */
  .get(accountCtrl.list)

  /** POST /api/accounts - Create new account */
  .post(validate(paramValidation.createAccount), accountCtrl.create);

router.route('/:accountId')
  /** GET /api/accounts/:accountId - Get account */
  .get(accountCtrl.get)

  /** PUT /api/accounts/:accountId - Update account */
  .put(validate(paramValidation.updateAccount), accountCtrl.update)

  /** DELETE /api/accounts/:accountId - Delete account */
  .delete(authHandler.authAndCheckRoles(['superadmin', 'admin']), accountCtrl.remove);

/** Load account when API with accountId route parameter is hit */
router.param('accountId', accountCtrl.load);

export default router;
