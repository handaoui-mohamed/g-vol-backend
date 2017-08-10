import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validators/company.validator';
import companyCtrl from '../controllers/company.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/companies - Get list of companies */
  .get(companyCtrl.list)

  /** POST /api/companis - Create new company */
  .post(validate(paramValidation.createCompany), companyCtrl.create);

router.route('/:companyId')
  /** GET /api/companies/:companyId - Get company */
  .get(companyCtrl.get)

  /** PUT /api/companis/:companyId - Update company */
  .put(validate(paramValidation.updateCompany), companyCtrl.update)

  /** DELETE /api/companies/:companyId - Delete company */
  .delete(companyCtrl.remove);

/** Load company when API with companyId route parameter is hit */
router.param('companyId', companyCtrl.load);

export default router;