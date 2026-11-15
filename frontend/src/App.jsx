import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudentDashboard from './components/StudentDashboard';
import PredictorTab from './components/PredictorTab';
import SimulatorTab from './components/SimulatorTab';
import LeaderboardTab from './components/LeaderboardTab';
import DomainGenTab from './components/DomainGenTab';
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070f1e', color: '#f8fafc' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="container" style={{ flex: 1, padding: '1.5rem', width: '100%', maxWidth: '1240px', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* If activeTab is 'dashboard' and user is logged in: show dedicated StudentDashboard */}
        {activeTab === 'dashboard' && currentUser && (
          <StudentDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchToPublic={() => setActiveTab('predict')}
          />
        )}

        {/* Public ML Models & Tools */}
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
            <strong>Student Success AI</strong> • MCA Final-Year Project • Academic Performance Prediction & Early-Warning Diagnostic System
          </p>
        </div>
      </footer>
    </div>
  );
}
