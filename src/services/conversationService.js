const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { isDBConnected } = require('../config/database');

// In-memory fallback storage
const memoryStore = {
    conversations: new Map(),
    messages: new Map()
};

const findOrCreateConversation = async (sessionId, contextData = {}) => {
    if (!isDBConnected()) {
        // Use in-memory
        if (!memoryStore.conversations.has(sessionId)) {
            memoryStore.conversations.set(sessionId, {
                _id: sessionId,
                sessionId,
                messages: [],
                ...contextData
            });
        }
        return memoryStore.conversations.get(sessionId);
    }

    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
        conversation = new Conversation({
            sessionId,
            ...contextData
        });
        await conversation.save();
    } else {
        // Update context if provided (e.g. user updated config)
        if (Object.keys(contextData).length > 0) {
            Object.assign(conversation, contextData);
            await conversation.save();
        }
    }

    return conversation;
};

const addMessageToConversation = async (conversationId, messageData) => {
    if (!isDBConnected()) {
        // In-memory
        const msgId = Date.now().toString();
        const msg = { _id: msgId, ...messageData, timestamp: new Date() };
        if (!memoryStore.messages.has(conversationId)) {
            memoryStore.messages.set(conversationId, []);
        }
        memoryStore.messages.get(conversationId).push(msg);
        return msg;
    }

    const message = new Message({
        conversationId,
        ...messageData
    });
    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
        $push: { messages: message._id },
        lastMessageAt: Date.now()
    });

    return message;
};

const getConversationContext = async (sessionId) => {
    if (!isDBConnected()) {
        const conversation = memoryStore.conversations.get(sessionId);
        if (!conversation) return null;
        return {
            userName: conversation.userName,
            petName: conversation.petName
        };
    }
    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) return null;

    return {
        userName: conversation.userName,
        petName: conversation.petName
    };
};

module.exports = {
    findOrCreateConversation,
    addMessageToConversation,
    getConversationContext
};
