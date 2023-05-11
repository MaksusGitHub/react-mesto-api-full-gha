function PopupWithForm(props) {
  return (
    <div className={props.isOpen ? `popup popup_${props.name} popup_opened` : `popup popup_${props.name}`}>
      <div className="popup__container">
        <button className="popup__exit-button" type="button" onClick={props.onClose} aria-label="Закрыть"></button>
        <h2 className="popup__title">{props.title}</h2>
        <form className="popup__form" name={`${props.name}-form`} onSubmit={props.onSubmit} noValidate>
          {props.children}
          <button className="popup__button" type="submit">{props.btnName}</button>
        </form>  
      </div>
    </div>
  )
}

export default PopupWithForm;