const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const authController = require('../controllers/auth');

// Route 1 : Create a User using: POST "/api/auth/signup". No login required
router.post('/signup', authController.createUser);

// Route 2 : Authenticate a User using: get "/api/auth/login". No login required
router.post('/login', authController.loginUser);

// Route 3 : Get logged-in user details using: POST "/api/auth/userdetails". Login required
router.get('/userdetails', fetchuser, authController.getUser);

// Route 4: Change Password for a User using: PUT "/api/auth/user"
router.put('/user', authController.changePassword);

module.exports = router;
