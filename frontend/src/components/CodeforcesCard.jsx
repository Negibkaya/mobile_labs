import React from "react";

const CodeforcesCard = ({
  username,
  setUsername,
  getCodeforcesData,
  userData,
  cfError,
  isCfLoading,
}) => {
  const getRankColor = (rank) => {
    if (!rank) return "#cccccc";
    const rankColors = {
      newbie: "#808080",
      pupil: "#008000",
      specialist: "#0000ff",
      expert: "#a0a0ff",
      "candidate master": "#ff00ff",
      master: "#ff8c00",
      "international master": "#ff8c00",
      grandmaster: "#ff0000",
      "international grandmaster": "#ff0000",
      "legendary grandmaster": "#aa0000",
    };
    return rankColors[rank.toLowerCase()] || "#cccccc";
  };

  return (
    <div className="card">
      <h2>👨‍💻 Codeforces User Info</h2>
      <div className="input-group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Введите имя пользователя"
          className="input"
          onKeyPress={(e) => e.key === "Enter" && getCodeforcesData()}
        />
        <button
          onClick={getCodeforcesData}
          className="button"
          disabled={isCfLoading}
        >
          {isCfLoading ? "Загрузка..." : "Получить данные"}
        </button>
      </div>

      {cfError && <div className="error">{cfError}</div>}

      {userData && (
        <div className="result">
          <h3 style={{ color: getRankColor(userData.rank) }}>
            {userData.handle}
          </h3>
          <div className="info-row">
            <span>Рейтинг:</span>
            <strong>{userData.rating || "N/A"}</strong>
          </div>
          <div className="info-row">
            <span>Ранг:</span>
            <strong style={{ color: getRankColor(userData.rank) }}>
              {userData.rank || "Unrated"}
            </strong>
          </div>
          <div className="info-row">
            <span>Макс. рейтинг:</span>
            <strong>{userData.maxRating || "N/A"}</strong>
          </div>
          <div className="info-row">
            <span>Друзья:</span>
            <strong>{userData.friendOfCount || 0}</strong>
          </div>
          {userData.country && (
            <div className="info-row">
              <span>Страна:</span>
              <strong>{userData.country}</strong>
            </div>
          )}
          {userData.city && (
            <div className="info-row">
              <span>Город:</span>
              <strong>{userData.city}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeforcesCard;
