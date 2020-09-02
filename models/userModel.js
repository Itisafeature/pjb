const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Must have a username'],
    minLength: [5, 'Username must be at least 5 characters long'],
    maxLength: [15, 'Username can be a maximum of 15 characters long'],
    index: {
      unique: true,
      collation: {
        locale: 'en',
        strength: 2,
      },
    },
    match: [
      /^[a-zA-Z0-9-_]+$/,
      'Usernames may only contain letters, numbers, undercores and dashes',
    ],
  },
  email: {
    type: String,
    required: [true, "Email can't be blank"],
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    index: {
      unique: true,
      collation: {
        locale: 'en',
        strength: 2,
      },
    },
  },
  password: {
    type: String,
    required: [true, 'Must have a password'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      'Password must contain at least 1 lowercase letter, 1 uppercase letter and a number',
    ],
    minLength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
});

module.exports = mongoose.model('User', userSchema);
