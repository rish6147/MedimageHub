const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Assuming admin uses username
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true },
    isApproved: { type: Boolean, default: false }, // Approval status for doctor sign-in
    role: { type: String, enum: ["admin", "doctor"], default: "doctor" }, // User role, default is doctor
    specialty: { type: String, default: "MD" },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to check if a doctor is approved for login
userSchema.statics.isDoctorApproved = async function (email) {
  const user = await this.findOne({ email, role: "doctor" });
  return user ? user.isApproved : false; // Return true if approved, false otherwise
};

// Static method to find and authorize a doctor
userSchema.statics.authorizeDoctor = async function (doctorId) {
  const doctor = await this.findById(doctorId);
  if (!doctor || doctor.role !== "doctor") {
    throw new Error("Doctor not found");
  }

  doctor.isApproved = true;
  await doctor.save();
  return "Doctor has been authorized";
};

// Static method to reject a doctor
userSchema.statics.rejectDoctor = async function (doctorId) {
  const doctor = await this.findById(doctorId);
  if (!doctor || doctor.role !== "doctor") {
    throw new Error("Doctor not found");
  }

  await this.findByIdAndDelete(doctorId);
  return "Doctor has been rejected and removed";
};

module.exports = mongoose.model("User", userSchema);
