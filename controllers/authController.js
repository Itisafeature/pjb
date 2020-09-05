const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

const createAndSendToken = (user, status, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
  });

  res.status(status).json({
    status: 'success',
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Remove from output
  user.password = undefined;
  user.passwordConfirm = undefined;

  createAndSendToken(user, 201, req);
});

exports.login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    '+password'
  );
  try {
    await user.comparePassword(req);
    user.password = undefined;
    createAndSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Credentials. Please try again',
    });
  }
};
