const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// MongoDB Connection String (ensure your MongoDB server is running)
const MONGO_URI = 'mongodb://localhost:27017/pacs_demo';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const adminRoutes = require('./routes/admin'); // Admin routes
const User = require('./models/User');

// Use routes
app.use('/api', authRoutes);              // Auth routes (login/register)
app.use('/api/patients', patientRoutes);  // Patient-related routes
app.use('/api/admin', adminRoutes);       // Admin-related routes

// Basic test route
app.get('/', (req, res) => {
  res.send('We are the Best!');
});

// Endpoint to get pending doctor registrations
app.get('/api/users', async (req, res) => {
  try {
      const pendingDoctors = await User.find({ isApproved: false });
      res.json(pendingDoctors);
  } catch (error) {
      console.error('Error fetching pending doctor registrations:', error);
      res.status(500).json({ message: 'Failed to load doctor registrations' });
  }
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

