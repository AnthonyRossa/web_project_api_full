const Card = require('../models/card');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { handleCardError } = require('../utils/errorHandler');

const getCards = (req, res, next) => {
  Card.find()
    .then(cards => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => res.status(201).send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Dados do card inválidos'));
      }
      next(err);
    });
}

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new NotFoundError('Card não encontrado'))
    .then(card => {
        if (card.owner.toString() !== req.user._id) {
          throw new ForbiddenError('Permissão negada para deletar este card');
      }

      return Card.findByIdAndDelete(cardId);
    })
    .then(() => {
      res.send({ message: 'Card deletado com sucesso' });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return next(new ValidationError('ID do card inválido'));
      }
      next(err);
    });
}

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .orFail(() => new NotFoundError('Card não encontrado'))
    .then(card => res.send(card))
    .catch(err => handleCardError(err, next));
}

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .orFail(() => new NotFoundError('Card não encontrado'))
    .then(card => res.send(card))
    .catch(err => handleCardError(err, next));
}

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };