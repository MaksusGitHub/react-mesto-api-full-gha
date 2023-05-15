const mongoose = require('mongoose');

const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const AccessRightsError = require('../errors/AccessRightsError');
const ValidationError = require('../errors/ValidationError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((allCards) => res.send(allCards.reverse()))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      card.populate(['owner', 'likes'])
        .then(() => res.send({
          likes: card.likes,
          _id: card._id,
          name: card.name,
          link: card.link,
          owner: card.owner,
          createdAt: card.createdAt,
        }))
        .catch(next);
    })
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
        .populate(['owner', 'likes'])
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
    .populate(['owner', 'likes'])
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      createdAt: card.createdAt,
    }))
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
    .populate(['owner', 'likes'])
    .then((card) => res.send({
      likes: card.likes,
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
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
