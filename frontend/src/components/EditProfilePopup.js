import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup(props) {
  const { isOpen, onClose, onUpdateUser } = props;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleName(e) {
    setName(e.target.value);
  }
  function handleDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm title="Редактировать профиль" name="profile-edit" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} btnName="Сохранить">
      <fieldset className="popup__fieldset">
        <label className="popup__field">
          <input
            id="name-input"
            name="profileName"
            className="popup__input popup__input_type_name"
            type="text"
            value={name || ''}
            onChange={handleName}
            placeholder="Имя"
            minLength="2"
            maxLength="40"
            required
          />
          <span className="name-input-error popup__error"></span>
        </label>
        <label className="popup__field">
          <input
            id="status-input"
            name="profileStatus"
            className="popup__input popup__input_type_status"
            type="text"
            value={description || ''}
            onChange={handleDescription}
            placeholder="Статус"
            minLength="2"
            maxLength="200"
            required
          />
          <span className="status-input-error popup__error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default EditProfilePopup;