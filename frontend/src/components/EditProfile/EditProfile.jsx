import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState(currentUser?.name || "");
  const [description, setDescription] = useState(currentUser?.about || "");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setDescription(currentUser.about || "");
    }
  }, [currentUser]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateUser({ name, about: description });
  };

  return (
    <form
      className="popup__form"
      name="edit-profile-form"
      noValidate
      id="edit-profile-form"
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          id="profile-name"
          type="text"
          name="name"
          className="popup__input"
          placeholder="Nome"
          required
          minLength="2"
          maxLength="40"
          value={name}
          onChange={handleNameChange}
        />
        <span className="popup__input-error profile-name-error"></span>
      </label>
      <label className="popup__field">
        <input
          id="profile-about"
          type="text"
          name="about"
          className="popup__input"
          placeholder="Sobre mim"
          required
          minLength="2"
          maxLength="200"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span className="popup__input-error profile-about-error"></span>
      </label>
      <button type="submit" className="popup__button">
        Salvar
      </button>
    </form>
  );
}
