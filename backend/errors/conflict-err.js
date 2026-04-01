const { ERROR_CODE_409 } = require('../utils/errorCodes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_409;
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
