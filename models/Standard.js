const mongoose = require('mongoose');

const standardSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  version: { type: String, required: true },
  entidad: { type: String, required: true },
  fecha: { type: Date, required: true },
  documento: { type: String, required: true },
  usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Standard', standardSchema);