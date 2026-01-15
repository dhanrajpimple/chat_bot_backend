const conversationService = require('../services/conversationService');
const geminiService = require('../services/geminiService');
const { MESSAGE_SENDER } = require('../config/constants');

const handleChatMessage = async (req, res, next) => {
    try {
        const { sessionId, message, userId, userName, petName, source, metadata } = req.body;

        if (!sessionId || !message) {
            res.status(400);
            throw new Error('Session ID and message are required');
        }

        // 1. Get or Create Conversation
        const conversation = await conversationService.findOrCreateConversation(sessionId, {
            userId, userName, petName, source, metadata
        });

        // 2. Save User Message
        await conversationService.addMessageToConversation(conversation._id, {
            sender: MESSAGE_SENDER.USER,
            content: message,
            metadata
        });

        // 3. Logic: Check for Appointment Intent vs AI Chat
        // In a real flow, we might check if 'appointmentMode' is already active in DB context.
        // For this stateless pass, we'll check intent or rely on frontend to switch to appointment form.
        // If the message IS from the booking flow (e.g. metadata flag), we might handle it differently, 
        // but here we assume general chat.

        const isAppointmentIntent = await geminiService.detectAppointmentIntent(message);

        let botResponseText = '';
        let responseData = {
            isAppointmentFlow: false
        };

        if (isAppointmentIntent) {
            botResponseText = "I can help you schedule an appointment. Please fill out the form below.";
            responseData.isAppointmentFlow = true;
        } else {
            // Generate AI Response
            // Retrieve history for context (last 5 messages)
            // Ideally we'd fetch from DB, simplified here:
            const history = []; // TODO: Fetch from conversation.messages if needed
            botResponseText = await geminiService.generateResponse(message, history);
        }

        // 4. Save Bot Response
        const botMessage = await conversationService.addMessageToConversation(conversation._id, {
            sender: MESSAGE_SENDER.BOT,
            content: botResponseText
        });

        res.json({
            success: true,
            data: {
                message: botResponseText,
                messageId: botMessage._id,
                conversationId: conversation._id,
                ...responseData
            }
        });

    } catch (error) {
        next(error);
    }
};

const getHistory = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        // Simple fetch implementation
        // const history = ...
        res.json({ success: true, data: [] });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleChatMessage,
    getHistory
};
