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
        const randomIngredients = [];
        const shuffled = [...ingredientPool].sort(() => 0.5 - Math.random());

        for (let i = 0; i < 10; i++) {
            randomIngredients.push(shuffled[i]);
        }

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
                owner: decoded.user_id
            });
            fetchFavorites(); // Refresh favorites after adding
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
            fetchFavorites(); // Refresh favorites after deleting
        } catch (error) {
            console.error("Error deleting favorite:", error);
        }
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
                        placeholder="Enter ingredients separated by commas"
                        value={ingredients}
                        onChange={e => setIngredients(e.target.value)}
                        className="ingredient-input"
                    />
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={sliderValue}
                        onChange={e => setSliderValue(parseInt(e.target.value, 10))}
                        className="slider-input"
                    />
                    <button onClick={handleSearch} className="search-button">Search Recipes</button>
                </div>
            </div>

            <div className="random-recipe">
                <button onClick={handleRandomRecipe} className="random-button">Get Random Recipe</button>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button onClick={closePopup} className="close-button">X</button>
                        {recipes.length > 0 ? (
                            <div className="recipe-list">
                                {recipes.map(recipe => (
                                    <div key={recipe.id} className="recipe-item">
                                        <h2>{recipe.title}</h2>
                                        <img src={recipe.image} alt={recipe.title} width={100} className="recipe-image" />
                                        <p>Missing Ingredients: 
                                            {recipe.missedIngredients.map(i => i.name).join(', ')}
                                        </p>
                                        <button onClick={() => addToFavorites(recipe)} className="favorites-button">
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
            <table className="table">
  {favorites.length > 0 && (
    <thead>
      <tr>
        <th>Title</th>
        <th>Actions</th>
      </tr>
    </thead>
  )}
  <tbody>
    {favorites.map(fav => (
      <tr key={fav.id}>
        <td>{fav.title}</td>
        <td>
          <button onClick={() => deleteFavorite(fav.id)} className="favorites-button">
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </div>
                <div className="MealPlanner-Container">
                    <Mealplanner />
                </div>
        </div>
    );
}

export default Home;
