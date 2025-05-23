import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiWrapper from "../api";
const { api, secondApi } = apiWrapper;
import "./Home.css";
import { REFREST_TOKEN } from "../constants"; 
import Mealplanner from "./Mealplanner";

function Home() {
  const [ingredients, setIngredients] = useState("");
  const [sliderValue, setSliderValue] = useState(3);
  const [recipes, setRecipes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [iframeUrl, setIframeUrl] = useState("");
  const [showIframe, setShowIframe] = useState(false);

  const ingredientPool = [
    "egg", "chicken", "fish", "beef", "lamb",
    "tomato", "onion", "garlic", "potato", "carrot",
    "broccoli", "spinach", "pepper", "cheese", "mushroom"
  ];

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleSearch = async () => {
    const ing = ingredients.split(",").slice(0, sliderValue).join(",");
    try {
      const { data } = await secondApi.get("/recipes/findByIngredients", {
        params: {
          ingredients: ing,
          number: sliderValue
        }
      });
      setRecipes(data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleRandomRecipe = async () => {
    const shuffled = [...ingredientPool].sort(() => 0.5 - Math.random());
    const randomIngredients = shuffled.slice(0, 10);
    const ing = randomIngredients.join(",");

    try {
      const { data } = await secondApi.get("/recipes/findByIngredients", {
        params: {
          ingredients: ing,
          number: 5
        }
      });
      setRecipes(data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching random recipes:", error);
    }
  };

  const addToFavorites = async (recipe) => {
    const token = localStorage.getItem(REFREST_TOKEN);
    const decoded = parseJwt(token);

    try {
      await api.post("/api/favorites/", {
        title: recipe.title,
        owner: decoded.user_id,
        food_id: recipe.id
      });
      fetchFavorites();
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const fetchFavorites = async () => {
    const token = localStorage.getItem(REFREST_TOKEN);
    const decoded = parseJwt(token);

    try {
      const { data } = await api.get("/api/favorites/");
      const userFavorites = data.filter(fav => fav.owner === decoded.user_id);
      setFavorites(userFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const deleteFavorite = async (id) => {
    try {
      await api.delete(`/api/favorite/delete/${id}/`);
      fetchFavorites();
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  const handleShowRecipePage = async (food_id) => {
    try {
      const { data } = await secondApi.get(`/recipes/${food_id}/information`, {
        params: { includeNutrition: false }
      });
      setIframeUrl(data.spoonacularSourceUrl);
      setShowIframe(true);
    } catch (error) {
      console.error("Error loading recipe info:", error);
    }
  };

  const closeIframe = () => {
    setShowIframe(false);
    setIframeUrl("");
  };

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

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home-container">
      <div className="navigation-bar">
        <Navbar />
      </div>

      <div className="recipe-search-container">
        <div className="recipe-search">
          <input
            type="text"
            placeholder="Enter ingredients (e.g., tomato, onion)"
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            className="ingredient-input"
            aria-label="Ingredient input"
          />
          <div className="slider-container">
            <label htmlFor="recipe-count-slider">Number of Recipes: {sliderValue}</label>
            <input
              id="recipe-count-slider"
              type="range"
              min="1"
              max="5"
              value={sliderValue}
              onChange={e => setSliderValue(parseInt(e.target.value, 10))}
              className="slider-input"
              aria-label="Number of recipes"
            />
          </div>
          <button onClick={handleSearch} className="search-button">Search Recipes</button>
        </div>
      </div>

      <div className="random-recipe">
        <button onClick={handleRandomRecipe} className="random-button">Get Random Recipe</button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={closePopup} className="close-button" aria-label="Close popup">×</button>
            {recipes.length > 0 ? (
              <div className="recipe-list">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="recipe-item">
                    <h2>{recipe.title}</h2>
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                    <p>Missing Ingredients: {recipe.missedIngredients.map(i => i.name).join(', ')}</p>
                    <button
                      onClick={() => addToFavorites(recipe)}
                      className="favorites-button"
                      aria-label={`Add ${recipe.title} to favorites`}
                    >
                      Add to Favorites
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recipes found.</p>
            )}
          </div>
        </div>
      )}

      <div className="favorite-table-container">
        {favorites.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Recipe Title</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map(fav => (
                <tr key={fav.id}>
                  <td>{fav.title}</td>
                  <td className="table-actions">
                    <button
                      onClick={() => deleteFavorite(fav.id)}
                      className="favorites-button delete-button"
                      aria-label={`Delete ${fav.title} from favorites`}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleShowRecipePage(fav.food_id)}
                      className="favorites-button view-button"
                      aria-label={`View ${fav.title} recipe`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-favorites">No favorite recipes yet.</p>
        )}
      </div>

      {showIframe && (
        <div className="iframe-modal-overlay">
          <div className="iframe-modal-content">
            <button
              onClick={closeIframe}
              className="iframe-close-button"
              aria-label="Close recipe view"
            >
              ×
            </button>
            <iframe
              src={iframeUrl}
              title="Recipe Detail"
              className="iframe-content"
            />
          </div>
        </div>
      )}

      <div className="meal-planner-container">
        <Mealplanner />
      </div>
    </div>
  );
}

export default Home;