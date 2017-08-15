import mongoose from 'mongoose';

/**
 * Pax Report body
 */
const PaxReport = {
    crewBaggage: {
        type: Number,
    },
    daa: {
        type: Number,
    },
    rush: {
        type: Number,
    },
    totalBaggagePax: {
        type: Number,
    },
    createdAt: {
        type: Date,
    }
}


export default PaxReport;