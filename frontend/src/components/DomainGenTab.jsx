import React, { useState, useEffect } from 'react';
import { Globe2, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function DomainGenTab() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getLeaderboard();
        setLeaderboard(res);
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe2 size={22} color="#38bdf8" />
          Held-Out Institution Domain Generalization
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Assesses whether the machine learning model can generalize to completely unseen academic environments without learning institutional bias.
        </p>
      </div>

      {/* Domain Split Diagram */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0e1d35, #122849)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>Source Domain</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Institutions 0 to 7</h3>
          <p style={{ fontSize: '0.8125rem', color: '#93c5fd', marginTop: '0.25rem' }}>
            160,084 synthetic training students
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.5rem' }}>
            *Institution ID dropped from training features
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid var(--border-card)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Zero-Shot Cross-Campus Transfer <ArrowRight size={16} color="#38bdf8" />
          </div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Held-Out Target Domain</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Institutions 8 & 9</h3>
          <p style={{ fontSize: '0.8125rem', color: '#6ee7b7', marginTop: '0.25rem' }}>
            39,916 test students (Strictly Unseen)
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.5rem' }}>
            Evaluates distribution shift resilience
          </span>
        </div>
      </div>

      {/* Domain Results Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-card)', background: 'var(--bg-card-subtle)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            Held-Out Target Domain Evaluation Metrics
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Target Evaluation</th>
                <th>MAE</th>
                <th>RMSE</th>
                <th>R² Generalization</th>
                <th>Train Records</th>
                <th>Test Records</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard && leaderboard.domain_generalization ? (
                leaderboard.domain_generalization.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#38bdf8' }}>{item.model}</td>
                    <td>{item.evaluation}</td>
                    <td>{item.MAE.toFixed(3)}</td>
                    <td style={{ fontWeight: 600 }}>{item.RMSE.toFixed(3)}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>{(item.R2 * 100).toFixed(1)}%</td>
                    <td>{item.train_rows.toLocaleString()}</td>
                    <td>{item.test_rows.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading domain generalization benchmark results...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ethics & Viva Discussion */}
      <div className="card" style={{ background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={18} />
          Academic Viva & Ethical Interpretation
        </h4>
        <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          <strong>Why is this important?</strong> Traditional ML models often overfit to campus-specific features (e.g. strictness of grading, localized syllabus pacing). By explicitly holding out entire institutions and withholding the institution ID, we verify that learned relationships (study habits, attendance, deadline discipline) transfer robustly to new academic settings.
        </p>
      </div>
    </div>
  );
}
