import { useRef, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function EditAvatar() {
  const avatarRef = useRef();
  const { handleUpdateAvatar } = useContext(CurrentUserContext);

  function handleSubmit(e) {
    e.preventDefault();

    handleUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <form
      className="popup__form"
      name="change-avatar-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          id="avatar-link"
          type="url"
          name="avatar"
          className="popup__input"
          placeholder="Link da imagem de perfil"
          required
          ref={avatarRef}
        />
        <span className="avatar-link-error popup__input-error"></span>
      </label>
      <button type="submit" className="popup__button">
        Salvar
      </button>
    </form>
  );
}
