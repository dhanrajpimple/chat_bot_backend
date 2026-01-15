const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/message', chatController.handleChatMessage);
router.get('/history/:sessionId', chatController.getHistory);

module.exports = router;
