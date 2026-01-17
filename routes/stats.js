const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

// Get platform statistics
router.get('/', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();

        // Count unique companies from interview posts
        const companies = await Post.distinct('companyName', {
            postType: 'Interview',
            companyName: { $ne: 'General Discussion' }
        });
        const totalCompanies = companies.length;

        // Count placed students (users who have at least one interview post)
        const placedStudents = await Post.distinct('authorRoll', { postType: 'Interview' });
        const totalPlaced = placedStudents.length;

        res.json({
            totalUsers,
            totalPosts,
            totalCompanies,
            totalPlaced
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
