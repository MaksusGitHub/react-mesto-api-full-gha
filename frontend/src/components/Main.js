import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Card from "./Card";
import Footer from "./Footer";

function Main(props) {
  const {
    cards,
    onEditAvatar,
    onEditProfile,
    onAddPlace,
    onCardClick,
    onCardLike,
    onCardDelete,
  } = props;
  
  const currentUser = useContext(CurrentUserContext);

  return (
    <>
      <main className="container root__content">
        <section className="profile">
          <div className="profile__container">
            <img className="profile__avatar" src={currentUser.avatar} alt="Аватар"/>
            <button className="profile__avatar-button" onClick={onEditAvatar} type="button" aria-label="Редактировать"></button>
          </div>
          <div className="profile__info">
              <div className="profile__heading">
              <h1 className="profile__name">{currentUser.name}</h1>
                <button className="profile__edit-button" onClick={onEditProfile} type="button" aria-label="Редактировать"></button>
              </div>
            <p className="profile__status">{currentUser.about}</p>
          </div>
          <button className="profile__add-button" onClick={onAddPlace} type="button" aria-label="Добавить"></button>
        </section>
        <section className="cards" aria-label="Карточки мест">
          {
            cards.map((card) => {
              return <Card
                key={card._id}
                card={card}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
              />
            })
          }
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Main;