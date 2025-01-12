const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyReport' },
  remitente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asunto: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha_de_programa: { type: Date, default: Date.now },
  documento: { type: String, default: '' },
});

module.exports = mongoose.model('Message', messageSchema);