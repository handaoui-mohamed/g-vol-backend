import Joi from 'joi';

const body = {
    name: Joi.string().required(),
    code: Joi.string().required(),
    checklist: Joi.array().items(Joi.string())
}

export default {
    // POST /api/companies
    createCompany: {
        body: body
    },

    // UPDATE /api/companies/:companyId
    updateCompany: {
        body: body,
        params: {
            companyId: Joi.string().hex().required()
        }
    },

};