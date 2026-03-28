import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./../../contexts/CurrentUserContext.js";

function ProtectedRoute({ children, anonymous = false }) {
  const { isLoggedIn } = useContext(UserContext);

  if (anonymous && isLoggedIn) {
    return <Navigate to="/main" />;
  }
  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/signin" />;
  }
  return children;
}

export default ProtectedRoute;
