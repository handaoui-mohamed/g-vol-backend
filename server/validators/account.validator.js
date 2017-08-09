import Joi from 'joi';

const body = {
    username: Joi.string().min(5).required(),
    phone: Joi.string(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email(),
    sexe: Joi.string().valid('male', 'female').required(),
    birthday: Joi.date(),
    adress: Joi.string(),
    function: Joi.object({
        name: Joi.string().valid('TRC', 'CLC', 'TL', 'Tri bagage'),
        description: Joi.string()
    })
};
export default {
    // POST /api/accounts
    createAccount: {
        body: Object.assign(body, { password: Joi.string().min(8).required() })
    },

    // UPDATE /api/accounts/:accountId
    updateAccount: {
        body: Object.assign(body, { password: Joi.string().min(8) }),
        params: {
            accountId: Joi.string().hex().required()
        }
    },

    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().min(5).required(),
            password: Joi.string().min(8).required()
        }
    }
};
