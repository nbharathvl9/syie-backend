const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  // Placement Status
  isPlaced: { type: Boolean, default: false },
  placedCompany: { type: String, default: '' },
  package: { type: String, default: '' },
  placedDate: { type: Date },
  // Social Links
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    codeforces: { type: String, default: '' },
    email: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  }
});

module.exports = mongoose.model('User', UserSchema);