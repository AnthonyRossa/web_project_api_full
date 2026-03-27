const express = require('express');
const mongoose = require('mongoose');
const {PORT = 3000} = process.env;
const { login, createUser } = require('./controllers/users');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(function(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;

  const allowedCords = [
  'https://tripleten.tk',
  'http://tripleten.tk',
  'localhost:3000'
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

app.use((req, res, next) => {
  req.user = {
    _id: '698668e87914d868800976af'
  };

  next();
});

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});


app.post('/signin', login);
app.post('/signup', createUser);


app.use((req, res) => {
  res.status(404).json({ message: 'A solicitação não foi encontrada'});
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'Ocorreu um erro no servidor' : message
  });
});

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});