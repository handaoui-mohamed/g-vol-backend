import mongoose from 'mongoose';

const OffloadList ={
    status: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
    },
    table: {
        type: [
            {
                nbPcs:
                {
                    type: Number,
                    
                },

                passengerName: {
                    type: String,
                    
                    lowercase: true
                },
                passengerType: {
                    type: String,
                    
                    enum: ['male', 'female', 'chils', 'infant'],
                },
                totalWeight: {
                    type: Number,
                    
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
        
    }
}

export default OffloadList ; 