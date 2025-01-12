const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  leido: { type: Boolean, required: true },
  no_leido: { type: Boolean, required: true }
});

module.exports = mongoose.model('State', stateSchema);