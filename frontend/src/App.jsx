import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PredictorTab from './components/PredictorTab';
import SimulatorTab from './components/SimulatorTab';
import LeaderboardTab from './components/LeaderboardTab';
import DomainGenTab from './components/DomainGenTab';
import AnalyticsTab from './components/AnalyticsTab';
import BatchPredictTab from './components/BatchPredictTab';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [presets, setPresets] = useState(null);

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

    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      <main className="container" style={{ flex: 1, marginTop: '1.5rem' }}>
        {activeTab === 'predict' && <PredictorTab presets={presets} />}
        {activeTab === 'simulate' && <SimulatorTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'domain' && <DomainGenTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'batch' && <BatchPredictTab />}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-card)', background: 'rgba(11, 23, 40, 0.95)', padding: '1.5rem 0', marginTop: 'auto', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <div className="container">
          <p>
            <strong>Student Success Prediction & Early-Warning AI System</strong> • MCA Final-Year Project
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Synthetic 200,000 Cohort • Leakage-Safe Feature Engineering • Tuned Random Forest & Stacking Fusion
          </p>
        </div>
      </footer>
    </div>
  );
}
