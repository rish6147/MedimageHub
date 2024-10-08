const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const ffmpeg = require('fluent-ffmpeg');
// const { trimVideo } = require('../controllers/videoController');

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pacs_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient'); // Add patient routes
const videoRoutes = require('./routes/videoRoutes'); // Add video routes

// Use routes
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/patients', patientRoutes); // Use patient routes
app.use('/api/videos', videoRoutes); // Use video routes

// admin
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('<h1 style="color:blue">We are the Best!</h1>');
});

// Start server
const PORT = process.env.PORT || 5000 || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
