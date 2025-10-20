import React from "react";

const WeatherCard = ({
  city,
  setCity,
  getWeatherData,
  getForecastData,
  weatherData,
  weatherError,
  isWeatherLoading,
  forecastData,
  forecastError,
  isForecastLoading,
}) => {
  return (
    <div className="card">
      <h2>🌤️ Информация о погоде</h2>
      <div className="input-group">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите название города"
          className="input"
          onKeyPress={(e) => e.key === "Enter" && getWeatherData()}
        />
        <button
          onClick={getWeatherData}
          className="button"
          disabled={isWeatherLoading}
        >
          {isWeatherLoading ? "Загрузка..." : "Узнать погоду"}
        </button>
      </div>

      {weatherError && <div className="error">{weatherError}</div>}

      {weatherData && (
        <div className="result">
          <h3>
            {weatherData.city}, {weatherData.country}
          </h3>
          <div className="temperature">
            {Math.round(weatherData.temperature)}°C
          </div>
          <div className="info-row">
            <span>Ощущается как:</span>
            <strong>{Math.round(weatherData.feels_like)}°C</strong>
          </div>
          <div className="info-row">
            <span>Влажность:</span>
            <strong>{weatherData.humidity}%</strong>
          </div>
          <div className="info-row">
            <span>Давление:</span>
            <strong>{weatherData.pressure} hPa</strong>
          </div>
          <div className="info-row">
            <span>Описание:</span>
            <strong>{weatherData.description}</strong>
          </div>
          <div className="info-row">
            <span>Ветер:</span>
            <strong>{weatherData.wind_speed} м/с</strong>
          </div>
        </div>
      )}

      <div className="forecast-section">
        <h3>📅 Прогноз на ближайшие 12 часов</h3>
        <button
          onClick={getForecastData}
          className="button forecast-button"
          disabled={isForecastLoading}
        >
          {isForecastLoading ? "Загрузка..." : "Получить прогноз"}
        </button>

        {forecastError && <div className="error">{forecastError}</div>}

        {forecastData && (
          <div className="forecast">
            <h4>
              {forecastData.city}, {forecastData.country}
            </h4>
            <div className="forecast-items">
              {forecastData.forecast.map((item, index) => (
                <div key={index} className="forecast-item">
                  <div className="forecast-date">
                    {new Date(item.datetime).toLocaleString("ru-RU", {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="forecast-temp">
                    {Math.round(item.temperature)}°C
                  </div>
                  <div className="forecast-desc">{item.description}</div>
                  <div className="forecast-humidity">💧 {item.humidity}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
