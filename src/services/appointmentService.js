const Appointment = require('../models/Appointment');
const { isDBConnected } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// In-memory fallback
const memoryAppointments = [];

const createAppointment = async (appointmentData) => {
    if (!isDBConnected()) {
        // Generate ID in-memory
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const unique = uuidv4().slice(0, 5).toUpperCase();
        const apt = {
            ...appointmentData,
            appointmentId: `APT-${dateStr}-${unique}`,
            createdAt: new Date()
        };
        memoryAppointments.push(apt);
        return apt;
    }

    const appointment = new Appointment(appointmentData);
    return await appointment.save();
};

const getAppointmentsBySession = async (sessionId) => {
    if (!isDBConnected()) {
        return memoryAppointments.filter(a => a.sessionId === sessionId);
    }
    return await Appointment.find({ sessionId }).sort({ createdAt: -1 });
};

const validateAppointmentData = (data) => {
    const errors = [];
    if (!data.petOwnerName) errors.push('Owner name is required');
    if (!data.petName) errors.push('Pet name is required');
    if (!data.phoneNumber) errors.push('Phone number is required');
    if (!data.preferredDate) errors.push('Date is required');
    if (!data.preferredTime) errors.push('Time is required');

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    createAppointment,
    getAppointmentsBySession,
    validateAppointmentData
};
