const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/signup', UserController.user_signup);


router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.user_delete_user);
//export such that module can be used in other files
module.exports = router
