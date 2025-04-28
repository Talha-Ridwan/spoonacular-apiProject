import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './Navbar.css'; 
function Navbar() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Spoonacular API</Link>
      </div>

      <div className="navbar-actions">
        <button
          onClick={toggleDarkMode}
          className="dark-mode-toggle"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
        <button
          className="history-button"
          onClick={() => navigate("/history")}
        >
          History
        </button>
        <button
          className="logout-button"
          onClick={() => navigate("/logout")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
