module.exports = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dados inválidos';
  }

  // Handle MongoDB cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ocorreu um erro no servidor'
        : message
    });
};