const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

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

  res.status(201).json({
    status: 'success',
    user,
  });
});
