const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, updateUser, updateAvatar, getCurrentUser } = require('../controllers/users');
const { validateURL } = require('../utils/validation');

router.get('/me', getCurrentUser);

router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  })
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  })
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  })
}), updateAvatar);

module.exports = router;