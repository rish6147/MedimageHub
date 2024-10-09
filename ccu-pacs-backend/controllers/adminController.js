// controllers/adminController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Use User model with roles
const Admin = require("../models/Admin");

// Load environment variables
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Ensure this is set in your .env file

// Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Admin does not Exits!" });
    }

    // const isMatch = await bcrypt.compare(password, admin.password);
    const isMatch = password === admin.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = jwt.sign({ userId: admin._id, username }, JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // res.status(200).json({ message: "Login successful", token });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Dashboard (Example)
exports.getAdminDashboard = (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
};

// Get Pending Doctor Registrations
exports.getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await User.find({ role: 'doctor', isApproved: false });
    res.json(pendingDoctors);
  } catch (error) {
    console.error("Error fetching pending doctor registrations:", error);
    res.status(500).json({ message: "Failed to load doctor registrations" });
  }
};

// Authorize a Doctor
exports.authorizeDoctor = async (doctorId) => {
  try {
    console.log("Authorizing doctor with uniqueId:", doctorId);

    // Use findOne to get a single document
    const doctor = await User.findOne({ role: 'doctor', uniqueId: doctorId });
    console.log("Doctor fetched:", doctor);

    if (!doctor) {
      return { success: false, message: "Doctor not found" };
    }

    // Update the isApproved field
    doctor.isApproved = true;
    await doctor.save(); // Save the updated document
    console.log("Doctor authorized and saved successfully.");

    return { success: true, message: "Doctor has been authorized" };
  } catch (error) {
    console.error("Error authorizing doctor:", error.message);
    throw new Error("Failed to authorize doctor");
  }
};

// Reject a Doctor
exports.rejectDoctor = async (doctorId) => {
  try {
    console.log("Rejecting doctor with uniqueId:", doctorId);

    const doctor = await User.findOne({ role: 'doctor', uniqueId: doctorId });
    if (!doctor) {
      return { success: false, message: "Doctor not found" };
    }

    await User.findOneAndDelete({ role: 'doctor', uniqueId: doctorId });

    console.log("Doctor rejected and removed successfully.");
    return { success: true, message: "Doctor has been rejected and removed" };
  } catch (error) {
    console.error("Error rejecting doctor:", error.message);
    throw new Error("Failed to reject doctor");
  }
};