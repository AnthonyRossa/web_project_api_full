const express = require('express');
const router = express.Router();

const { getCards, createCard, deleteCard, LikeCard, DislikeCard } = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', LikeCard);

router.delete('/:cardId/likes', DislikeCard);

module.exports = router;
