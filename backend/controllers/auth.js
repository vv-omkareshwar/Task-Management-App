const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT;

exports.createUser = [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  
  async (req, res) => {
    let success = false;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "Sorry, a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id
        }
      };
      const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

      success = true;
      res.json({ success, authtoken });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
    }
  }
];

exports.loginUser = [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),

  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id
        }
      };
      const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '28d' });

      success = true;
      res.json({ success, authtoken });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
    }
  }
];

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
};

exports.changePassword = [
  body('email', 'Enter a valid email').isEmail(),
  body('newPassword', 'New password must be at least 5 characters').isLength({ min: 5 }),

  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, newPassword } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "User not found" });
      }

      const salt = await bcrypt.genSalt(10);
      const newSecPass = await bcrypt.hash(newPassword, salt);
      user.password = newSecPass;
      await user.save();

      success = true;
      res.json({ success, message: "Password changed successfully" });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
    }
  }
];
