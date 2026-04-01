const Jwt = require('jsonwebtoken');
const { ERROR_CODE_401 } = require('../utils/errorCodes');

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(ERROR_CODE_401).send({ message: 'Token Inválido' });
    }

    const token = authorization.replace('Bearer ', '');

    try {
        const payload = Jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(ERROR_CODE_401).send({ message: 'Token Inválido' });
    }
};

module.exports = auth;