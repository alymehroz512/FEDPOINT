const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' }, // Only admins for now
  refreshToken: { type: String }, // Store refresh token hash
  otp: { type: String }, // Hashed OTP
  otpExpires: { type: Date }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Compare refresh token
userSchema.methods.compareRefreshToken = async function (token) {
  return bcrypt.compare(token, this.refreshToken);
};

module.exports = mongoose.model('User', userSchema);