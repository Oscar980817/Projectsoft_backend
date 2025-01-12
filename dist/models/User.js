"use strict";
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    notificaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notificacion' }],
    normas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Norma' }],
    planos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plano' }],
    informes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Informe' }],
    actividades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});
module.exports = mongoose.model('User', userSchema);
