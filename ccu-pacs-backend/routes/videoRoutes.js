const express = require('express');
const { trimVideo } = require('../controllers/videoController');
const router = express.Router();

// POST route to trim a video
router.post('/trim', trimVideo);

module.exports = router;
