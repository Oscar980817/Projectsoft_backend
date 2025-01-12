const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationsAsRead } = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Use existing auth middleware instead of protect
router.get('/notifications', auth, getNotifications);
router.put('/notifications/mark-as-read', auth, markNotificationsAsRead);

module.exports = router;