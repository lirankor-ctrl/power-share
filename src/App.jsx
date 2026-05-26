import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import BottomNav from './components/BottomNav.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import ChargerDetails from './pages/ChargerDetails.jsx';
import Session from './pages/Session.jsx';
import Rating from './pages/Rating.jsx';
import Profile from './pages/Profile.jsx';
import MySessions from './pages/MySessions.jsx';

export default function App() {
  const { user } = useApp();
  const location = useLocation();

  const hideNavRoutes = ['/onboarding', '/welcome'];
  const showNav = user && !hideNavRoutes.some((p) => location.pathname.startsWith(p));

  if (!user && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/charger/:id" element={<ChargerDetails />} />
        <Route path="/session" element={<Session />} />
        <Route path="/rating/:sessionId" element={<Rating />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-sessions" element={<MySessions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  );
}
