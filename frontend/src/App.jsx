import { useState } from "react";
import axios from "axios";
import "./App.css";
import CodeforcesCard from "./components/CodeforcesCard";
import WeatherCard from "./components/WeatherCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  // --- Состояния для Codeforces ---
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [cfError, setCfError] = useState("");
  const [isCfLoading, setIsCfLoading] = useState(false);

  // --- Состояния для Погоды ---
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // --- Состояния для Прогноза ---
  const [forecastData, setForecastData] = useState(null);
  const [forecastError, setForecastError] = useState("");
  const [isForecastLoading, setIsForecastLoading] = useState(false);

  // --- Логика для Codeforces ---
  const getCodeforcesData = async () => {
    if (!username.trim()) {
      setCfError("Пожалуйста, введите имя пользователя");
      return;
    }
    setIsCfLoading(true);
    setCfError("");
    setUserData(null);
    try {
      const response = await axios.get(
        `${API_URL}/get_data_from_codeforces/${username}`
      );
      setUserData(response.data);
    } catch (error) {
      setCfError(
        error.response?.data?.detail || "Произошла ошибка при получении данных."
      );
    } finally {
      setIsCfLoading(false);
    }
  };

  // --- Логика для Погоды ---
  const getWeatherData = async () => {
    if (!city.trim()) {
      setWeatherError("Пожалуйста, введите название города");
      return;
    }
    setIsWeatherLoading(true);
    setWeatherError("");
    setWeatherData(null);
    try {
      const response = await axios.get(`${API_URL}/get_weather/${city}`);
      setWeatherData(response.data);
    } catch (error) {
      setWeatherError(
        error.response?.data?.detail || "Произошла ошибка при получении данных."
      );
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // --- Логика для Прогноза ---
  const getForecastData = async () => {
    if (!city.trim()) {
      setForecastError("Пожалуйста, введите название города");
      return;
    }
    setIsForecastLoading(true);
    setForecastError("");
    setForecastData(null);
    try {
      const response = await axios.get(`${API_URL}/get_forecast/${city}`);
      setForecastData(response.data);
    } catch (error) {
      setForecastError(
        error.response?.data?.detail ||
          "Произошла ошибка при получении прогноза."
      );
    } finally {
      setIsForecastLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🌤️ Codeforces & Weather Dashboard</h1>
      <div className="sections">
        <CodeforcesCard
          username={username}
          setUsername={setUsername}
          getCodeforcesData={getCodeforcesData}
          userData={userData}
          cfError={cfError}
          isCfLoading={isCfLoading}
        />
        <WeatherCard
          city={city}
          setCity={setCity}
          getWeatherData={getWeatherData}
          getForecastData={getForecastData}
          weatherData={weatherData}
          weatherError={weatherError}
          isWeatherLoading={isWeatherLoading}
          forecastData={forecastData}
          forecastError={forecastError}
          isForecastLoading={isForecastLoading}
        />
      </div>
    </div>
  );
}

export default App;
