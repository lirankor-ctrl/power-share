import { useMemo, useState } from 'react';
import { demoChargers } from '../data/chargers.js';
import ChargerCard from '../components/ChargerCard.jsx';

const filters = [
  { key: 'closest', label: 'הקרובות ביותר' },
  { key: 'rating', label: 'דירוג גבוה' },
  { key: 'open', label: 'פתוחות עכשיו' }
];

function isOpenNow(hours) {
  // hours format: "HH:MM - HH:MM"
  const m = hours.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
  if (!m) return true;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = +m[1] * 60 + +m[2];
  const end = +m[3] * 60 + +m[4];
  if (start === end) return true;
  if (start < end) return minutes >= start && minutes <= end;
  return minutes >= start || minutes <= end;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('closest');

  const results = useMemo(() => {
    let list = demoChargers;
    const q = query.trim();
    if (q) {
      list = list.filter(
        (c) => c.city.includes(q) || c.address.includes(q)
      );
    }
    if (activeFilter === 'open') {
      list = list.filter((c) => isOpenNow(c.hours));
    }
    if (activeFilter === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return list;
  }, [query, activeFilter]);

  return (
    <>
      <header className="page-header">
        <h1>חיפוש עמדה</h1>
      </header>

      <div className="page">
        <div className="search-box">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="הכנס כתובת או עיר"
          />
        </div>

        <div className="filters">
          {filters.map((f) => (
            <button
              key={f.key}
              className={'filter-chip' + (activeFilter === f.key ? ' active' : '')}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div>לא נמצאו עמדות התואמות את החיפוש</div>
          </div>
        ) : (
          <div className="card-list">
            {results.map((c) => (
              <ChargerCard key={c.id} charger={c} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
