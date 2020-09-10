const router = require('express').Router();
const authController = require('../controllers/authController');

router.route('/signup').post(authController.signup);
router.route('/login').get(authController.login);

module.exports = router;
