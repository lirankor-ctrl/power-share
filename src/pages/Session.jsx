import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getChargerById } from '../data/chargers.js';

function formatDuration(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function calcAmount(totalSec) {
  const minutes = Math.ceil(totalSec / 60);
  if (minutes <= 0) return 0;
  const fullHours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  let amount = fullHours * 10;
  if (remainder > 0) {
    if (remainder <= 10) amount += 1.5;
    else if (remainder <= 30) amount += 5;
    else amount += 10;
  }
  return amount;
}

export default function Session() {
  const navigate = useNavigate();
  const { activeSession, endSession, sessions } = useApp();
  const [now, setNow] = useState(Date.now());
  const [showBit, setShowBit] = useState(false);

  useEffect(() => {
    if (!activeSession) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [activeSession]);

  if (!activeSession) {
    const last = sessions[0];
    return (
      <>
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>‹</button>
          <h1>עסקת טעינה</h1>
          <span />
        </header>
        <div className="page">
          <div className="empty">
            <div className="empty-icon">⚡</div>
            <div>אין עסקה פעילה</div>
            <button
              className="btn"
              style={{ marginTop: 16 }}
              onClick={() => navigate('/')}
            >
              חזרה לעמדות
            </button>
            {last && (
              <button
                className="btn btn-secondary"
                style={{ marginTop: 8 }}
                onClick={() => navigate(`/rating/${last.id}`)}
              >
                דרג את העסקה האחרונה
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  const charger = getChargerById(activeSession.chargerId) || {
    ownerName: activeSession.chargerSnapshot.ownerName,
    ownerPhone: activeSession.chargerSnapshot.ownerPhone,
    address: activeSession.chargerSnapshot.address,
    city: activeSession.chargerSnapshot.city,
    notes: activeSession.chargerSnapshot.notes
  };

  const elapsedSec = Math.floor((now - activeSession.startedAt) / 1000);
  const amount = calcAmount(elapsedSec);
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    charger.address + ' ' + charger.city
  )}&navigate=yes`;

  const onStop = () => {
    if (!confirm('האם לסיים את עסקת הטעינה?')) return;
    endSession(amount);
    setShowBit(true);
  };

  const goRate = () => {
    setShowBit(false);
    // Get most recent session (just ended)
    const latest = sessions[0];
    if (latest) navigate(`/rating/${latest.id}`);
    else navigate('/');
  };

  return (
    <>
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>‹</button>
        <h1>עסקת טעינה פעילה</h1>
        <span />
      </header>

      <div className="page">
        <div className="timer-display">
          <div className="timer-status">זמן טעינה</div>
          <div className="timer-clock">{formatDuration(elapsedSec)}</div>
          <div className="timer-status">סכום לתשלום</div>
          <div className="amount">{amount.toFixed(amount % 1 === 0 ? 0 : 1)} ₪</div>
        </div>

        <div className="card">
          <h3>פרטי בעל העמדה</h3>
          <div className="info-row">
            <span className="label">שם</span>
            <span className="value">{charger.ownerName}</span>
          </div>
          <div className="info-row">
            <span className="label">טלפון</span>
            <a className="value" href={`tel:${charger.ownerPhone}`} dir="ltr">
              {charger.ownerPhone}
            </a>
          </div>
          <div className="info-row">
            <span className="label">כתובת</span>
            <span className="value">{charger.address}, {charger.city}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <a className="btn btn-secondary" href={wazeUrl} target="_blank" rel="noreferrer">
              נווט עם Waze
            </a>
          </div>
        </div>

        {charger.notes && (
          <div className="card">
            <h3>הוראות טעינה</h3>
            <p>{charger.notes}</p>
          </div>
        )}

        <button className="btn btn-danger" onClick={onStop}>
          סיים טעינה
        </button>
      </div>

      {showBit && (
        <div className="bit-modal" onClick={() => setShowBit(false)}>
          <div className="bit-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>תשלום בביט</h3>
            <p>בשלב זה התשלום מתבצע ידנית בביט למספר:</p>
            <div className="phone-big">{charger.ownerPhone}</div>
            <div className="amount" style={{ margin: '16px 0' }}>
              {amount.toFixed(amount % 1 === 0 ? 0 : 1)} ₪
            </div>
            <div className="btn-row">
              <button className="btn" onClick={goRate}>
                סיימתי — דרג עכשיו
              </button>
            </div>
            <button
              className="btn btn-secondary"
              style={{ marginTop: 8 }}
              onClick={() => setShowBit(false)}
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </>
  );
}
