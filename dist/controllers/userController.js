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
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
exports.getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find().populate('roles');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.params.id).populate('roles');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, email, contraseña, roles } = req.body;
    try {
        // Validar si el usuario ya existe
        const userExists = yield User.findOne({ email: email });
        if (userExists)
            return res.status(400).json({ message: 'User already exists' });
        // Validar la contraseña
        if (!validatePassword(contraseña)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' });
        }
        // Hashear la contraseña
        const hashedPassword = yield bcrypt.hash(contraseña, 10);
        // Crear un nuevo usuario
        const user = new User({
            nombre,
            email,
            contraseña: hashedPassword,
            roles: roles.map(role => new mongoose.Types.ObjectId(role)) // Convertir los IDs de roles a ObjectId
        });
        const savedUser = yield user.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('roles');
        if (!updatedUser)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield User.findByIdAndDelete(req.params.id);
        if (!deletedUser)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ correo: req.params.email }).populate('roles');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateUserRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roles } = req.body;
    try {
        const updatedUser = yield User.findByIdAndUpdate(req.params.id, { roles: roles.map(role => new mongoose.Types.ObjectId(role)) }, { new: true }).populate('roles');
        if (!updatedUser)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
