import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const typeLabels = {
  seeker: 'מחפש טעינה',
  owner: 'מציע עמדה',
  both: 'מחפש ומציע עמדה'
};

export default function Profile() {
  const { user, sessions, resetAll } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  const onLogout = () => {
    if (!confirm('האם להתנתק ולמחוק את הנתונים מהמכשיר?')) return;
    resetAll();
    navigate('/onboarding', { replace: true });
  };

  return (
    <>
      <header className="page-header">
        <h1>פרופיל</h1>
      </header>

      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <div className="avatar lg">
              {user.photo ? (
                <img src={user.photo} alt="" />
              ) : (
                (user.firstName[0] || '') + (user.lastName[0] || '')
              )}
            </div>
          </div>
          <h3 style={{ marginBottom: 4 }}>
            {user.firstName} {user.lastName}
          </h3>
          <div className="tag">{typeLabels[user.userType]}</div>
        </div>

        <div className="card">
          <h3>פרטי קשר</h3>
          <div className="info-row">
            <span className="label">טלפון</span>
            <span className="value" dir="ltr">{user.phone}</span>
          </div>
          <div className="info-row">
            <span className="label">דוא״ל</span>
            <span className="value">{user.email}</span>
          </div>
        </div>

        {(user.userType === 'owner' || user.userType === 'both') && (
          <div className="card">
            <h3>העמדה שלי</h3>
            <div className="info-row">
              <span className="label">כתובת</span>
              <span className="value">{user.chargerAddress}, {user.chargerCity}</span>
            </div>
            <div className="info-row">
              <span className="label">שעות פעילות</span>
              <span className="value">{user.chargerHours}</span>
            </div>
            {user.chargerDescription && (
              <div style={{ marginTop: 10 }}>
                <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>תיאור</div>
                <div>{user.chargerDescription}</div>
              </div>
            )}
            {user.chargerNotes && (
              <div style={{ marginTop: 10 }}>
                <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>הערות</div>
                <div>{user.chargerNotes}</div>
              </div>
            )}
          </div>
        )}

        <div className="card">
          <h3>סטטיסטיקות</h3>
          <div className="info-row">
            <span className="label">סך עסקאות</span>
            <span className="value">{sessions.length}</span>
          </div>
          <div className="info-row">
            <span className="label">סה״כ הוצאה</span>
            <span className="value">
              {sessions.reduce((sum, s) => sum + (s.amount || 0), 0)} ₪
            </span>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={onLogout}>
          התנתק ואפס נתונים
        </button>
      </div>
    </>
  );
}
