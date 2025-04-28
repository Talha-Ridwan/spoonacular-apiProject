import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History";
import apiWrapper from "./api";  
const { api, secondApi } = apiWrapper;

import { useEffect } from "react";

export function parseJwt (token) {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

function Logout() {
  useEffect(() => {
    async function doLogout() {
      const token = localStorage.getItem('access');
      const decoded = parseJwt(token);
      
      if (decoded) {
        await api.post("/api/history/", {
          user: decoded.user_id,  
          activity: "User Logged out"
        });
      }

      localStorage.clear();
    }

    doLogout();
  }, []);

  return <Navigate to="/login" />;
}




function RegisterAndLogout(){
	localStorage.clear()
	return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
        <Route path = "/history" element = {<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
