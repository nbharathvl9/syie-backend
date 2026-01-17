const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  authorRoll: { type: String, ref: 'User', required: true },
  authorName: { type: String, required: true },
  companyName: { type: String, required: true, index: true },
  date: { type: Date, default: Date.now },
  rounds: { type: String },
  questions: [String],
  result: { type: String, enum: ['Selected', 'Rejected', 'Waiting'] },
  experience: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);