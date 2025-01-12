"use strict";
const mongoose = require('mongoose');
const balanceSchema = new mongoose.Schema({
    items: { type: String, required: true },
    descripciones: { type: String, required: true },
    unidades: { type: String, required: true }
});
module.exports = mongoose.model('Balance', balanceSchema);
