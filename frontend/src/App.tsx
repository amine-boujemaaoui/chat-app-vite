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
import PrivateChat from "./pages/PrivateChat";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='/chat'
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route path='*' element={<Navigate to='/login' />} />
          <Route
            path='/private-chat/:friendId'
            element={
              <PrivateRoute>
                <PrivateChat />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
