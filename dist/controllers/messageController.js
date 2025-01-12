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
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const createOrUpdateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reportId, remitente, destinatario, asunto, descripcion } = req.body;
        const message = new Message({
            reportId,
            remitente,
            destinatario,
            asunto,
            descripcion,
            fecha_de_programa: new Date(),
            documento: ''
        });
        yield message.save();
        res.status(200).json(message);
    }
    catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Error al crear el mensaje' });
    }
});
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message.find()
            .populate('remitente', 'nombre')
            .populate('destinatario', 'nombre')
            .sort({ fecha_de_programa: -1 });
        // Group messages by reportId
        const groupedMessages = messages.reduce((acc, message) => {
            if (!acc[message.reportId]) {
                acc[message.reportId] = [];
            }
            acc[message.reportId].push(message);
            return acc;
        }, {});
        res.status(200).json(groupedMessages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error al obtener los mensajes' });
    }
});
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estado, usuario } = req.body;
        const newNotification = new Notification({
            estado,
            usuario
        });
        yield newNotification.save();
        res.status(201).json(newNotification);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield Notification.find().populate('estado usuario');
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = {
    createOrUpdateMessage,
    getMessages,
    createNotification,
    getNotifications
};
