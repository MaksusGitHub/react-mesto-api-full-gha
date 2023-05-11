import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const { isOpen, onClose, onAddPlace } = props;

  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]);

  function handleName(e) {
    setName(e.target.value);
  }

  function handleLink(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name: name,
      link: link
    });
  }

  return (
    <PopupWithForm title="Новое место" name="add-card" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} btnName="Создать">
      <fieldset className="popup__fieldset">
        <label className="popup__field">
          <input
            value={name || ''}
            onChange={handleName}
            id="place-input"
            className="popup__input popup__input_type_name"
            type="text"
            name="placeName"
            placeholder="Название"
            minLength="2"
            maxLength="30"
            required
          />
          <span className="place-input-error popup__error"></span>
        </label>
        <label className="popup__field">
          <input
            value={link || ''}
            onChange={handleLink}
            id="url-input"
            className="popup__input popup__input_type_src"
            type="url"
            name="placeLink"
            placeholder="Ссылка на картинку"
            required
          />
          <span className="url-input-error popup__error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default AddPlacePopup;