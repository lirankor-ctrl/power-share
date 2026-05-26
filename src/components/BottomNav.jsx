import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', icon: '🏠', label: 'בית' },
  { to: '/search', icon: '🔍', label: 'חיפוש' },
  { to: '/my-sessions', icon: '⚡', label: 'העסקאות שלי' },
  { to: '/profile', icon: '👤', label: 'פרופיל' }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="ניווט תחתון">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
