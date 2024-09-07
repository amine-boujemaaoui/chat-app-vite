import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Redirection par défaut vers /login */}
          <Route path='/' element={<Navigate to='/login' />} />

          {/* Route pour la page de connexion */}
          <Route path='/login' element={<Login />} />

          {/* Route pour la page d'inscription */}
          <Route path='/register' element={<Register />} />

          {/* Route privée pour le chat */}
          <Route
            path='/chat'
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

          {/* Si l'URL ne correspond à aucune route, rediriger vers /login */}
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
