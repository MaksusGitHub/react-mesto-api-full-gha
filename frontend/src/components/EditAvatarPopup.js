import { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const { isOpen, onClose, onUpdateAvatar } = props;

  const urlRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({ avatar: urlRef.current.value });
  }

  return (
    <PopupWithForm title="Обновить аватар" name="avatar-edit" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} btnName="Сохранить">
      <fieldset className="popup__fieldset">
        <label className="popup__field">
          <input
            ref={urlRef}
            id="url-input-avatar"
            className="popup__input popup__input_type_src"
            type="url"
            name="avatarLink"
            placeholder="Ссылка на аватар"
            required
          />
          <span className="url-input-avatar-error popup__error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;