const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');


router.post('/', auth, [
  body('companyName')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name too long'),
  body('experience')
    .trim()
    .notEmpty().withMessage('Experience is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Experience must be between 10 and 5000 characters'),
  body('authorName')
    .trim()
    .notEmpty().withMessage('Author name is required'),
  body('postType')
    .optional()
    .isIn(['Interview', 'Discussion']).withMessage('Invalid post type')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  try {

    const { companyName, experience, date, postType } = req.body;

    const newPost = new Post({
      authorRoll: req.user.rollNumber,
      authorName: req.body.authorName,
      companyName,
      experience,
      postType: postType || 'Interview', // Default to Interview if not provided
      interviewDate: date || Date.now()
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/', async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;


    let query = {};
    if (req.query.company) {
      query.companyName = { $regex: req.query.company, $options: 'i' };
    }
    if (req.query.postType && req.query.postType !== 'All') {
      query.postType = req.query.postType;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Fetch user data for each post to include placement status
    const User = require('../models/User');
    const postsWithPlacement = await Promise.all(posts.map(async (post) => {
      const user = await User.findOne({ rollNumber: post.authorRoll }).select('isPlaced placedCompany');
      return {
        ...post.toObject(),
        authorPlacement: user ? { isPlaced: user.isPlaced, placedCompany: user.placedCompany } : null
      };
    }));

    res.json(postsWithPlacement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get posts by student with pagination
router.get('/student/:roll', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ authorRoll: req.params.roll })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ authorRoll: req.params.roll });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/:id/comment', auth, [
  body('text')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters'),
  body('authorName')
    .trim()
    .notEmpty().withMessage('Author name is required')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      authorRoll: req.user.rollNumber,
      authorName: req.body.authorName,
      text: req.body.text
    };


    post.comments.unshift(newComment);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Edit/Update a post
router.put('/:id', auth, [
  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Company name too long'),
  body('experience')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Experience must be between 10 and 5000 characters'),
  body('postType')
    .optional()
    .isIn(['Interview', 'Discussion']).withMessage('Invalid post type')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user owns the post
    if (post.authorRoll !== req.user.rollNumber) {
      return res.status(401).json({ msg: 'Not authorized to edit this post' });
    }

    // Update only provided fields
    if (req.body.companyName) post.companyName = req.body.companyName;
    if (req.body.experience) post.experience = req.body.experience;
    if (req.body.postType) post.postType = req.body.postType;
    if (req.body.interviewDate) post.interviewDate = req.body.interviewDate;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user owns the post
    if (post.authorRoll !== req.user.rollNumber) {
      return res.status(401).json({ msg: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;