import Joi from 'joi';

const body = {
    status: Joi.boolean(),
    table: Joi.array().items(Joi.object({
        nbPcs: Joi.number().required(),
        passengerName: Joi.string().required(),
        passengerType: Joi.string().valid('male', 'female', 'child', 'infant').required(),
        totalWeight: Joi.number().required(),
        offloadBaggage: Joi.array().items(Joi.object({
            pieceId: Joi.string(),
            position: Joi.string()
        }))

    })).required()

}

export default body; 