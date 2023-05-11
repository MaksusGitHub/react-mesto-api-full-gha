function ImagePopup({isOpen, card, onClose}) {
  return (
    <div className={isOpen ? `popup popup_image popup_opened` : `popup popup_image`}>
      <div className="popup__image-container">
        <button className="popup__exit-button" type="button" onClick={onClose} aria-label="Закрыть"></button>
        <img className="popup__picture" src={card.link} alt={card.name}/>
        <p className="popup__caption">{card.name}</p>
      </div>
    </div>
  )
}

export default ImagePopup;