const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        if (notification.recipient.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        notification.isRead = true;
        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Mark ALL notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );
    res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        if (notification.recipient.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Create a notification (Admin or Internal)
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
    const { recipientId, title, message, type, link } = req.body;

    // Check if sending to specific user or broadcast
    // For MVP, let's assume specific recipientId or 'all' or 'role:Student'

    let recipients = [];

    if (recipientId === 'all') {
        recipients = await User.find({ isActive: true }).select('_id');
    } else if (recipientId.startsWith('role:')) {
        const role = recipientId.split(':')[1];
        recipients = await User.find({ role, isActive: true }).select('_id');
    } else {
        recipients = [{ _id: recipientId }];
    }

    const notificationsToInsert = recipients.map(user => ({
        recipient: user._id,
        sender: req.user._id,
        title,
        message,
        type: type || 'info',
        link
    }));

    if (notificationsToInsert.length > 0) {
        await Notification.insertMany(notificationsToInsert);
    }

    res.status(201).json({ message: `Notification sent to ${notificationsToInsert.length} users.` });
});

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
};
