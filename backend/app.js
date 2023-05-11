require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');
const { URL_REG } = require('./constants/constants');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000, DB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REG),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorHandler);

app.listen(PORT, () => {});
