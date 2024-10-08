const ffmpeg = require('fluent-ffmpeg');
const Patient = require('../models/Patient');

// Trimming function
const trimVideo = async (req, res) => {
  const { patientId, videoId, startTime, endTime } = req.body;

  try {
    const patient = await Patient.findOne({ patientId });

    const video = patient.videos.id(videoId);
    const inputPath = video.filePath;  // Path of the original video

    const trimmedFilename = `trimmed-${Date.now()}.mp4`;
    const trimmedFilePath = `uploads/${trimmedFilename}`;

    // Using ffmpeg to trim the video
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .save(trimmedFilePath)
      .on('end', async () => {
        // Save the trimmed video details
        patient.videos.push({
          filename: trimmedFilename,
          filePath: trimmedFilePath,
          startTime,
          endTime,
          isTrimmed: true
        });

        await patient.save();

        res.json({ message: 'Video trimmed successfully!', video: trimmedFilename });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ message: 'Video trimming failed' });
      });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during video trimming', error });
  }
};

module.exports = { trimVideo };
