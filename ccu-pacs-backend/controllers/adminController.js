// controllers/adminController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Create if separate model is used

const JWT_SECRET = "your_jwt_secret_key"; // Use environment variable

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

    const token = jwt.sign({ userId: admin._id, username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Dashboard (Example)
exports.getAdminDashboard = (req, res) => {
  res.send("Admin Dashboard");
};
