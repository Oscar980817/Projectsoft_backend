const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  ubi_inicial: { type: String, required: true },
  ubi_final: { type: String, required: true },
  civ: { type: mongoose.Schema.Types.ObjectId, ref: 'Civ' },
  item: { type: String, required: true },
  actividad: { type: String, required: true },
  cantidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Cantidad' },
  fotografia: { type: mongoose.Schema.Types.ObjectId, ref: 'Fotografia' },
  clima: { type: mongoose.Schema.Types.ObjectId, ref: 'Weather' },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actividades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }]
});

module.exports = mongoose.model('Report', reportSchema);