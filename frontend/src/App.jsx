import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudentDashboard from './components/StudentDashboard';
import PredictorTab from './components/PredictorTab';
import SimulatorTab from './components/SimulatorTab';
import LeaderboardTab from './components/LeaderboardTab';
import AnalyticsTab from './components/AnalyticsTab';
import BatchPredictTab from './components/BatchPredictTab';
import AuthModal from './components/AuthModal';
import { api, authStorage } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(authStorage.getUser());
  const [activeTab, setActiveTab] = useState(currentUser ? 'dashboard' : 'predict');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [presets, setPresets] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const token = authStorage.getToken();
      if (token) {
        try {
          const profile = await api.getMe();
          if (profile) {
            setCurrentUser(profile);
            authStorage.setUser(profile);
            setActiveTab('dashboard');
          }
        } catch (_) {
          authStorage.clearToken();
          setCurrentUser(null);
        }
      }
    }

    async function loadPresets() {
      try {
        const sampleRes = await api.getSampleStudents();
        setPresets(sampleRes);
      } catch (_) {}
    }

    checkSession();
    loadPresets();
  }, []);

  function handleLoginSuccess(user) {
    setCurrentUser(user);
    setAuthModalOpen(false);
    setActiveTab('dashboard');
  }

  function handleLogout() {
    authStorage.clearToken();
    setCurrentUser(null);
    setActiveTab('predict');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#EDE4F7', color: '#1E152A' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="container" style={{ flex: 1, padding: '1.5rem', width: '100%', maxWidth: '1240px', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* If user is logged in: show dedicated StudentDashboard */}
        {currentUser && (
          <StudentDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}

        {/* Public ML Models & Tools (only shown when not logged in) */}
        {!currentUser && activeTab === 'predict' && <PredictorTab presets={presets} />}
        {!currentUser && activeTab === 'simulate' && <SimulatorTab />}
        {!currentUser && activeTab === 'leaderboard' && <LeaderboardTab />}
        {!currentUser && activeTab === 'analytics' && <AnalyticsTab />}
        {!currentUser && activeTab === 'batch' && <BatchPredictTab />}
      </main>

      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {!currentUser && (
        <footer style={{ 
          borderTop: '1px solid #E2D4F0', 
          background: '#FFFFFF', 
          padding: '1.25rem 0', 
          marginTop: 'auto', 
          textAlign: 'center', 
          fontSize: '0.75rem', 
          color: '#6B5C7D' 
        }}>
          <div className="container" style={{ padding: '0 1.5rem' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#1E152A' }}>StudIQ</strong> • Student Performance Analytics
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
