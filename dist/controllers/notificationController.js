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
const Notification = require('../models/Notification');
exports.getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield Notification.find({ usuario: req.user._id });
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
});
exports.markNotificationsAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification.updateMany({ usuario: req.user._id, leido: false }, { leido: true });
        res.status(200).json({ message: 'Notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error marking notifications as read', error });
    }
});
