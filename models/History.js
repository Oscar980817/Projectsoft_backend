const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  tipo_modificaciones: { type: String, required: true },
  elemento_modificado: { type: String, required: true },
  fecha: { type: Date, required: true },
  detalle: { type: String, required: true },
  valor_anterior: { type: String, required: true },
  valor_nuevo: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  informe: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  actividad: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }
});

module.exports = mongoose.model('History', historySchema);