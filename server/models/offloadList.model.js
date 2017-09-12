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
        },

        passengerName: {
            type: String,
        },
        passengerType: {
            type: String,
            enum: ['male', 'female', 'child', 'infant'],
        },
        totalWeight: {
            type: Number,
        },
        offloadBaggage: [new mongoose.Schema({
            pieceId: {
                type: String,
                lowercase: true,
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