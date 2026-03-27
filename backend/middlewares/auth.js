const Jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { ERROR_CODE_401 } = require('../utils/constants');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(ERROR_CODE_401).send({ message: 'Token Inválido' });
  }

  try {
    const payload = Jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(ERROR_CODE_401).send({ message: 'Token Inválido' });
  }
};

module.exports = auth;