// middleware/adminMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Ensure this matches your .env

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(201).json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findById(decoded.userId);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied, not an admin" });
    }

    req.admin = admin; // Pass the admin object to the next middleware
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = adminMiddleware;
