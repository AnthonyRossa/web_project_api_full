import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import Login from "./Login/Login";
import api from "../utils/api.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import * as auth from "../utils/auth.js";
import { removeToken } from "../utils/token.js";
import Register from "./Register/Register.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [tooltipSuccess, setTooltipSuccess] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [token, setTokenState] = useState(null);
  const navigate = useNavigate();

  const handleRegistration = async ({ email, password }) => {
    auth
      .register(email, password)
      .then(() => {
        setTooltipSuccess(true);
        setTooltipMessage("Vitória! Você agora está registrado.");
        setShowInfoTooltip(true);

        setTimeout(() => {
          setShowInfoTooltip(false);
        }, 3000);

        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      })
      .catch((error) => {
        setTooltipSuccess(false);
        setTooltipMessage("Ops, algo deu errado! Por favor, tente novamente.");
        setShowInfoTooltip(true);

        setTimeout(() => {
          setShowInfoTooltip(false);
        }, 3000);
        console.error(error);
      });
  };

  const closeInfoTooltip = () => {
    setShowInfoTooltip(false);
    setTooltipMessage("");
  };

  const handleLogin = async ({ email, password }) => {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setTokenState(data.token);
          localStorage.setItem("jwt", data.token);
          setIsLoggedIn(true);

          return auth.checkToken(data.token);
        }
      })
      .then((userData) => {
        if (userData) {
          setCurrentUser(userdata);
          return api.getUserInfo();
        }
      })
      .then((fullUserData) => {
        if (fullUserData) {
          setCurrentUser((prevUser) => ({ ...prevUser, ...fullUserData }));
          navigate("/main");
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((data) => {
          setCurrentUser(data);
          setIsLoggedIn(true);
          setTokenState(token);

          return api.getUserInfo();
        })
        .then((fullUserData) => {
          setCurrentUser((prevUser) => ({ ...prevUser, ...fullUserData }));
        })
        .catch((error) => {
          console.error(error);
          removeToken();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser({});
    navigate("/signin");
  };

  const handleUpdateUser = (data) => {
    api
      .setUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateAvatar = (data) => {
    api
      .changeAvatar(data)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const handleAddPlaceSubmit = (data) => {
    api
      .addCard(data)
      .then((newCard) => {
        const cardWithLikeStatus = {
          ...newCard,
          isLiked: newCard.likes.includes(currentUser._id),
        };
        setCards([cardWithLikeStatus, ...cards]);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const [popup, setPopup] = useState(null);

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  const [cards, setCards] = useState([]);

  useEffect(() => {
    api
      .getInitialCards()
      .then((cardsData) => {
        const cardsWithLikeStatus = cardsData.map((card) => ({
          ...card,
          isLiked: card.likes.includes(currentUser._id),
        }));
        setCards(cardsWithLikeStatus);
      })
      .catch((error) => console.log(error));
  }, [currentUser._id]);

  async function handleCardLike(card) {
    const isLiked = card.isLiked;

    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const updatedCard = {
          ...newCard,
          isLiked: newCard.likes.includes(currentUser._id),
        };
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? updatedCard : currentCard,
          ),
        );
      })
      .catch((error) => console.error(error));
  }

  async function handleCardDelete(card) {
    await api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id),
        );
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  }

  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/main" /> : <Navigate to="/signin" />
          }
        />
        <Route
          path="/signin"
          element={
            <div className="page">
              <Header isLoggedIn={false} />
              <Login handleLogin={handleLogin} />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="page">
              <Header isLoggedIn={false} />
              <Register handleRegistration={handleRegistration} />
            </div>
          }
        />
        <Route
          path="/main"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="page">
                <Header
                  isLoggedIn={isLoggedIn}
                  userEmail={currentUser.email}
                  onLogout={handleLogout}
                />
                <Main
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <InfoTooltip
        isOpen={showInfoTooltip}
        onClose={closeInfoTooltip}
        isSuccess={tooltipSuccess}
        message={tooltipMessage}
      />
    </CurrentUserContext.Provider>
  );
}
