import mongoose from 'mongoose';

const OffloadList = new mongoose.Schema({
    title: {
        type: String,
        default: 'Offload List',
        lowercase: true
    },
    status: {
        type: boolean,
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
                    enum: ['M', 'F', 'C', 'I'],
                },
                totalWeight: {
                    type: Number,
                    required: true
                },
                offloadBaggage: {
                    type: [{
                        pieceID: {
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