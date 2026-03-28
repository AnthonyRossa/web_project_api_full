class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Error: ${res.status}`);
  }

  _makeRequest(endpoint, options = {}) {
    return fetch(`${this._baseUrl}${endpoint}`, {
      headers: this._headers,
      ...options,
    }).then(this._checkResponse);
  }

  getUserInfo() {
    return this._makeRequest("/users/me");
  }

  getInitialCards() {
    return this._makeRequest("/cards");
  }

  setUserInfo(userData) {
    return this._makeRequest("/users/me", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    });
  }

  addCard(cardData) {
    return this._makeRequest("/cards", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._makeRequest(`/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  likeCard(cardId) {
    return this._makeRequest(`cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
  }

  unlikeCard(cardId) {
    return this._makeRequest(`/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  changeAvatar(avatarData) {
    return this._makeRequest("/users/me/avatar", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatarData.avatar,
      }),
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._makeRequest(`/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._headers,
    });
  }
}

const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  headers: {
    authorization: "25e44c37-6a52-4a3b-872e-f535279302d8",
    "Content-Type": "application/json",
  },
});

export default api;
