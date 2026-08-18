// src/App.tsx
import { useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { HistoryPage } from './pages/History';
import { ProfilePage } from './pages/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'history' | 'profile'>('dashboard');

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === 'history' && <HistoryPage onNavigate={setCurrentPage} />}
      {currentPage === 'profile' && <ProfilePage onNavigate={setCurrentPage} />}
    </>
  );
}

export default App;