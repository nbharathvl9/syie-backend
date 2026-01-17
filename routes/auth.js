const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/register', async (req, res) => {
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
        res.json({ token, rollNumber: user.rollNumber, fullName: user.fullName });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/login', async (req, res) => {
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
        res.json({ token, rollNumber: user.rollNumber, fullName: user.fullName });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;