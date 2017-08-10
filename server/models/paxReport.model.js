import mongoose from 'mongoose';

/**
 * Pax Report Schema
 */
const PaxReport = new mongoose.Schema({
    crewBaggage: {
        type: Number,
        required: true
    },
    daa: {
        type: Number,
        required: true
    },
    rush: {
        type: Number,
        required: true
    },
    totalBaggagePax: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default PaxReport;