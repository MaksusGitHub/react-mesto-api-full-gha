const mongoose = require('mongoose');

const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const AccessRightsError = require('../errors/AccessRightsError');
const ValidationError = require('../errors/ValidationError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('likes')
    .then((allCards) => res.send(allCards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError || mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат входных данных'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.id).orFail(new NotFoundError())
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        throw new AccessRightsError();
      }
      Card.findByIdAndRemove(req.params.id)
        .populate('likes')
        .then((deletedCard) => {
          if (!deletedCard) {
            throw new NotFoundError();
          }
          res.send(deletedCard);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(new NotFoundError('Карточки с таким ID нет'));
      } else if (err instanceof AccessRightsError) {
        next(new AccessRightsError('Нет доступа к этой карточке'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError())
    .populate('likes')
    .then((card) => res.send(card))
    .catch((err) => {
      if (res.headersSent) {
        next(err);
      }
      if (err instanceof NotFoundError) {
        next(new NotFoundError('Карточки с таким ID нет'));
      } else if (err instanceof mongoose.Error.ValidationError || mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат входных данных'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError())
    .populate('likes')
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(new NotFoundError('Карточки с таким ID нет'));
      } else if (err instanceof mongoose.Error.ValidationError || mongoose.Error.CastError) {
        next(new ValidationError('Некорректный формат входных данных'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
