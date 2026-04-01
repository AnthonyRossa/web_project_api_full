require('dotenv').config();
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
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const allowedOrigins = [
  'https://tripleten.tk',
  'http://tripleten.tk',
  'https://arttatu.chickenkiller.com',
  'http://arttatu.chickenkiller.com',
  'https://localhost:3000',
  'http://localhost:3001'
  ];

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use(express.json());
app.use(cors({ origin: allowedOrigins }));
app.use(requestLogger);

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