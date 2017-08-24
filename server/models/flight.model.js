import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import APIError from '../helpers/APIError';
import FlightDocument from './flightDocument.model';
import FlightInfo from './flightInfo.model';
import OffloadList from './offloadList.model'
import PaxReport from './paxReport.model'
import MessageSchema from './message.model'
import BaggageReport from './baggageReport.model'

/**
 * Flight Status enum
 */
const flightStatus = ['new', 'inprogress', 'done'];

/**
 * Flight Schema
 */
const FlightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
    },
    arrivalDate: {
        type: Date,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    acType: {
        type: String,
        required: true,
        lowercase: true
    },
    sta: {
        type: String,
        required: true,
        lowercase: true

    },
    std: {
        type: String,
        required: true,
        lowercase: true

    },
    ata: {
        type: String,
        lowercase: true

    },
    atd: {
        type: String,
        lowercase: true

    },
    eta: {
        type: String,
        lowercase: true
    },
    etd: {
        type: String,
        lowercase: true
    },
    comment: {
        type: String
    },
    configuration: {
        type: String,
        lowercase: true,
    },
    registration: {
        type: String,
        required: true,
        lowercase: true

    },
    dest: {
        type: String,
        required: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: flightStatus,
        default: flightStatus[0]
    },
    team: [mongoose.Schema.Types.ObjectId],
    paxReport: PaxReport,
    flightInfo: FlightInfo, 
    offloadList: OffloadList, 
    baggageReport: BaggageReport, 
    otherDocuments: [FlightDocument],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    messages: [MessageSchema]

});

FlightSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
    }
});

FlightSchema.statics = {
    /**
     * Get flight
     * @param {ObjectId} id - The objectId of flight.
     * @returns {Promise<Account, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((flight) => {
                if (flight) {
                    return flight;
                }
                const err = new APIError('No such flight exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List flights in descending order of 'createdAt' timestamp.
     * @param {object} query - all query to be searched for.
     * @param {number} skip - Number of flights to be skipped.
     * @param {number} limit - Limit number of flights to be returned.
     * @returns {Promise<Account[]>}
     */
    list(query= {}, { skip = 0, limit = 50 } = {}) {
        return this.find(query)
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    }
};
FlightSchema.index({ flightNumber: 1, departureDate: 1 }, { unique: true });
export default mongoose.model('Flight', FlightSchema);
