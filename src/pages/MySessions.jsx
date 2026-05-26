import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

function formatDate(ts) {
  return new Date(ts).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(ms) {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h} שעות ${m} דק׳`;
  return `${m} דק׳`;
}

export default function MySessions() {
  const { sessions, activeSession } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <header className="page-header">
        <h1>העסקאות שלי</h1>
      </header>

      <div className="page">
        {activeSession && (
          <div
            className="hero"
            onClick={() => navigate('/session')}
            style={{ cursor: 'pointer' }}
          >
            <h2>⚡ עסקה פעילה</h2>
            <p>לחצו לצפייה והפסקת הטעינה</p>
          </div>
        )}

        {sessions.length === 0 && !activeSession ? (
          <div className="empty">
            <div className="empty-icon">⚡</div>
            <div>עדיין לא ביצעת אף עסקת טעינה</div>
            <button
              className="btn"
              style={{ marginTop: 16 }}
              onClick={() => navigate('/')}
            >
              חפש עמדה
            </button>
          </div>
        ) : (
          <div className="card-list">
            {sessions.map((s) => (
              <div className="card" key={s.id}>
                <div className="charger-card-head">
                  <div className="charger-meta">
                    <div className="name">{s.chargerSnapshot.ownerName}</div>
                    <div className="muted">
                      {s.chargerSnapshot.address}, {s.chargerSnapshot.city}
                    </div>
                  </div>
                  <div className="amount" style={{ fontSize: 18 }}>
                    {s.amount} ₪
                  </div>
                </div>

                <div className="info-row">
                  <span className="label">תאריך</span>
                  <span className="value">{formatDate(s.startedAt)}</span>
                </div>
                <div className="info-row">
                  <span className="label">משך</span>
                  <span className="value">
                    {formatDuration((s.endedAt || Date.now()) - s.startedAt)}
                  </span>
                </div>

                {!s.rated ? (
                  <button
                    className="btn"
                    style={{ marginTop: 10 }}
                    onClick={() => navigate(`/rating/${s.id}`)}
                  >
                    דרג את העסקה
                  </button>
                ) : (
                  <div style={{ marginTop: 10, textAlign: 'center' }}>
                    <span className="tag">דורגה ✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
