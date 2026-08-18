// src/App.tsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from './services/firebase';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { HistoryPage } from './pages/History';
import { ProfilePage } from './pages/Profile';
import { Loader2 } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'history' | 'profile'>('dashboard');

  useEffect(() => {
    // Dengarkan status login user secara real-time
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-medium" />
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onLoginSuccess={() => setCurrentPage('dashboard')} />;
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