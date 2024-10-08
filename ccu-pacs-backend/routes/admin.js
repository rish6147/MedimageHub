// routes/admin.js
const express = require("express");
const Admin = require("../models/Admin"); // Create if separate model is used
const { adminLogin, getAdminDashboard } = require("../controllers/adminController");
const router = express.Router();

// Admin Login
router.post("/login", adminLogin);

// Admin Dashboard
router.get("/dashboard", getAdminDashboard);

module.exports = router;
