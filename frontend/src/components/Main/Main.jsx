import { useEffect, useState, useContext } from "react";
import pencil from "../../images/pencil.svg";
import addicon from "../../images/addicon.svg";
import Popup from "../Popup/Popup";
import NewCard from "../NewCard/NewCard";
import EditProfile from "../EditProfile/EditProfile";
import EditAvatar from "../EditAvatar/EditAvatar";
import Card from "./components/Card/Card";
import ImagePopup from "../ImagePopup/ImagePopup";
import RemoveCard from "../RemoveCard/RemoveCard.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function Main({
  onOpenPopup,
  onClosePopup,
  popup,
  cards,
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup = { title: "Novo Post", children: <NewCard /> };
  const editProfilePopup = {
    title: "Editar Perfil",
    children: <EditProfile />,
  };
  const editAvatarPopup = { title: "Editar Avatar", children: <EditAvatar /> };

  function onCardDeletePopup(deleteComponent) {
    const deletePopup = {
      title: "Você tem certeza?",
      children: (
        <RemoveCard
          deleteComponent={deleteComponent}
          onCardDelete={onCardDelete}
        />
      ),
    };
    onOpenPopup(deletePopup);
  }

  function handleOpenImagePopup(imageComponent) {
    const imagePopup = {
      title: null,
      children: <ImagePopup imageComponent={imageComponent} />,
    };
    onOpenPopup(imagePopup);
  }

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__image-container">
          <img
            src={currentUser.avatar}
            alt="Imagem de Perfil"
            className="avatar profile__image"
          />
          <button
            className="profile__image-edit-button"
            type="button"
            aria-label="Edit Avatar"
            onClick={() => onOpenPopup(editAvatarPopup)}
          ></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            className="profile__edit-button"
            type="button"
            aria-label="Edit Profile"
            onClick={() => onOpenPopup(editProfilePopup)}
          >
            <img
              src={pencil}
              alt="icone de edição"
              className="profile__edit-icon"
            />
          </button>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="Add Card"
          onClick={() => onOpenPopup(newCardPopup)}
        >
          <img className="profile__add-icon" alt="icone +" src={addicon} />
        </button>
      </section>
      <section className="cards">
        <ul className="cards__list">
          {cards.map((card) => (
            <Card
              key={card._id || Math.random()}
              card={card}
              handleOpenPopup={handleOpenImagePopup}
              onCardLike={() => onCardLike(card)}
              onCardDeletePopup={onCardDeletePopup}
            />
          ))}
        </ul>
      </section>
      {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
