const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define Admin schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  emailId: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Hash password before saving the admin document
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified or new
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password for login
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
