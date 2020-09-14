const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
});

userSchema.methods.getFields = function () {
  const obj = {
    _id: this._id,
    username: this.username,
    email: this.email,
  };
  return obj;
};

userSchema.methods.comparePassword = async function (req) {
  const result = await bcrypt.compare(req.body.password, this.password);
  if (!result) throw new Error('Invalid Credentials');
};

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

module.exports = mongoose.model('User', userSchema);
