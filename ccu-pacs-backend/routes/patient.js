// routes/patient.js
const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const multer = require('multer');

// Route to add a new patient
router.post("/add", async (req, res) => {
    const { name, patientId, admissionDate, diagnosis, treatment, status } = req.body;

    try {
        // Check if patient with same ID already exists
        const existingPatient = await Patient.findOne({ patientId });
        if (existingPatient) {
            return res.status(400).json({ message: "Patient ID already exists" });
        }

        // Create new patient
        const newPatient = new Patient({ name, patientId, admissionDate, diagnosis, treatment, status });
        await newPatient.save();

        res.status(201).json({ message: "Patient added successfully", patient: newPatient });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Route to get all patients
router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

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


// Get specific patient details
router.get('/:id', async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).send('Patient not found');
      }
      res.json(patient);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

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
