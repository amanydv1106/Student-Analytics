import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudentPortalTab from './components/StudentPortalTab';
import PredictorTab from './components/PredictorTab';
import SimulatorTab from './components/SimulatorTab';
import LeaderboardTab from './components/LeaderboardTab';
import DomainGenTab from './components/DomainGenTab';
import AnalyticsTab from './components/AnalyticsTab';
import BatchPredictTab from './components/BatchPredictTab';
import AuthModal from './components/AuthModal';
import { api, authStorage } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('student-portal');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [presets, setPresets] = useState(null);

  // Authentication state
  const [currentUser, setCurrentUser] = useState(authStorage.getUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await api.checkHealth();
        if (res && res.status === 'online') {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (_) {
        setBackendStatus('offline');
      }

      try {
        const sampleRes = await api.getSampleStudents();
        setPresets(sampleRes);
      } catch (_) {}
    }

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
          // Token invalid or expired
          authStorage.clearToken();
          setCurrentUser(null);
        }
      }
    }

    checkBackend();
    checkSession();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  function handleLoginSuccess(user) {
    setCurrentUser(user);
    setActiveTab('student-portal');
  }

  function handleLogout() {
    authStorage.clearToken();
    setCurrentUser(null);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="container" style={{ flex: 1, marginTop: '1.5rem', marginBottom: '2rem' }}>
        {activeTab === 'student-portal' && (
          <StudentPortalTab
            currentUser={currentUser}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}
        {activeTab === 'predict' && <PredictorTab presets={presets} />}
        {activeTab === 'simulate' && <SimulatorTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'domain' && <DomainGenTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'batch' && <BatchPredictTab />}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <footer style={{ borderTop: '1px solid var(--border-card)', background: 'rgba(11, 23, 40, 0.95)', padding: '1.5rem 0', marginTop: 'auto', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <div className="container">
          <p>
            <strong>Student Success Prediction & Early-Warning AI System</strong> • MCA Final-Year Project
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Synthetic 200,000 Cohort • Secure Student Authentication • Diagnostics & Advisory Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
