const express = require('express');
const mongoose = require('mongoose');
const {PORT = 3000} = process.env;
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cors = require('cors');
const app = express();
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/not-found-err');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(requestLogger);

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(function(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;

  const allowedCords = [
  'https://tripleten.tk',
  'http://tripleten.tk',
  'https://arttatu.chickenkiller.com',
  'http://arttatu.chickenkiller.com',
  'localhost:3000',
  'localhost:3001'
  ];

  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

  if(allowedCords.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);

    const requestHeaders = req.header['access-control-request-headers'];
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  next();
});

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});


app.post('/signin', login);
app.post('/signup', createUser);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('A solicitação não foi encontrada'));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});