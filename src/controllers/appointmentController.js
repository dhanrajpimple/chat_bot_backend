const appointmentService = require('../services/appointmentService');
const conversationService = require('../services/conversationService');
const { MESSAGE_SENDER } = require('../config/constants');
const Appointment = require('../models/Appointment');

const createAppointment = async (req, res, next) => {
    try {
        const { sessionId, petOwnerName, petName, phoneNumber, preferredDate, preferredTime, notes } = req.body;

        // Backend Validation
        const validation = appointmentService.validateAppointmentData(req.body);
        if (!validation.isValid) {
            res.status(400);
            throw new Error(validation.errors.join(', '));
        }

        // 1. Get or Create Conversation first to link the appointment
        const conversation = await conversationService.findOrCreateConversation(sessionId);

        // 2. Create Appointment linked to the conversation
        const appointment = await appointmentService.createAppointment({
            sessionId,
            conversationId: conversation._id,
            ...req.body
        });

        // No need to save again as createAppointment already saves it

        // Send confirmation message to chat
        const confirmMsg = `Appointment confirmed for ${petName} on ${preferredDate} at ${preferredTime}. Ref: ${appointment.appointmentId}`;
        await conversationService.addMessageToConversation(conversation._id, {
            sender: MESSAGE_SENDER.BOT,
            content: confirmMsg,
            messageType: 'appointment_confirmation'
        });

        res.status(201).json({
            success: true,
            data: {
                appointmentId: appointment.appointmentId,
                message: confirmMsg
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAppointment
};
