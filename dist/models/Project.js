"use strict";
const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    ubicacion: { type: String, required: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true },
    estado: { type: String, required: true },
    presupuesto: { type: Number, required: true },
    usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    informes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
    normas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Standard' }],
    planos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }],
    balances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Balance' }],
    programaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
    historial: { type: mongoose.Schema.Types.ObjectId, ref: 'History' }
});
module.exports = mongoose.model('Project', projectSchema);
