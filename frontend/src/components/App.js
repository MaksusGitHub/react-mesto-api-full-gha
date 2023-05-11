import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Header from "./Header";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import api from "../utils/Api";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import { getContent } from '../utils/Auth';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [cards, setCards] = useState([]);
  const [isAuthResultPopupOpen, setIsAuthResultPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    tokenCheck();
  }, [])

  useEffect(() => {
    api.getProfileInfo().then((profile) => {
      setCurrentUser(profile);
    })
      .catch((err) => {
        console.log(err);
    })
  }, [])

  useEffect(() => {
    api.getInitialCards().then((cards) => {
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      getContent(jwt).then((res) => {
        if (res) {
          setLoggedIn(true);
          navigate('/', { replace: true });
          setEmail(res.data.email);
        }
      });
    }
  }

  const handleLogin = (email) => {
    setLoggedIn(true);
    setEmail(email);
  }

  const handleAuthResultPopupOpen = () => {
    setIsAuthResultPopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsAuthResultPopupOpen(false);
  }

  function handleUpdateProfile(user) {
    api.editProfileInfo(user).then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleUpdateAvatar({ avatar }) {
    api.updateProfileAvatar(avatar).then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleAddPlaceSubmit(card) {
    api.addNewCard(card).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className="root">
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={email} />
        <Routes>
          <Route
            path="/signup"
            element={
              <Register
                setIsAuthSuccess={setIsAuthSuccess}
                handleAuthResultPopupOpen={handleAuthResultPopupOpen}
              />
            }
          />
          <Route
            path="/signin"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                component={Main}
                cards={cards}
                setCards={setCards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                loggedIn={loggedIn}
              />
            }
          />
        </Routes>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateProfile}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <PopupWithForm title="Вы уверены?" name="card-delete" onClose={closeAllPopups} btnName="Да"/>
        <ImagePopup card={selectedCard} isOpen={isImagePopupOpen} onClose={closeAllPopups} />
        <InfoTooltip
          isSuccess={isAuthSuccess}
          isOpen={isAuthResultPopupOpen}
          onClose={closeAllPopups}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
