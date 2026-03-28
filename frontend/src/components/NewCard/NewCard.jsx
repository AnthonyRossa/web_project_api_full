import { useRef, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function NewCard() {
  const nameRef = useRef();
  const linkRef = useRef();
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);

  function handleSubmit(e) {
    e.preventDefault();

    handleAddPlaceSubmit({
      name: nameRef.current.value,
      link: linkRef.current.value,
    });
  }

  return (
    <form
      className="popup__form"
      name="add-card-form"
      id="new-card-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_card_name"
          id="card-name"
          maxLength="30"
          minLength="2"
          name="card-name"
          placeholder="Título"
          required
          type="text"
          ref={nameRef}
        />
        <span className="popup__input-error" id="card-name-error"></span>
      </label>
      <label className="popup__field">
        <input
          id="card-link"
          type="url"
          name="link"
          className="popup__input popup__input_type_url"
          placeholder="Link da imagem"
          required
          ref={linkRef}
        />
        <span className="popup__input-error" id="card-link-error"></span>
      </label>
      <button type="submit" className="button popup__button">
        Criar
      </button>
    </form>
  );
}
