// models/Patient.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    patientId: { type: String, required: true, unique: true },
    admissionDate: { type: Date, required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    status: { type: String, required: true, enum: ["stable", "recovering", "critical"] }
});

module.exports = mongoose.model("Patient", patientSchema);