const { ERROR_CODE_403 } = require('../utils/errorCodes');

class ForbiddenError extends Error {
  constructor(message = 'Acesso negado') {
    super(message);
    this.statusCode = ERROR_CODE_403;
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
