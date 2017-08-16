import Joi from 'joi';

const bodyInit = {
    ezfw : Joi.string().required()
}
const bodyUpdate= {

    blockFuel: Joi.string(), 
    chocksOn: Joi.string(), 
    crew: Joi.string(), 
    doi: Joi.string(), 
    dow: Joi.string(), 
    ezfw: Joi.string(),
    flightTime: Joi.string(), 
    landingTime: Joi.string(), 
    rtow: Joi.string(), 
    taxiFuel: Joi.string(), 
    tripFuel: Joi.string(), 
    waterUpLift: Joi.string()
}
export default {
    initFlightInfo : {
        body : bodyInit
    },
    updateFlightInfo:{
        body : bodyUpdate
    }
} ; 