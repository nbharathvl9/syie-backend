const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users/search/:id
// @desc    Search user by ID (strict format: am.sc.u4csexxxxx)
// @access  Public
router.get('/search/:id', async (req, res) => {
    const userId = req.params.id;

    // Strict validation: am.sc.u4cse followed by 5 alphanumeric characters
    // Case-insensitive match for the prefix, but we preserve the input for the check if needed
    // Regex explanation:
    // ^ - start of string
    // am\.sc\.u4cse - literal prefix (escaped dots)
    // [a-zA-Z0-9]{5} - exactly 5 alphanumeric characters
    // $ - end of string
    // 'i' flag for case-insensitive
    const idRegex = /^am\.sc\.u4cse[a-zA-Z0-9]{5}$/i;

    if (!idRegex.test(userId)) {
        return res.status(400).json({ msg: 'Please enter a valid user ID' });
    }

    try {
        // Find user by rollNumber (case-insensitive search)
        // regex with 'i' option allows "AM.SC..." to match "am.sc..."
        const user = await User.findOne({
            rollNumber: { $regex: new RegExp(`^${userId}$`, 'i') }
        }).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'No user found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
