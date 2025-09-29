from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from enum import Enum
import requests

app = FastAPI()

CODEFORCES_URL = "https://codeforces.com/api"
COINGECKO_URL = "https://api.coingecko.com/api/v3"


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CoinsModel(str, Enum):
    BTC = "bitcoin"
    ETH = "ethereum"
    USDT = "tether"
    SOL = "solana"
    ADA = "cardano"
    XRP = "ripple"
    UNLUCK = "unluck"


@app.get("/get_data_from_codeforces/{name}")
def get_data_from_codeforces(name: str):
    url = f"{CODEFORCES_URL}/user.info?handles={name}"

    response = requests.get(url)

    data = response.json()

    if data["status"] != "OK":
        raise HTTPException(
            status_code=404, detail=f"Пользователь {name} не найден")

    data = data["result"][0]

    return data


@app.get("/get_data_from_crypto/{name}")
def get_data_from_crypto(name: CoinsModel):
    url = f"{COINGECKO_URL}/simple/price?ids={name.value}&vs_currencies=usd"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=503, detail=f"Ошибка при запросе к CoinGecko: {str(e)}")

    data = response.json()

    if len(data) == 0:
        raise HTTPException(
            status_code=404, detail=f"Криптовалюта {name.value} не найдена")

    return data
