import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import APIError from '../helpers/APIError';


/**
 * Documents Schema
 */
const FlightDocument = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default FlightDocument ; 