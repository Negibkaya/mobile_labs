import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8000";

function App() {
  // Codeforces
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [cfError, setCfError] = useState("");

  // Crypto
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [cryptoData, setCryptoData] = useState(null);
  const [cryptoError, setCryptoError] = useState("");

  const coins = [
    { value: "bitcoin", label: "Bitcoin" },
    { value: "ethereum", label: "Ethereum" },
    { value: "tether", label: "Tether" },
    { value: "solana", label: "Solana" },
    { value: "cardano", label: "Cardano" },
    { value: "ripple", label: "Ripple" },
  ];

  const getCodeforcesData = async () => {
    setCfError("");
    setUserData(null);

    try {
      const response = await axios.get(
        `${API_URL}/get_data_from_codeforces/${username}`
      );
      setUserData(response.data);
    } catch (error) {
      setCfError(error.response?.data?.detail || "Ошибка");
    }
  };

  const getCryptoData = async () => {
    setCryptoError("");
    setCryptoData(null);

    try {
      const response = await axios.get(
        `${API_URL}/get_data_from_crypto/${selectedCoin}`
      );
      setCryptoData(response.data);
    } catch (error) {
      setCryptoError(error.response?.data?.detail || "Ошибка");
    }
  };

  return (
    <div className="container">
      <h1 className="title">🚀 Codeforces & Crypto Dashboard</h1>

      <div className="sections">
        {/* Codeforces Section */}
        <div className="card">
          <h2>👨‍💻 Codeforces User Info</h2>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="input"
            />
            <button onClick={getCodeforcesData} className="button">
              Get User Data
            </button>
          </div>

          {cfError && <div className="error">{cfError}</div>}

          {userData && (
            <div className="result">
              <h3>{userData.handle}</h3>
              <div className="info-row">
                <span>Rating:</span>
                <strong>{userData.rating || "N/A"}</strong>
              </div>
              <div className="info-row">
                <span>Rank:</span>
                <strong>{userData.rank || "Unrated"}</strong>
              </div>
              <div className="info-row">
                <span>Max Rating:</span>
                <strong>{userData.maxRating || "N/A"}</strong>
              </div>
              {userData.country && (
                <div className="info-row">
                  <span>Country:</span>
                  <strong>{userData.country}</strong>
                </div>
              )}
              {userData.city && (
                <div className="info-row">
                  <span>City:</span>
                  <strong>{userData.city}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Crypto Section */}
        <div className="card">
          <h2>💰 Cryptocurrency Prices</h2>
          <div className="input-group">
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="select"
            >
              {coins.map((coin) => (
                <option key={coin.value} value={coin.value}>
                  {coin.label}
                </option>
              ))}
            </select>
            <button onClick={getCryptoData} className="button">
              Get Price
            </button>
          </div>

          {cryptoError && <div className="error">{cryptoError}</div>}

          {cryptoData && (
            <div className="result">
              <h3>{coins.find((c) => c.value === selectedCoin)?.label}</h3>
              <div className="price">
                ${cryptoData[selectedCoin]?.usd?.toLocaleString() || 0}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
