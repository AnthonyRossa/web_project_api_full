const Card = require('../models/card');
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require('../utils/constants');

const getCards = (req, res) => {
  Card.find()
  .orFail(() => {
    const error = new Error('Cards não encontrados');
    error.statusCode = ERROR_CODE_404;
    throw error;
  })
    .then(cards => res.send(cards))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Dados do card inválidos' });
      }
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
  Card.findByIdAndDelete(cardId)
  .orFail(() => {
    const error = new Error('Card não encontrado');
    error.statusCode = ERROR_CODE_404;
    throw error;
  })
    .then(card => {
      if (!card) {
        return res.status(ERROR_CODE_404).send({message: 'Card não encontrado'});
      }
      res.send({message: 'Card deletado com sucesso'});
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