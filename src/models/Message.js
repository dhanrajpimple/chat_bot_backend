const mongoose = require('mongoose');
const { MESSAGE_SENDER, MESSAGE_TYPE } = require('../config/constants');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true
    },
    sender: {
        type: String,
        enum: Object.values(MESSAGE_SENDER),
        required: true
    },
    content: {
        type: String,
        required: true,
        maxLength: 2000
    },
    messageType: {
        type: String,
        enum: Object.values(MESSAGE_TYPE),
        default: MESSAGE_TYPE.TEXT
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    isError: {
        type: Boolean,
        default: false
    }
});

// Compound index for efficient history retrieval
messageSchema.index({ conversationId: 1, timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
