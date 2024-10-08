// models/Patient.js
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  filename: String,
  filePath: String,
  uploadDate: { type: Date, default: Date.now },
  startTime: { type: Number, default: 0 }, // Start time of the video (for trimmed videos)
  endTime: { type: Number }, // End time of the video (for trimmed videos)
  isTrimmed: { type: Boolean, default: false }, // Flag to indicate if the video is trimmed
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  patientId: { type: String, required: true, unique: true },
  admissionDate: { type: Date, required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["stable", "recovering", "critical"],
  },
  videos: [videoSchema], // Use sub-schema for videos
  processedVideos: [
    {
      filename: String,
      filePath: String,
      uploadDate: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Patient", patientSchema);
