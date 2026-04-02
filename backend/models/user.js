const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minLength: 2,
    required: true,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Por favor, insira uma URL válida para o avatar',
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Por favor, insira um E-mail válido',
    },
  },
  password:{
    type: String,
    required:true,
    select: false,
  }
});

module.exports = mongoose.model('user', userSchema);