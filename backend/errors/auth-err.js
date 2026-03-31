class AuthError extends Error {
  constructor(message = 'Autenticação necessária') {
    super(message);
    this.statusCode = 401;
    this.name = 'AuthError';
  }
}

module.exports = AuthError;
