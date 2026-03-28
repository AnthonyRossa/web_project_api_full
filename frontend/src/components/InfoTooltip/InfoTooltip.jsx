import successIcon from "../../images/success-icon.svg";
import errorIcon from "../../images/error-icon.svg";

export default function InfoTooltip({ isOpen, onClose, isSuccess, message }) {
  if (!isOpen || !message) {
    return null;
  }

  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container popup__container_type_tooltip">
        <button
          className="popup__close"
          type="button"
          onClick={onClose}
        ></button>
        <img
          className="popup__icon"
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? "Sucesso" : "Erro"}
        />
        <p className="popup__message">{message}</p>
      </div>
    </div>
  );
}
