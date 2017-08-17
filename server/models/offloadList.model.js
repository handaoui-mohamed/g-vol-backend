import mongoose from 'mongoose';

const OffloadList = {
    status: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
    },
    table: [new mongoose.Schema({
        nbPcs:
        {
            type: Number,
            required : true
        },

        passengerName: {
            type: String,
            required: true 
        },
        passengerType: {
            type: String,
            required : true,
            enum: ['male', 'female', 'child', 'infant'],
        },
        totalWeight: {
            type: Number,
            required : true
        },
        offloadBaggage: [new mongoose.Schema({
            pieceId: {
                type: String,
                lowercase: true,
                required: true 
            },
            position: {
                type: String,
                lowercase: true
            }
        })]

    })
    ]

}

export default OffloadList; 