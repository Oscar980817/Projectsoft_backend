"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Civ = require('../models/Civ');
exports.getCivs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const civs = yield Civ.find().sort({ numero: 1 });
        res.status(200).json(civs);
    }
    catch (error) {
        console.error('Error fetching CIVs:', error);
        res.status(500).json({ message: 'Error al obtener CIVs' });
    }
});
exports.createCiv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numero } = req.body;
    try {
        const newCiv = new Civ({ numero });
        yield newCiv.save();
        res.status(201).json(newCiv);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteCiv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCiv = yield Civ.findByIdAndDelete(req.params.id);
        if (!deletedCiv)
            return res.status(404).json({ message: 'CIV not found' });
        res.status(200).json({ message: 'CIV deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
