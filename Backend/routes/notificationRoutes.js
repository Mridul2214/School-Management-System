const express = require('express');
const router = express.Router();
const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getMyNotifications)
    .post(admin, createNotification);

router.put('/read-all', markAllAsRead);

router.route('/:id')
    .delete(deleteNotification);

router.put('/:id/read', markAsRead);

module.exports = router;
