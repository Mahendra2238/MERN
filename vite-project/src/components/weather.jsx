// Weather.jsx
import React, { useState } from "react";
import "./Weather.css"; // Import CSS

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = "447b27f97901de8f9393714e9c09bf9e";

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="weather-box">
        <h1 className="title">Weather App</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="city-input"
          />
          <button onClick={getWeather} className="btn">
            Get Weather
          </button>
        </div>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="result-card">
            <h2>{weather.name}</h2>
            <p className="temp">{weather.main.temp}°C</p>
            <p className="desc">{weather.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
