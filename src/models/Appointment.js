const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

const appointmentSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        unique: true,
        index: true
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        index: true
    },
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    petOwnerName: {
        type: String,
        required: true,
        trim: true
    },
    petName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        // Basic validation, detailed validation in service
        match: [/^\+?[\d\s-]{10,}$/, 'Please upload a valid phone number']
    },
    preferredDate: {
        type: Date,
        required: true,
        index: true,
        validate: {
            validator: function (v) {
                return v >= new Date().setHours(0, 0, 0, 0);
            },
            message: 'Appointment date must be today or in the future'
        }
    },
    preferredTime: {
        type: String,
        required: true,
        // More permissive regex to handle HH:mm, HH:mm AM/PM, etc.
        match: [/^[0-9:]+(\s?[AP]M)?$/i, 'Invalid time format']
    },
    status: {
        type: String,
        enum: Object.values(APPOINTMENT_STATUS),
        default: APPOINTMENT_STATUS.PENDING,
        index: true
    },
    notes: {
        type: String,
        maxLength: 500
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Auto-generate appointment ID before save
appointmentSchema.pre('save', function () {
    if (!this.appointmentId) {
        // Format: APT-YYYYMMDD-UUIDSHORT
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const unique = uuidv4().slice(0, 5).toUpperCase();
        this.appointmentId = `APT-${dateStr}-${unique}`;
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
