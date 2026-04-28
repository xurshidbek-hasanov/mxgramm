import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import { User, View } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic session persistence
    const savedUser = localStorage.getItem('mx_gramm_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setView('chat');
      } catch (e) {
        localStorage.removeItem('mx_gramm_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('mx_gramm_user', JSON.stringify(newUser));
    setView('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('mx_gramm_user');
    setUser(null);
    setView('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tg-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-tg-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-tg-blue/30 selection:text-tg-blue">
      {view === 'login' ? (
        <Login onLogin={handleLogin} />
      ) : (
        user && <Chat currentUser={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
