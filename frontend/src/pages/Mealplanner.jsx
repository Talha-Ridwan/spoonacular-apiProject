import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiWrapper from "../api";
import "./Mealplanner.css";

const { api, secondApi } = apiWrapper;

function Mealplanner() {
  const [calories, setCalories] = useState(2000);
  const [diet, setDiet] = useState("None");
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const { data } = await api.get("api/mealplanner/get");
        setMealPlan(data);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          setMealPlan(null);
        } else {
          console.error(e);
          setError("Could not fetch meal plan.");
        }
      }
    };
    fetchMealPlan();
  }, []);

  const generateMealPlan = async () => {
    setError("");
    try {
      const { data } = await secondApi.get("/mealplanner/generate", {
        params: {
          timeFrame: "week",
          targetCalories: calories,
          diet: diet === "None" ? "" : diet,
        },
      });
      // Save to backend
      try {
        await api.post("api/mealplanner/save", data);
      } catch (saveError) {
        console.error(saveError);
        setError("Could not save meal plan, but it is displayed.");
      }
      setMealPlan(data);
    } catch (e) {
      console.error(e);
      setError("Could not generate meal plan.");
    }
  };

  return (
    <div>
      <div className="mealPlanInput">
        <input
          className="inputField"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="Target calories"
        />
        <select
          className="inputField"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        >
          <option value="None">None</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="pescetarian">Pescetarian</option>
          <option value="ketogenic">Ketogenic</option>
          <option value="paleo">Paleo</option>
        </select>
        <button className="generateButton" onClick={generateMealPlan}>
          Generate Meal Plan
        </button>
      </div>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {mealPlan && (
        <div className="mealPlanResults">
          {Object.entries(mealPlan.week).map(([day, info]) => (
            <div className="dayCard" key={day}>
              <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
              <ul>
                {info.meals.map((m, idx) => (
                  <li key={`${day}-${m.id}-${idx}`}>
                    {m.title} — {m.readyInMinutes} mins, {m.servings} servings
                  </li>
                ))}
              </ul>
              <p className="nutrients">
                <strong>Calories:</strong> {info.nutrients.calories.toFixed(0)},{" "}
                <strong>Protein:</strong> {info.nutrients.protein.toFixed(0)}g,{" "}
                <strong>Fat:</strong> {info.nutrients.fat.toFixed(0)}g,{" "}
                <strong>Carbs:</strong> {info.nutrients.carbohydrates.toFixed(0)}g
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Mealplanner;