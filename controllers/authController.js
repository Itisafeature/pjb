const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: 'failed',
      err,
    });
  }
};
