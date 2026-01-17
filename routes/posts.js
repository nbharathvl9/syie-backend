const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Post = require('../models/Post');


router.post('/', auth, async (req, res) => {
  try {
    
    const { companyName, experience, date } = req.body;

    const newPost = new Post({
      authorRoll: req.user.rollNumber, 
      authorName: req.body.authorName, 
      companyName,
      experience,
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

    const posts = await Post.find(query)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/student/:roll', async (req, res) => {
  try {
    const posts = await Post.find({ authorRoll: req.params.roll })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/:id/comment', auth, async (req, res) => {
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

module.exports = router;