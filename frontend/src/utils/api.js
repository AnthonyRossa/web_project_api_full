import { BASE_URL } from "./url";
import { getToken } from "./token";

class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Error: ${res.status}`);
  }

  _makeRequest(endpoint, options = {}) {
    const token = getToken();
    if (!token) {
      return Promise.reject("No token found");
    }
    return fetch(`${this._baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
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
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    });
  }

  addCard(cardData) {
    return this._makeRequest("/cards", {
      method: "POST",
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._makeRequest(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  likeCard(cardId) {
    return this._makeRequest(`/cards/${cardId}/likes`, {
      method: "PUT",
    });
  }

  unlikeCard(cardId) {
    return this._makeRequest(`/cards/${cardId}/likes`, {
      method: "DELETE",
    });
  }

  changeAvatar(avatarData) {
    return this._makeRequest("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({
        avatar: avatarData.avatar,
      }),
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._makeRequest(`/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
    });
  }
}

const api = new Api({
  baseUrl: BASE_URL,
});

export default api;
