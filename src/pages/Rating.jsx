import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const criteria = [
  { key: 'cleanliness', label: 'ניקיון/נגישות העמדה' },
  { key: 'communication', label: 'תקשורת' },
  { key: 'reliability', label: 'אמינות' },
  { key: 'overall', label: 'חוויה כללית' }
];

function StarRow({ value, onChange }) {
  return (
    <div className="stars">
      {[5, 4, 3, 2, 1].map((n) => (
        <span
          key={n}
          onClick={() => onChange(n)}
          style={{
            fontSize: 24,
            color: value >= n ? '#f59e0b' : '#d1d5db',
            cursor: 'pointer'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Rating() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { sessions, markRated } = useApp();
  const session = sessions.find((s) => s.id === sessionId);

  const [scores, setScores] = useState({
    cleanliness: 5,
    communication: 5,
    reliability: 5,
    overall: 5
  });
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const setScore = (k, v) => setScores((s) => ({ ...s, [k]: v }));

  const submit = () => {
    if (session) {
      markRated(session.id, { scores, text });
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <header className="page-header">
          <h1>תודה רבה!</h1>
        </header>
        <div className="page">
          <div className="empty">
            <div className="empty-icon">⭐</div>
            <div>הדירוג נשמר בהצלחה</div>
            <button
              className="btn"
              style={{ marginTop: 16 }}
              onClick={() => navigate('/')}
            >
              חזרה למסך הבית
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>‹</button>
        <h1>דירוג העסקה</h1>
        <span />
      </header>

      <div className="page">
        {session && (
          <div className="card">
            <h3>{session.chargerSnapshot.ownerName}</h3>
            <div className="muted">
              {session.chargerSnapshot.address}, {session.chargerSnapshot.city}
            </div>
            <div style={{ marginTop: 8 }} className="tag">
              שולם: {session.amount} ₪
            </div>
          </div>
        )}

        <div className="card">
          <h3>איך הייתה החוויה?</h3>
          {criteria.map((c) => (
            <div className="star-row" key={c.key}>
              <span>{c.label}</span>
              <StarRow
                value={scores[c.key]}
                onChange={(v) => setScore(c.key, v)}
              />
            </div>
          ))}
        </div>

        <div className="card">
          <h3>הוסף חוות דעת</h3>
          <div className="field">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ספר על החוויה שלך — מה היה טוב, מה ניתן לשפר..."
            />
          </div>
        </div>

        <button className="btn" onClick={submit}>
          שלח דירוג
        </button>
      </div>
    </>
  );
}
