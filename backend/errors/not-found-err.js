const { ERROR_CODE_404 } = require('../utils/errorCodes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_404;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;