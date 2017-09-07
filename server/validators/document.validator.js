import Joi from 'joi';
import JoiObjectid from 'joi-objectid';

Joi.objectId = JoiObjectid(Joi);

const body = {
  status: Joi.boolean(),
  docId: Joi.objectId()
}

export default {
  // PUT /api/flight-documents/status/:flightId/:typeDoc/:otherDocId
  updateFlightDoc: {
    body: body,
    params: {
      flightId: Joi.string().hex().required(),
      type: Joi.string().required(),
    }
  },
};