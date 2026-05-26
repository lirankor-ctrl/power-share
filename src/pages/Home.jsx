import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoChargers } from '../data/chargers.js';
import { useApp } from '../context/AppContext.jsx';
import ChargerCard from '../components/ChargerCard.jsx';

export default function Home() {
  const [view, setView] = useState('list');
  const { user, activeSession } = useApp();
  const navigate = useNavigate();

  const sorted = [...demoChargers].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <>
      <header className="page-header">
        <div className="header-brand">
          <img src="/logo.jpg" alt="" className="header-logo" />
          <h1>שלום {user?.firstName} 👋</h1>
        </div>
        <button
          className="back-btn"
          onClick={() => navigate('/profile')}
          aria-label="פרופיל"
        >
          👤
        </button>
      </header>

      <div className="page">
        {activeSession && (
          <div
            className="hero"
            onClick={() => navigate('/session')}
            style={{ cursor: 'pointer' }}
          >
            <h2>⚡ עסקת טעינה פעילה</h2>
            <p>לחצו לצפייה והפסקת הטעינה</p>
          </div>
        )}

        <div className="toggle-pills">
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            רשימה
          </button>
          <button
            className={view === 'map' ? 'active' : ''}
            onClick={() => setView('map')}
          >
            מפה
          </button>
        </div>

        {view === 'map' && (
          <div className="map-placeholder">
            <div className="map-pin">📍</div>
            <div>תצוגת מפה (Placeholder)</div>
            <div style={{ fontSize: 12, fontWeight: 400 }}>
              {sorted.length} עמדות באזורך
            </div>
          </div>
        )}

        <div className="section-title">
          <h3>עמדות קרובות אליך</h3>
          <span className="muted">{sorted.length} תוצאות</span>
        </div>

        <div className="card-list">
          {sorted.map((c) => (
            <ChargerCard key={c.id} charger={c} />
          ))}
        </div>
      </div>
    </>
  );
}
