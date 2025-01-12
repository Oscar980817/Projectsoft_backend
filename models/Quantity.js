const mongoose = require('mongoose');

const quantitySchema = new mongoose.Schema({
  largo: { type: Number, required: true },
  ancho: { type: Number, required: true },
  profundidad: { type: Number, required: true }
});

module.exports = mongoose.model('Quantity', quantitySchema);
