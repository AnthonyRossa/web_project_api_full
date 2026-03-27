const User = require('../models/user');
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500, ERROR_CODE_409, ERROR_CODE_401 } = require('../utils/constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const createUser = (req, res) => {
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
      return res.status(ERROR_CODE_400).send({ message: 'Dados do usuário inválidos' });
    }
    if (err.code === 11000) {
      return res.status(ERROR_CODE_409).send({ message: 'E-mail já cadastrado' });
    }
    res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
  });
};

const login = (req,res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
  .then (user => {
    if(!user) {
      return res.status(ERROR_CODE_401).send({ message: 'E-mail ou senha incorretos' });
    }

    return bcrypt.compare(password, user.password)
    .then(usPasswordValid => {
      if(!usPasswordValid) {
        return res.status(ERROR_CODE_401).send({ message: 'E-mail ou senha incorretos' });
      }

      const token = jwt.sign({ _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(200).json({ token });
    });
  })
  .catch(err => res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' }));
};

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Dados do usuário inválidos' });
      }
      res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail(() => {
    const error = new Error('Usuário não encontrado');
    error.statusCode = ERROR_CODE_404;
    throw error;
  })
    .then(user => res.send(user))
    .catch(next);
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
  .orFail(() => {
    const error = new Error('Usuário não encontrado');
    error.statusCode = ERROR_CODE_404;
    throw error;
  })
  .then(user => res.send(user))
  .catch(err => {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE_400).send({ message: 'Dados do usuário inválidos' });
    }
    res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
  });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  .orFail(() => {
    const error = new Error('Usuário não encontrado');
    error.statusCode = ERROR_CODE_404;
    throw error;
  })
  .then(user => res.send(user))
  .catch(err => {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE_400).send({ message: 'Dados do usuário inválidos' });
    }
    res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
  });
};

module.exports = { getUsers, getUserById, createUser, updateUser, updateAvatar, login };