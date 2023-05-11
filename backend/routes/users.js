const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const { URL_REG } = require('../constants/constants');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getProfile);
usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
}), getUserById);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL_REG),
  }),
}), updateAvatar);

module.exports = usersRouter;
