import mongoose from 'mongoose';


const FlightInfo = new mongoose.Schema({
    title: {
        type: String,
        lowercase: true,
        default: 'Flight Info'
    },
    status: {
        type: boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    blockFuel: {
        type: String,
        required: true,
        lowercase: true
    },
    chocksOn: {
        type: String,
        required: true,
        lowercase: true
    },
    crew: {
        type: String,
        required: true,
        lowercase: true
    },
    doi: {
        type: String,
        required: true,
        lowercase: true
    },
    dow: {
        type: String,
        required: true,
        lowercase: true
    },
    ezfw: {
        type: String,
        required: true,
        lowercase: true
    },
    flightTime: {
        type: String,
        required: true,
        lowercase: true
    },
    landingTime: {
        type: String,
        required: true,
        lowercase: true
    },
    rtow: {
        type: String,
        required: true,
        lowercase: true
    },
    taxiFuel: {
        type: String,
        required: true,
        lowercase: true
    },
    tripFuel: {
        type: String,
        required: true,
        lowercase: true
    },
    waterUpLift: {
        type: String,
        required: true,
        lowercase: true
    }
});

export default FlightInfo ; 