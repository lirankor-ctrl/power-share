import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

const STORAGE_KEY = 'power-share-state-v1';

const defaultState = {
  user: null,
  activeSession: null,
  sessions: []
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setUser = (user) => setState((s) => ({ ...s, user }));

  const startSession = (charger) => {
    const session = {
      id: 's' + Date.now(),
      chargerId: charger.id,
      chargerSnapshot: {
        ownerName: charger.ownerName,
        ownerPhone: charger.ownerPhone,
        address: charger.address,
        city: charger.city,
        notes: charger.notes
      },
      startedAt: Date.now(),
      endedAt: null,
      amount: 0,
      paid: false,
      rated: false
    };
    setState((s) => ({ ...s, activeSession: session }));
    return session;
  };

  const endSession = (amount) => {
    setState((s) => {
      if (!s.activeSession) return s;
      const ended = {
        ...s.activeSession,
        endedAt: Date.now(),
        amount
      };
      return {
        ...s,
        activeSession: null,
        sessions: [ended, ...s.sessions]
      };
    });
  };

  const markPaid = (sessionId) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) =>
        x.id === sessionId ? { ...x, paid: true } : x
      )
    }));
  };

  const markRated = (sessionId, rating) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) =>
        x.id === sessionId ? { ...x, rated: true, ratingGiven: rating } : x
      )
    }));
  };

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser,
        startSession,
        endSession,
        markPaid,
        markRated,
        resetAll
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
