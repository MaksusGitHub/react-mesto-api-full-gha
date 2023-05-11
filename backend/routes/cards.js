const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { URL_REG } = require('../constants/constants');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REG),
  }),
}), createCard);
cardsRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
}), deleteCardById);
cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), likeCard);
cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardsRouter;
