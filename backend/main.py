from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from enum import Enum
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

CODEFORCES_URL = "https://codeforces.com/api/user.info?handles={name}"
OPEN_WEATHER_MAP_URL = "https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units={units.value}"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units={units.value}"

API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WeatherUnits(str, Enum):
    METRIC = "metric"
    IMPERIAL = "imperial"
    KELVIN = "standard"


@app.get("/get_data_from_codeforces/{name}")
def get_data_from_codeforces(name: str):
    url = CODEFORCES_URL.format(name=name)

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=503, detail=f"Ошибка при запросе к Codeforces: {str(e)}")

    data = response.json()

    if data.get("status") != "OK":
        raise HTTPException(
            status_code=404, detail=f"Пользователь {name} не найден")

    return data["result"][0]


@app.get("/get_weather/{city}")
def get_weather(city: str, units: WeatherUnits = WeatherUnits.METRIC):
    url = OPEN_WEATHER_MAP_URL.format(city=city, api_key=API_KEY, units=units)

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=503, detail=f"Ошибка при запросе к OpenWeatherMap: {str(e)}")

    data = response.json()

    if data.get("cod") != 200:
        raise HTTPException(
            status_code=404, detail=f"Город {city} не найден")

    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        "description": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"],
        "units": units.value
    }


@app.get("/get_forecast/{city}")
def get_forecast(city: str, units: WeatherUnits = WeatherUnits.METRIC):
    url = FORECAST_URL.format(city=city, api_key=API_KEY, units=units)

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=503, detail=f"Ошибка при запросе к OpenWeatherMap: {str(e)}")

    data = response.json()

    if data.get("cod") != "200":
        raise HTTPException(
            status_code=404, detail=f"Город {city} не найден")

    forecast_data = {
        "city": data["city"]["name"],
        "country": data["city"]["country"],
        "forecast": [
            {
                "datetime": item["dt_txt"],
                "temperature": item["main"]["temp"],
                "feels_like": item["main"]["feels_like"],
                "humidity": item["main"]["humidity"],
                "pressure": item["main"]["pressure"],
                "description": item["weather"][0]["description"],
                "wind_speed": item["wind"]["speed"]
                # Берем прогноз на 5 временных отрезков
            } for item in data["list"][:5]
        ]
    }

    return forecast_data
