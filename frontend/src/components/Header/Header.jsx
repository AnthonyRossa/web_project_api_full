import logo from "../../images/logo.svg";
import { Link, useLocation } from "react-router-dom";

export default function Header({ isLoggedIn, userEmail, onLogout }) {
  const location = useLocation();

  const getNavContent = () => {
    if (isLoggedIn) {
      return (
        <div className="header__nav">
          <span className="header__email">
            {userEmail || "Email não encontrado"}
          </span>
          <button className="header__logout" onClick={onLogout}>
            Sair
          </button>
        </div>
      );
    }
    if (location.pathname === "/signin") {
      return (
        <nav className="header__nav">
          <Link className="header__register" to="/signup">
            Inscrever-se
          </Link>
        </nav>
      );
    }

    if (location.pathname === "/signup") {
      return (
        <nav className="header__nav">
          <Link className="header__register" to="/signin">
            Entrar
          </Link>
        </nav>
      );
    }
    return null;
  };

  return (
    <header className="header page__section">
      <img
        src={logo}
        alt="Around the U.S. logo"
        className="logo header__logo"
      />
      {getNavContent()}
    </header>
  );
}
