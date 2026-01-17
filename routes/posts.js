const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our JWT protector
const Post = require('../models/Post');

// @route    POST api/posts
// @desc     Create an interview post
// @access   Private
router.post('/', auth, async (req, res) => {
  try {
    const { companyName, rounds, questions, result, experience, date } = req.body;

    const newPost = new Post({
      authorRoll: req.user.rollNumber, // From JWT
      authorName: req.body.authorName, // Passed from frontend
      companyName,
      rounds,
      questions,
      result,
      experience,
      interviewDate: date
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts
// @desc     Get all posts OR Filter by Company
// @access   Public
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.company) {
      // Regex makes search flexible (e.g., 'goog' matches 'Google')
      query.companyName = { $regex: req.query.company, $options: 'i' };
    }
    
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/student/:roll
// @desc     Get all posts by a specific student
// @access   Public
router.get('/student/:roll', async (req, res) => {
  try {
    const posts = await Post.find({ authorRoll: req.params.roll }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;