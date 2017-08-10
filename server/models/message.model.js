import mongoose from 'mongoose';


/**
 * Message Schema
 */
const MessageSchema = new mongoose.Schema({

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default MessageSchema;
