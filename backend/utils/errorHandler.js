const handleCardError = (err, next) => {
  if (err.name === 'CastError') {
    return next(new ValidationError('ID do card inválido'));
  }
  next(err);
};

module.exports = { handleCardError };