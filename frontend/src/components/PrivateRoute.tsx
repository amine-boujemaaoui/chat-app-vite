import { Navigate } from "react-router-dom";

// Composant pour vérifier si l'utilisateur est authentifié
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("jwt");

  // Si l'utilisateur n'a pas de JWT, rediriger vers /login
  if (!token) {
    return <Navigate to='/login' />;
  }

  return children;
};

export default PrivateRoute;
