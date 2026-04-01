const { ERROR_CODE_401 } = require('../utils/errorCodes');

class AuthError extends Error {
  constructor(message = 'Autenticação necessária') {
    super(message);
    this.statusCode = ERROR_CODE_401;
    this.name = 'AuthError';
  }
}

module.exports = AuthError;
