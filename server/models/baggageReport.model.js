import mongoose from 'mongoose';


const BaggageReport = new mongoose.Schema({
    title: {
        type: String,
        default: 'Baggage Report',
        lowercase: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    table: {
        type: [{
            baggageType: {
                type: String,
                lowercase: true
            },
            nbPieces: Number,
            uldNumber: {
                type: String,
                lowercase: true
            },
            position: {
                type: String,
                lowercase: true
            },
            uldType: {
                type: String,
                required: true,
                lowercase: true
            }
        }],
        required: true
    }
});


export default BaggageReport ; 
