import mongoose from 'mongoose';


const FlightInfo = {
    status: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
    },
    blockFuel: {
        type: String,
        lowercase: true
    },
    chocksOn: {
        type: String,
        lowercase: true
    },
    crew: {
        type: String,
        lowercase: true
    },
    doi: {
        type: String,

        lowercase: true
    },
    dow: {
        type: String,

        lowercase: true
    },
    ezfw: {
        type: String,
        lowercase: true
    },
    flightTime: {
        type: String,

        lowercase: true
    },
    landingTime: {
        type: String,

        lowercase: true
    },
    rtow: {
        type: String,

        lowercase: true
    },
    taxiFuel: {
        type: String,

        lowercase: true
    },
    tripFuel: {
        type: String,

        lowercase: true
    },
    waterUpLift: {
        type: String,

        lowercase: true
    }
}

export default FlightInfo; 