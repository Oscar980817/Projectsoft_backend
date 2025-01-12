"use strict";
const mongoose = require('mongoose');
const scheduleSchema = new mongoose.Schema({
    // Define the attributes for Programacion
    usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
module.exports = mongoose.model('Schedule', scheduleSchema);
