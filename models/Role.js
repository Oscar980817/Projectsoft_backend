const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  permisos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
});

module.exports = mongoose.model('Role', roleSchema);
