const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/validation-err');
const AuthError = require('../errors/auth-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
  .then(hash => User.create({
    name,
    about,
    avatar,
    email,
    password: hash }))
  .then(user => res.status(201).send(user))
  .catch(err => {
    if (err.name === 'ValidationError') {
      return next(new ValidationError('Dados do usuário inválidos'));
    }
    if (err.code === 11000) {
      return next(new ConflictError('E-mail já cadastrado'));
    }
    next(err);
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
  .then (user => {
    if(!user) {
      return next(new AuthError('E-mail ou senha incorretos'));
    }

    return bcrypt.compare(password, user.password)
    .then(isPasswordValid => {
      if(!isPasswordValid) {
        return next(new AuthError('E-mail ou senha incorretos'));
      }

      const token = jwt.sign({ _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({ token });
    });
  })
  .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail(() => new NotFoundError('Usuário não encontrado'))
    .then(user => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
  .orFail(() => new NotFoundError('Usuário não encontrado'))
  .then(user => res.send(user))
  .catch(err => {
    if (err.name === 'ValidationError') {
      return next(new ValidationError('Dados do usuário inválidos'));
    }
    next(err);
  });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  .orFail(() => new NotFoundError('Usuário não encontrado'))
  .then(user => res.send(user))
  .catch(err => {
    if (err.name === 'ValidationError') {
      return next(new ValidationError('Dados do usuário inválidos'));
    }
    next(err);
  });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
  .orFail(() => new NotFoundError('Usuário não encontrado'))
  .then(user => res.send(user))
  .catch(next);
};

module.exports = { getUsers, getUserById, createUser, updateUser, updateAvatar, login, getCurrentUser };