import Joi from 'joi';

const body = {

    title: Joi.string(),
    status: Joi.boolean(),
    table: Joi.array().items(Joi.object({
        baggageType: Joi.string(),
        nbPieces: Joi.number(),
        uldNumber: Joi.string(),
        position: Joi.string(),
        uldType: Joi.string().required(),
    })).required()
}

export default body;