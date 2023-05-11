import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const { card, onCardClick, onCardLike, onCardDelete } = props;

  const currentUser = useContext(CurrentUserContext);
  
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  const cardLikeButtonClassName = (`card__like ${isLiked && 'card__like_active'}`);

  function handlePictureClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick()
  {
    onCardDelete(card);
  }

  return (
    <article className="card">
      {isOwn && <button className="card__trash" type="button" aria-label="Удалить" onClick={handleDeleteClick} />} 
      <img className="card__picture" src={card.link} onClick={handlePictureClick} alt={card.name} />
      <div className="card__info">
        <h2 className="card__name">{card.name}</h2>
        <div className="card__like-container">
          <button className={cardLikeButtonClassName} type="button" aria-label="Нравится" onClick={handleLikeClick}></button>
          <span className="card__likes-amount">{card.likes.length}</span>
        </div>
      </div>
    </article>
  )
}

export default Card;