const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization must have a name'],
    minLength: [3, 'Name must be at least 3 characters long'],
    maxLength: [30, 'Name can be a maximum of 30 characters long'],
    index: {
      unique: true,
      collation: {
        locale: 'en',
        strength: 2,
      },
    },
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
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});
