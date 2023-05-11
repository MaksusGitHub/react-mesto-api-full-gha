const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');

const {
  NODE_ENV = 'production',
  JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b',
} = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((allUsers) => res.send(allUsers))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id).orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(new NotFoundError('Пользователя с таким ID нет'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err instanceof mongoose.Error.ValidationError || mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат входных данных'));
      } else {
        next(err);
      }
    });
};

const getProfile = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner).orFail(new NotFoundError())
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.NotFoundError) {
        next(new NotFoundError('Пользователя с таким ID нет'));
      } else if (err instanceof mongoose.Error.ValidationError || mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат входных данных'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFoundError())
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.NotFoundError) {
        next(new NotFoundError('Пользователя с таким ID нет'));
      } else if (err instanceof mongoose.Error.ValidationError || mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат входных данных'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFoundError())
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.NotFoundError) {
        next(new NotFoundError('Пользователя с таким ID нет'));
      } else if (err instanceof mongoose.Error.ValidationError || mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат входных данных'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      })
        .send({ token });
    })
    .catch((err) => {
      if (err instanceof AuthError) {
        next(new AuthError('Неправильные почта или пароль'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateAvatar,
  login,
};
