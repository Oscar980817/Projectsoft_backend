const mongoose = require('mongoose');

const CIVSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  descripcion: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CIV', CIVSchema);