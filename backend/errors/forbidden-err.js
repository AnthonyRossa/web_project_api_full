class ForbiddenError extends Error {
  constructor(message = 'Acesso negado') {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
