import { useState } from "react";
import apiWrapper from "../api";  
const { api, secondApi } = apiWrapper;
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFREST_TOKEN } from "../constants"; 
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const parseJwt = (token) => {
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
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post(route, { username, password });
  
      if (method === "login") {
        // Store tokens in localStorage
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFREST_TOKEN, res.data.refresh); // Storing REFREST_TOKEN as designed
  
        // Decode the REFREST_TOKEN and log user activity
        const decoded = parseJwt(res.data.refresh);
  
        if (decoded) {
          console.log("Decoded user:", decoded);  // Log decoded data to verify user_id
          await api.post(
            "/api/history/",
            {
              user: decoded.user_id,
              activity: "User Logged in",
            },
            {
              headers: {
                Authorization: `Bearer ${res.data.access}`,  // Make sure to include the token
              },
            }
          );
        }
        
  
        navigate("/");
  
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Loading..." : name}
      </button>
    </form>
  );
}

export default Form;
