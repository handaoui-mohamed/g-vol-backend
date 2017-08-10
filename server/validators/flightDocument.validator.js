import Joi from 'joi' ; 

const body = {

    title: Joi.string(),
    status: Joi.boolean()
}

export default body ;