"use strict";
const mongoose = require('mongoose');
const dailyReportSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    summary: {
        type: String,
        required: true
    },
    activities: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DailyActivity'
        }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    rejectionReason: {
        type: String
    },
    comments: [{
            text: String,
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
}, {
    timestamps: true
});
// Middleware para poblar automáticamente los campos relacionados
dailyReportSchema.pre('find', function () {
    this.populate('activities')
        .populate('createdBy', 'nombre roles')
        .populate('approvedBy', 'nombre');
});
dailyReportSchema.pre('findOne', function () {
    this.populate('activities')
        .populate('createdBy', 'nombre roles')
        .populate('approvedBy', 'nombre');
});
module.exports = mongoose.model('DailyReport', dailyReportSchema);
