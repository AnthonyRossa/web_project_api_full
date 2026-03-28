const Card = require('../models/card');
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500, ERROR_CODE_403 } = require('../utils/constants');

const getCards = (req, res) => {
  Card.find()
    .then(cards => res.send(cards))
    .catch(err => {
      res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => res.status(201).send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Dados do card inválidos' });
      }
      res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
    });
}

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      const error = new Error('Card não encontrado');
      error.statusCode = ERROR_CODE_404;
      throw error;
    })
    .then(card => {
        if (card.owner.toString() !== req.user._id) {
          const error = new Error('Permissão negada para deletar este card');
          error.statusCode = ERROR_CODE_403;
          throw error;
      }

      return Card.findByIdAndDelete(cardId);
    })
    .then(() => {
      res.send({ message: 'Card deletado com sucesso' });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'ID do card inválido' });
      }
      res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
    });
}

const LikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .orFail(() => {
    const error = new Error('Card não encontrado');
    error.statusCode = ERROR_CODE_404;
    throw error;
  })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'ID do card inválido' });
      }
      res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
    });
}

const DislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .orFail(() => {
    const error = new Error('Card não encontrado');
    error.statusCode = ERROR_CODE_404;
    throw error;
  })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'ID do card inválido' });
      }
      res.status(ERROR_CODE_500).send({ message: 'Erro interno do servidor' });
    });
}

module.exports = { getCards, createCard, deleteCard, LikeCard, DislikeCard };