"use strict";
const mongoose = require('mongoose');
const photoSchema = new mongoose.Schema({
    civ: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CIV',
        required: true
    },
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DailyReport'
    },
    fotografia: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});
module.exports = mongoose.model('Photo', photoSchema);
