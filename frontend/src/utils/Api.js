class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
  }

  _checkStatus(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getProfileInfo() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers
    })
      .then((res) => this._checkStatus(res))
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers
    })
      .then((res) => this._checkStatus(res))
  }

  editProfileInfo(profileInfo) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: profileInfo.name,
        about: profileInfo.about,
      })
    })
      .then((res) => this._checkStatus(res))
  }

  updateProfileAvatar(avatar) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({ avatar: avatar })
    })
      .then((res) => this._checkStatus(res))
  }

  addNewCard(card) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: card.name,
        link: card.link,
      })
    })
      .then((res) => this._checkStatus(res))
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then((res) => this._checkStatus(res))
  }

  _addLikeToCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this._headers,
    })
      .then((res) => this._checkStatus(res))
  }

  _deleteLikeFromCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then((res) => this._checkStatus(res))
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this._deleteLikeFromCard(cardId);
    } else {
      return this._addLikeToCard(cardId);
    }
  }
}

export const api = new Api({
  // url: 'http://localhost:3001',
  // url: 'https://mesto.nomoreparties.co/v1/cohort-58',
  url: 'https://api.maksus.mesto.nomoredomains.monster',
  headers: {
    'Content-Type': 'application/json',
    // authorization: '0844abcf-88c6-4c3b-b660-82dd4df42446'
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    // 'Origin': 'http://localhost:3000'
    'Origin': 'https://maksus.mesto.nomoredomains.monster'
    // authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDRhYjIxN2FhYjNlZGU0ZjMxMjhmYzYiLCJpYXQiOjE2ODI2NjQ5NDgsImV4cCI6MTY4MzI2OTc0OH0.nI2MNQ_PHQrfF_DzFCx5eKXad1LhE24BZQ7ac1cn4rM'
  }
}); 

export default api;