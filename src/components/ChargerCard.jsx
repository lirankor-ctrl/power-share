import { useNavigate } from 'react-router-dom';

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

export default function ChargerCard({ charger }) {
  const navigate = useNavigate();

  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    charger.address + ' ' + charger.city
  )}&navigate=yes`;

  return (
    <article
      className="charger-card"
      onClick={() => navigate(`/charger/${charger.id}`)}
    >
      <div className="charger-card-head">
        <div className="avatar">{initials(charger.ownerName)}</div>
        <div className="charger-meta">
          <div className="name">{charger.ownerName}</div>
          <div className="muted">
            {charger.city} · {charger.address}
          </div>
        </div>
        <div className="rating-pill">★ {charger.rating}</div>
      </div>

      <div className="charger-info">
        <span>📍 {charger.distanceKm} ק״מ ממך</span>
        <span>🕒 {charger.hours}</span>
        <span>⚡ {charger.powerKw} ק״ו</span>
      </div>

      <div className="btn-row">
        <button
          className="btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/charger/${charger.id}`);
          }}
        >
          צפה בפרטים
        </button>
        <a
          className="btn btn-secondary"
          href={wazeUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          נווט עם Waze
        </a>
      </div>
    </article>
  );
}
