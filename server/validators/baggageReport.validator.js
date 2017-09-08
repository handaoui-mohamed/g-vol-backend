import Joi from 'joi';
import JoiObjectid from 'joi-objectid';

Joi.objectId = JoiObjectid(Joi);

const bodyInit = {
    // Table contains uld types essential to init the baggage report
    table: Joi.array().items({
        uldType: Joi.string()
    })
}

const bodyUpdate = {

    table: Joi.array().items(Joi.object({
        _id: Joi.string().hex().required(),
        baggageType: Joi.string(),
        nbPieces: Joi.number(),
        position: Joi.string(),
        uldType: Joi.string()
    }))
}
const bodyDelete = {
    table: Joi.array().items(Joi.objectId())
}

export default {

    initTable: {
        body: bodyInit
    },
    updateTable: {
        body: bodyUpdate
    },
    deleteTableItems: {
        body: bodyDelete
    }
}