// src/App.tsx
import { useState } from 'react';
import { Dashboard } from './pages/dashboard';
import { HistoryPage } from './pages/History';
import { ProfilePage } from './pages/Profile';

function App() {
  const [ currentPage, setCurrentPage] = useState<'dashboard' | 'history' | 'profile'>('dashboard');
  return (
    <>
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === 'history' && <HistoryPage onNavigate={setCurrentPage} />}
      {currentPage === 'profile' && <ProfilePage onNavigate={setCurrentPage} />}
    </>
  );
}

export default App;