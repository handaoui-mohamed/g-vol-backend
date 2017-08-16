import Joi from 'joi'

const body = {

    crewBaggage : Joi.number().required(),
    daa: Joi.number().required(), 
    rush: Joi.number().required(), 
    totalBaggagePax: Joi.number().required()
}

export default {

    initPaxReport: {
        body : body
    },
    updatePaxReport: {
        body : body
    }
}; 