const User = require('../models/user');
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500, ERROR_CODE_409, ERROR_CODE_401 } = require('../utils/constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
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
    .then(usPasswordValid => {
      if(!usPasswordValid) {
        return next(new AuthError('E-mail ou senha incorretos'));
      }

      const token = jwt.sign({ _id: user._id },
        JWT_SECRET,
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
  .then(user => res.send({ data: user }))
  .catch(next);
};

module.exports = { getUsers, getUserById, createUser, updateUser, updateAvatar, login, getCurrentUser };