import Joi from 'joi';

const body = {
  status: Joi.boolean()
}

export default {
  // PUT /api/flight-documents/status/:flightId/:typeDoc/:otherDocId
  updateFlightDoc: {
    body: body,
    params: {
      flightId: Joi.string().hex().required(),
      typeIdDoc: Joi.string().required(),
    }
  },
};