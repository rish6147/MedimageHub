// routes/admin.js
const express = require("express");
const {
  adminLogin,
  getAdminDashboard,
  getPendingDoctors,
  authorizeDoctor,
  rejectDoctor,
} = require("../controllers/adminController");
// const adminMiddleware = require("../middleware/adminMiddleware"); // Admin middleware
const router = express.Router();

// Admin Login
router.post("/login", adminLogin);

// Apply adminMiddleware to all routes below
// router.use(adminMiddleware);

// Admin Dashboard
router.get("/dashboard", getAdminDashboard);

// Fetch Pending Doctor Registrations
router.get("/users", getPendingDoctors);

// Authorize a Doctor
router.post("/authorize-doctor/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const result = await authorizeDoctor(doctorId); 
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error authorizing doctor:", error);
    res.status(500).json({ message: 'Error authorizing doctor.' }); // Handle error
  }
});

// Reject a Doctor
router.post("/reject-doctor/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const result = await rejectDoctor(doctorId); 
    res.status(200).json({ message: result }); // Send success message
  } catch (error) {
    console.error("Error rejecting doctor:", error);
    res.status(500).json({ message: 'Error rejecting doctor.' }); // Handle error
  }
});

module.exports = router;
