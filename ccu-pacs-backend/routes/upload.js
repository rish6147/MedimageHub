// routes/upload.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Patient = require('../models/Patient');

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Adjust the path as necessary
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Upload video for a specific patient
router.post('/:id/upload', upload.single('video'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    const video = {
      filename: req.file.filename,
      filePath: req.file.path,
    };

    patient.videos.push(video);
    await patient.save();
    res.status(200).send('Video uploaded successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
