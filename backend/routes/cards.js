const express = require('express');
const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../utils/validation');
const { getCards, createCard, deleteCard, LikeCard, DislikeCard } = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30), 
    link: Joi.string().required().custom(validateURL),
  })
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  })
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  })
}), LikeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  })
}), DislikeCard);

module.exports = router;
