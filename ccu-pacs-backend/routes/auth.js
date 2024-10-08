// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config(); // Load environment variables

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use the key from .env or fallback

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password, uniqueId } = req.body;

  try {
    // Check if user with the same email or uniqueId already exists
    const existingUser = await User.findOne({ $or: [{ email }, { uniqueId }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Unique ID already exists" });
    }

    // Create a new user with isApproved set to false and role 'doctor'
    const newUser = new User({
      name,
      email,
      password, // Password will be hashed in the User model
      uniqueId, // Storing the uniqueId
    });

    await newUser.save();

    // Generate JWT token including isApproved and role
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email, 
        uniqueId: newUser.uniqueId, 
        isApproved: newUser.isApproved, 
        role: newUser.role 
      }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(201).json({ 
      message: "User registered successfully. Awaiting admin approval.", 
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is approved
    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: "Account not approved by admin yet." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token including isApproved and role
    const token = jwt.sign(
      { 
        userId: user._id, 
        email, 
        uniqueId: user.uniqueId, 
        isApproved: user.isApproved, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      message: "Login successful", 
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
