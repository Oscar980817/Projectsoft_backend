"use strict";
const mongoose = require('mongoose');
const weatherSchema = new mongoose.Schema({
    nombre: { type: String, required: true }
});
module.exports = mongoose.model('Weather', weatherSchema);
