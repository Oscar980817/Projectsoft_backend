const mongoose = require('mongoose');

const DailyActivitySchema = new mongoose.Schema({
  civ: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CIV', 
    required: true 
  },
  actividad: { type: String, required: true },
  ubi_inicial: { type: String, required: true },
  ubi_final: { type: String, required: true },
  item: { type: String, required: true },
  largo: { type: Number, required: true },
  ancho: { type: Number, required: true },
  alto: { type: Number, required: true },
  total: { type: Number, required: true },
  descuento_largo: { type: Number, required: true },
  descuento_ancho: { type: Number, required: true },
  descuento_alto: { type: Number, required: true },
  total_descuento: { type: Number, required: true },
  total_final: { type: Number, required: true },
  fotografia: { type: String, required: true },
  observaciones: { type: String, required: true },
  informeGenerado: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cargo: { type: String, required: true }
}, { timestamps: true });

// Add middleware for populating CIV
DailyActivitySchema.pre('find', function() {
  this.populate('civ');
});

DailyActivitySchema.pre('findOne', function() {
  this.populate('civ');
});

module.exports = mongoose.model('DailyActivity', DailyActivitySchema);