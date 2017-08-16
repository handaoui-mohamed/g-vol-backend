import mongoose from 'mongoose';


const BaggageReport = {
    status: {
        type: Boolean,
    },
    createdAt: {
        type: Date
    },
    table: {
        type: [new mongoose.Schema({
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
                lowercase: true,
                required: true
            }
        })],
    }
}


export default BaggageReport ; 
