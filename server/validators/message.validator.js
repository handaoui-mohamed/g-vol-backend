import Joi from 'joi';
import JoiObjectid from 'joi-objectid';

Joi.objectId = JoiObjectid(Joi);

const body = {
    accountId: Joi.objectId().required(),
    content: Joi.string().required()
}

export default {
    // POST /api/:Idflight/messages
    createMessage: {
        body: body
    },

};