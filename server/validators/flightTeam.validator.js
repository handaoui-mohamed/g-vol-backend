import Joi from 'joi';
import JoiObjectid from 'joi-objectid';

Joi.objectId = JoiObjectid(Joi);

export default {
    // POST/DELETE team
    team: {
        body: {
            accountId: Joi.objectId().required()
        },
        params: {
            flightId: Joi.objectId().required()
        }
    },

};