"use strict";
const express = require('express');
const router = express.Router();
const { createOrUpdateMessage, getMessages, createNotification, getNotifications } = require('../controllers/messageController');
router.post('/messages', createOrUpdateMessage);
router.get('/messages', getMessages);
router.post('/notifications', createNotification);
router.get('/notifications', getNotifications);
module.exports = router;
