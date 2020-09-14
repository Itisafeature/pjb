const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Team = require('../models/teamModel');

const createAndSendToken = (obj, status, res) => {
  const token = jwt.sign({ id: obj._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
  });

  res.status(status).json({
    status: 'success',
    data: obj,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.baseUrl.includes('/users')) {
    const team = await Team.findOne({ code: req.body.code });
    console.log(req.body);
    team.users.push({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    await team.save();
    const user = User.findOne({ username: req.body.username });
    console.log(user);
    // Remove from output
    user.password = undefined;
    user.passwordConfirm = undefined;
    createAndSendToken(user, 201, res);
  } else {
    const team = await Team.create({
      name: req.body.name,
      email: req.body.email,
      code: randomstring.generate(7),
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    team.password = undefined;
    createAndSendToken(team, 201, res);
  }
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
