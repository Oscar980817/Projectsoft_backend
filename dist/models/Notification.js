"use strict";
const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    estado: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    leido: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Notification', notificationSchema);
