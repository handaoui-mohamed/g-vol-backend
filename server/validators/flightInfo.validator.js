import Joi from 'joi';

const bodyInit = {
    ezfw : Joi.string().required()
}
const bodyUpdate= {

    blockFuel: Joi.string().allow(''), 
    chocksOn: Joi.string().allow(''), 
    crew: Joi.string().allow(''), 
    doi: Joi.string().allow(''), 
    dow: Joi.string().allow(''), 
    ezfw: Joi.string(),
    flightTime: Joi.string().allow(''), 
    landingTime: Joi.string().allow(''), 
    rtow: Joi.string().allow(''), 
    taxiFuel: Joi.string().allow(''), 
    tripFuel: Joi.string().allow(''), 
    waterUpLift: Joi.string().allow('')
}
export default {
    initFlightInfo : {
        body : bodyInit
    },
    updateFlightInfo:{
        body : bodyUpdate
    }
} ; 