import { useNavigate, useParams } from 'react-router-dom';
import { getChargerById } from '../data/chargers.js';
import { useApp } from '../context/AppContext.jsx';

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

export default function ChargerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const charger = getChargerById(id);
  const { activeSession, startSession } = useApp();

  if (!charger) {
    return (
      <>
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
          <h1>עמדה לא נמצאה</h1>
          <span />
        </header>
        <div className="page">
          <div className="empty">העמדה אינה קיימת.</div>
        </div>
      </>
    );
  }

  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    charger.address + ' ' + charger.city
  )}&navigate=yes`;

  const onStart = () => {
    if (activeSession) {
      navigate('/session');
      return;
    }
    startSession(charger);
    navigate('/session');
  };

  return (
    <>
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="חזור">‹</button>
        <h1>פרטי עמדה</h1>
        <span />
      </header>

      <div className="page">
        <div className="card">
          <div className="charger-card-head">
            <div className="avatar lg">{initials(charger.ownerName)}</div>
            <div className="charger-meta">
              <div className="name" style={{ fontSize: 17 }}>
                {charger.ownerName}
              </div>
              <div className="muted">בעל העמדה</div>
            </div>
            <div className="rating-pill">
              ★ {charger.rating} ({charger.reviewsCount})
            </div>
          </div>
        </div>

        <div className="card">
          <h3>פרטי העמדה</h3>
          <div className="info-row">
            <span className="label">כתובת</span>
            <span className="value">{charger.address}, {charger.city}</span>
          </div>
          <div className="info-row">
            <span className="label">טלפון</span>
            <a className="value" href={`tel:${charger.ownerPhone}`} dir="ltr">
              {charger.ownerPhone}
            </a>
          </div>
          <div className="info-row">
            <span className="label">שעות פעילות</span>
            <span className="value">{charger.hours}</span>
          </div>
          <div className="info-row">
            <span className="label">סוג חיבור</span>
            <span className="value">{charger.cableType} · {charger.powerKw} ק״ו</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <a className="btn btn-secondary" href={wazeUrl} target="_blank" rel="noreferrer">
              נווט עם Waze
            </a>
          </div>
        </div>

        <div className="card">
          <h3>תיאור</h3>
          <p>{charger.description}</p>
          {charger.notes && (
            <>
              <h3 style={{ marginTop: 12 }}>הוראות לטעינה</h3>
              <p>{charger.notes}</p>
            </>
          )}
        </div>

        <div className="card">
          <h3>חוות דעת ({charger.reviews.length})</h3>
          {charger.reviews.length === 0 ? (
            <div className="muted">עדיין אין חוות דעת לעמדה הזו.</div>
          ) : (
            charger.reviews.map((r) => (
              <div className="review-item" key={r.id}>
                <div className="review-head">
                  <strong>{r.author}</strong>
                  <span className="rating-pill">★ {r.rating}</span>
                </div>
                <div className="muted">{r.text}</div>
              </div>
            ))
          )}
        </div>

        <button className="btn" onClick={onStart}>
          {activeSession ? 'יש לך עסקה פעילה — עבור לעסקה' : 'פתח עסקת טעינה'}
        </button>
      </div>
    </>
  );
}
