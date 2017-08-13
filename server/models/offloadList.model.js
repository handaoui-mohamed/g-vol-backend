import mongoose from 'mongoose';

const OffloadList = new mongoose.Schema({
    title: {
        type: String,
        default: 'Offload List',
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
        type: [
            {
                nbPcs:
                {
                    type: Number,
                    required: true
                },

                passengerName: {
                    type: String,
                    required: true,
                    lowercase: true
                },
                passengerType: {
                    type: String,
                    required: true,
                    enum: ['male', 'female', 'chils', 'infant'],
                },
                totalWeight: {
                    type: Number,
                    required: true
                },
                offloadBaggage: {
                    type: [{
                        pieceId: {
                            type: String,
                            lowercase: true
                        },
                        position: {
                            type: String,
                            lowercase: true
                        }
                    }]
                }
            }
        ],
        required: true
    }
});

export default OffloadList ; 