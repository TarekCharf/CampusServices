import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="card">
      <h1>Bienvenue sur CampusServices v0.1 (sprint 1)</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Service de gestion et de suivi des demandes d'attestation développé avec Scrum et Kanban.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ background: '#f8fafc' }}>
          <h3>🎓 Parcours Étudiant</h3>
          <p>Déposez une nouvelle demande d'attestation (Scolarité ou Réussite) ou suivez l'avancement d'un dossier existant.</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <Link to="/creer-demande" className="btn">Nouvelle demande</Link>
            <Link to="/suivi-demande" className="btn" style={{ background: '#475569' }}>Suivre un dossier</Link>
          </div>
        </div>

        <div className="card" style={{ background: '#f8fafc' }}>
          <h3>⚙️ Pilotage Agile (Kanban)</h3>
          <p>Visualisez l'avancement des User Stories du Sprint 1 (CP-1, CP-7, CP-2) et les métriques de flux.</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/dashboard" className="btn" style={{ background: '#0f172a' }}>Ouvrir le Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}