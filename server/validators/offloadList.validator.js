import Joi from 'joi';

const body = {
    table: Joi.array().items(Joi.object({
        nbPcs: Joi.number(),
        passengerName: Joi.string(),
        passengerType: Joi.string().valid('male', 'female', 'child', 'infant'),
        totalWeight: Joi.number(),
        offloadBaggage: Joi.array().items(Joi.object({
            pieceId: Joi.string(),
            position: Joi.string()
        }))
    }))
}

export default body; 