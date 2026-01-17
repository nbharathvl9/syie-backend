const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user by roll number (for profile viewing)
router.get('/user/:roll', async (req, res) => {
  try {
    const user = await User.findOne({ rollNumber: req.params.roll }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/register', [
  body('rollNumber')
    .trim()
    .notEmpty().withMessage('Roll number is required')
    .customSanitizer(value => value.toUpperCase()), // Auto convert to uppercase
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const { rollNumber, fullName, password } = req.body;

  try {
    let user = await User.findOne({ rollNumber });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }


    user = new User({
      rollNumber,
      fullName,
      password
    });


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        rollNumber: user.rollNumber,
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, id: user.id, rollNumber: user.rollNumber, fullName: user.fullName });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/login', [
  body('rollNumber')
    .trim()
    .notEmpty().withMessage('Roll number is required')
    .customSanitizer(value => value.toUpperCase()), // Auto convert to uppercase
  body('password')
    .notEmpty().withMessage('Password is required')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const { rollNumber, password } = req.body;

  try {
    let user = await User.findOne({ rollNumber });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        rollNumber: user.rollNumber,
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, id: user.id, rollNumber: user.rollNumber, fullName: user.fullName });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update Placement Status
router.put('/placement-status', auth, [
  body('isPlaced').isBoolean().withMessage('Placement status must be true or false'),
  body('placedCompany').optional().trim(),
  body('package').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  try {
    const { isPlaced, placedCompany, package: pkg } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isPlaced = isPlaced;
    if (isPlaced) {
      user.placedCompany = placedCompany || '';
      user.package = pkg || '';
      user.placedDate = new Date();
    } else {
      user.placedCompany = '';
      user.package = '';
      user.placedDate = null;
    }

    await user.save();

    res.json({
      isPlaced: user.isPlaced,
      placedCompany: user.placedCompany,
      package: user.package,
      placedDate: user.placedDate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;