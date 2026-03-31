module.exports =  (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  if (err.name === 'MongooseValidationError') {
    statusCode = 400;
    message = 'Dados inválidos';
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ocorreu um erro no servidor'
        : message
    });
};