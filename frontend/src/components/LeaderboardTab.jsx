import React, { useState, useEffect } from 'react';
import { Trophy, Award, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function LeaderboardTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await api.getLeaderboard();
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load leaderboards.');
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  if (loading) {
    return <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#5F5070' }}>Loading benchmark leaderboards...</div>;
  }

  if (error) {
    return <div className="card" style={{ color: '#D9383A', background: '#FDE8E7', border: '1px solid #FCA5A5' }}>{error}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E152A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Trophy size={22} color="#D97706" />
            Model Leaderboard
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#68597A', margin: '0.25rem 0 0' }}>
            Performance benchmarks across trained regression & risk classification models.
          </p>
        </div>

        {/* Best Model Badges */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ background: '#FAF6FD', padding: '0.5rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #EADBFA' }}>
            <span style={{ fontSize: '0.7rem', color: '#68597A', display: 'block', fontWeight: 600 }}>Best Score Model</span>
            <strong style={{ fontSize: '0.85rem', color: '#501E7E' }}>{data.best_regression_model}</strong>
          </div>
          <div style={{ background: '#FAF6FD', padding: '0.5rem 0.85rem', borderRadius: '0.65rem', border: '1px solid #EADBFA' }}>
            <span style={{ fontSize: '0.7rem', color: '#68597A', display: 'block', fontWeight: 600 }}>Best Risk Model</span>
            <strong style={{ fontSize: '0.85rem', color: '#16A34A' }}>{data.best_classification_model}</strong>
          </div>
        </div>
      </div>

      {/* Regression & Classification Leaderboard Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Regression Leaderboard */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2D4F0', background: '#FAF6FD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
              Score Prediction Models
            </h3>
            <span className="badge badge-purple">Ranked by RMSE</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model Architecture</th>
                  <th>MAE</th>
                  <th>RMSE</th>
                  <th>R² Score</th>
                </tr>
              </thead>
              <tbody>
                {data.regression_models.map((m, idx) => {
                  const isTop = idx === 0;
                  return (
                    <tr key={m.model} style={{ background: isTop ? '#F4EDF9' : 'transparent' }}>
                      <td style={{ fontWeight: isTop ? 700 : 500, color: isTop ? '#501E7E' : '#1E152A' }}>
                        {isTop && '🥇 '}
                        {m.model}
                      </td>
                      <td>{m.MAE.toFixed(3)}</td>
                      <td style={{ fontWeight: 600 }}>{m.RMSE.toFixed(3)}</td>
                      <td>{(m.R2 * 100).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Classification Leaderboard */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2D4F0', background: '#FAF6FD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
              Academic Risk Detection
            </h3>
            <span className="badge badge-green">Ranked by F1-Score</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Classifier</th>
                  <th>F1 Score</th>
                  <th>ROC AUC</th>
                  <th>Recall</th>
                </tr>
              </thead>
              <tbody>
                {data.classification_models.map((m, idx) => {
                  const isTop = idx === 0;
                  return (
                    <tr key={m.model} style={{ background: isTop ? '#E6F8EE' : 'transparent' }}>
                      <td style={{ fontWeight: isTop ? 700 : 500, color: isTop ? '#16A34A' : '#1E152A' }}>
                        {isTop && '🏆 '}
                        {m.model}
                      </td>
                      <td style={{ fontWeight: 600 }}>{(m.F1 * 100).toFixed(1)}%</td>
                      <td>{(m.ROC_AUC * 100).toFixed(1)}%</td>
                      <td>{(m.Recall * 100).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
