import Joi from 'Joi';
import baggageReportBody from './baggageReport.validator';
import flightInfoBody from './flightInfo.validator';
import messageBody from './message.validator';
import offloadListBody from './offloadList.validator';
import paxReportBody from './paxReport.validator';
import JoiObjectid from 'joi-objectid';

Joi.objectId = JoiObjectid(Joi);

const body = {

  flightNumber: Joi.string().required(),
  arrivalDate: Joi.date().required(),
  departureDate: Joi.date().required(),
  acType: Joi.string().required(),
  sta: Joi.string().required(),
  std: Joi.string().required(),
  ata: Joi.string(),
  atd: Joi.string(),
  eta: Joi.string(),
  etd: Joi.string(),
  configuration: Joi.string(),
  registration: Joi.string().required(),
  status: Joi.string().valid('new', 'inprogress', 'done'),
  dest: Joi.string().required(),
  company: Joi.objectId().required()

}

export default {
  // POST /api/flights
  createFlight: {
    body: body
  },

  // POST /api/flights/batch
  createFlights: {
    body: {
      flights: Joi.array().items(body).required()
    }
  },

  // UPDATE /api/companies/:flightId
  updateFlight: {
    body: body,
    params: {
      flightId: Joi.string().hex().required()
    }
  },

  changeStatus: {
    body: {
      status: Joi.string().valid('inprogress', 'done').required(),
      comment: Joi.string().allow('')
    },
    params: {
      flightId: Joi.string().hex().required()
    }
  }

};
