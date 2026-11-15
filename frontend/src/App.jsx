import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudentPortalTab from './components/StudentPortalTab';
import AuthModal from './components/AuthModal';
import { api, authStorage } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(authStorage.getUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const token = authStorage.getToken();
      if (token) {
        try {
          const profile = await api.getMe();
          if (profile) {
            setCurrentUser(profile);
            authStorage.setUser(profile);
          }
        } catch (_) {
          authStorage.clearToken();
          setCurrentUser(null);
        }
      }
    }
    checkSession();
  }, []);

  function handleLoginSuccess(user) {
    setCurrentUser(user);
    setAuthModalOpen(false);
  }

  function handleLogout() {
    authStorage.clearToken();
    setCurrentUser(null);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070f1e', color: '#f8fafc' }}>
      <Header
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="container" style={{ flex: 1, padding: '1.5rem', width: '100%', maxWidth: '1140px', margin: '0 auto', boxSizing: 'border-box' }}>
        <StudentPortalTab
          currentUser={currentUser}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onLoginSuccess={handleLoginSuccess}
        />
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <footer style={{ 
        borderTop: '1px solid #1a273c', 
        background: '#091220', 
        padding: '1.25rem 0', 
        marginTop: 'auto', 
        textAlign: 'center', 
        fontSize: '0.75rem', 
        color: '#64748b' 
      }}>
        <div className="container">
          <p style={{ margin: 0 }}>
            <strong>Student Success AI</strong> • Student Performance & Diagnostic System
          </p>
        </div>
      </footer>
    </div>
  );
}
