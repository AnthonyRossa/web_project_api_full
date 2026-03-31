const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, updateUser, updateAvatar } = require('../controllers/users');
const { validateURL } = require('../utils/validation');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  })
}), getUserById);

router.patch('/:userId', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), updateUser);

router.patch('/:userId/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (!validateURL(value, helpers)) {
        return helpers.error('string.uri');
      }
      return value;
    }),
  })
}), updateAvatar);

module.exports = router;