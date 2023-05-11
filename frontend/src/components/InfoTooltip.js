import authSuccess from '../images/auth-success.svg';
import authFail from '../images/auth-fail.svg';

const InfoTooltip = ({ isSuccess, isOpen, onClose}) => {
  return (
    <div className={isOpen ? `popup popup_auth-info popup_opened` : `popup popup_auth-info`}>
      <div className="popup__auth-info-container">
        <button className="popup__exit-button" type="button" onClick={onClose} aria-label="Закрыть"></button>
        <img
          className="popup__auth-status-picture"
          src={isSuccess ? authSuccess : authFail}
          alt={isSuccess ? "Успех" : "Неудача"}
        />
        <p className="popup__auth-status">
          {isSuccess ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз." }
        </p>
      </div>
    </div>
  )
}

export default InfoTooltip;