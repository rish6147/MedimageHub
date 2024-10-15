// routes/patient.js
const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

// Function to convert video to images with 2 frames per second
const convertVideoToImages = async (videoFilePath) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, "../uploads/images", path.basename(videoFilePath, path.extname(videoFilePath))); // Directory to save images

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Use FFmpeg to extract 2 frames per second from the video
    ffmpeg(videoFilePath)
      .outputOptions("-vf", "fps=2") // Set frame rate to 2 frames per second
      .on("end", () => {
        console.log("Video has been converted into images successfully.");
        fs.readdir(outputDir, (err, files) => {
          if (err) reject(err);
          const imageFiles = files.map((file) => path.join(outputDir, file));
          resolve(imageFiles); // Return the list of image paths
        });
      })
      .on("error", (err) => {
        console.error("Error processing video: ", err);
        reject(err);
      })
      .save(`${outputDir}/image-%04d.png`); // Output images with a format like image-0001.png
  });
};

// Route to add a new patient
router.post("/add", async (req, res) => {
  const { name, patientId, admissionDate, diagnosis, treatment, status } =
    req.body;

  try {
    // Check if patient with same ID already exists
    const existingPatient = await Patient.findOne({ patientId });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient ID already exists" });
    }

    // Create new patient
    const newPatient = new Patient({
      name,
      patientId,
      admissionDate,
      diagnosis,
      treatment,
      status,
    });
    await newPatient.save();

    res
      .status(201)
      .json({ message: "Patient added successfully", patient: newPatient });
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/originals/");
  },
  filename: function (req, file, cb) {
    const sanitizedFileName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, sanitizedFileName);
  },
});
const upload = multer({ storage });

// Get specific patient details
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    res.json(patient);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Upload video for a specific patient
router.post("/:id/upload", upload.single("video"), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    const video = {
      filename: req.file.filename,
      filePath: req.file.path,
    };

    patient.videos.push(video);
    await patient.save();
    res.status(200).send("Video uploaded successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Route to handle video trimming
router.post("/:id/videos/:videoId/trim", async (req, res) => {
  const { id, videoId } = req.params;
  const { startTime, endTime } = req.body;

  try {
    // Find the patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Find the video in the patient's video array
    const video = patient.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const videoPath = path.join(__dirname, "../", video.filePath);
    const trimmedVideoName = `trimmed_${Date.now()}_${video.filename}`;
    const trimmedVideoPath = path.join(
      __dirname,
      "../uploads/processedVideos",
      trimmedVideoName
    );

    // Trimming the video using ffmpeg
    ffmpeg(videoPath)
      .setStartTime(startTime) // e.g., '00:00:10' for 10 seconds
      .setDuration(endTime - startTime) // Duration in seconds
      .output(trimmedVideoPath)
      .on("end", async () => {
        // After trimming, add the trimmed video to patient's processed videos
        const trimmedVideo = {
          filename: trimmedVideoName,
          filePath: `uploads/processedVideos/${trimmedVideoName}`,
          uploadDate: new Date(),
        };

        patient.processedVideos = patient.processedVideos || [];
        patient.processedVideos.push(trimmedVideo);

        await patient.save();

        res.status(200).json({
          message: "Video trimmed successfully",
          trimmedVideo,
        });
      })
      .on("error", (err) => {
        console.error("Error during trimming:", err);
        res.status(500).json({ message: "Error during trimming" });
      })
      .run();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to handle video conversion operations
router.post("/:patientId/videos/:videoId/operation", async (req, res) => {
  const { patientId, videoId } = req.params;
  const { operation } = req.body;

  try {
    // Find the patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Find the video in the patient's video array
    const video = patient.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const videoFilePath = path.join(__dirname, "../", video.filePath); // Construct full path to video file
    console.log("Video file path:", videoFilePath);

    // Execute different operations based on the type
    switch (operation) {
      case "convert-to-images":
        try {
          const images = await convertVideoToImages(videoFilePath); // Pass the full video file path
          res.json({ success: true, images });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
        break;

      // Add other operations as needed
      case "cancerDetection":
        // Logic for cancer detection
        break;
      case "superResolution":
        // Logic for super resolution
        break;
      case "cancerClassification":
        // Logic for cancer classification
        break;

      default:
        res.status(400).json({ success: false, message: "Invalid operation" });
        break;
    }
  } catch (error) {
    console.error("Error processing operation:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;