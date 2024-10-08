// routes/patient.js
const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

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
// routes/patient.js

// Route to get all patients
router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
