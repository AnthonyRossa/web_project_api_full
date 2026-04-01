const { ERROR_CODE_400 } = require('../utils/errorCodes');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_400;
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
