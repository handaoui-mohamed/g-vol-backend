import Joi from 'joi';

const body = {

    title: Joi.string(),
    status: Joi.boolean(),
    blockFuel: Joi.string().required(), 
    chocksOn: Joi.string().required(), 
    crew: Joi.string().required(), 
    doi: Joi.string().required(), 
    dow: Joi.string().required(), 
    ezfw: Joi.string().required(),
    flightTime: Joi.string().required(), 
    landingTime: Joi.string().required(), 
    rtow: Joi.string().required(), 
    taxiFuel: Joi.string().required(), 
    tripFuel: Joi.string().required(), 
    waterUpLift: Joi.string().required()

}
export default body ; 