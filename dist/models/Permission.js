"use strict";
const mongoose = require('mongoose');
const permissionSchema = new mongoose.Schema({
    nombre: { type: String, required: true }
});
module.exports = mongoose.model('Permission', permissionSchema);
