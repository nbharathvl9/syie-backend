const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  authorRoll: { type: String, ref: 'User', required: true },
  authorName: { type: String, required: true },
  companyName: { type: String, required: true },
  interviewDate: { type: Date, default: Date.now }, 
  experience: { type: String, required: true },
  
  comments: [{
    authorRoll: String,
    authorName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

PostSchema.index({ companyName: 'text' });

module.exports = mongoose.model('Post', PostSchema);