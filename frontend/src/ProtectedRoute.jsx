import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  console.log(
    "ProtectedRoute - isLoggedIn:",
    isLoggedIn
  );

  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;
}

export default ProtectedRoute;