import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/account.validator';
import authCtrl from '../controllers/auth.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login-:accountType')
  .post(validate(paramValidation.login), authCtrl.login);

export default router;
