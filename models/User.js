const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  // Placement Status
  isPlaced: { type: Boolean, default: false },
  placedCompany: { type: String, default: '' },
  package: { type: String, default: '' },
  placedDate: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);