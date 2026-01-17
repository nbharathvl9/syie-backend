const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);