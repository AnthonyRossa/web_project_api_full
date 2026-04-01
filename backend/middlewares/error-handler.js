const { ERROR_CODE_400, ERROR_CODE_401, ERROR_CODE_500 } = require('../utils/errorCodes');

module.exports =  (err, req, res, next) => {
  let { statusCode = ERROR_CODE_500, message } = err;

  if (err.name === 'CastError') {
    statusCode = ERROR_CODE_400;
    message = 'ID inválido';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = ERROR_CODE_401;
    message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = ERROR_CODE_401;
    message = 'Token expirado';
  }

  if (err.name === 'MongooseValidationError') {
    statusCode = ERROR_CODE_400;
    message = 'Dados inválidos';
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_CODE_500
        ? 'Ocorreu um erro no servidor'
        : message
    });
};