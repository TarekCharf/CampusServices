import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h1 style={{ marginBottom: 0 }}>Bienvenue sur CampusServices</h1>
        <span className="badge">v0.2 • Sprint 2 (SQLite)</span>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Plateforme de dépôt, de suivi et de traitement administratif des demandes d'attestation développée avec Scrum et Kanban.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* --- PARCOURS ÉTUDIANT --- */}
        <div className="card" style={{ background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3>🎓 Parcours Étudiant</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Déposez une nouvelle demande d'attestation (Scolarité ou Réussite) ou consultez l'état et le motif éventuel d'un dossier (CP-1, CP-2, CP-6, CP-7).
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link to="/creer-demande" className="btn" style={{ textDecoration: 'none' }}>
              Nouvelle demande
            </Link>
            <Link to="/suivi-demande" className="btn" style={{ background: '#475569', textDecoration: 'none' }}>
              Suivre un dossier
            </Link>
          </div>
        </div>

        {/* --- ESPACE AGENT --- */}
        <div className="card" style={{ background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3>🗂️ Espace Agent</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Consultez l'ensemble des demandes enregistrées en base SQLite, validez les dossiers conformes ou motivez un refus (CP-3, CP-4, CP-5, CP-8).
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link to="/liste-demande" className="btn" style={{ textDecoration: 'none' }}>
              Gérer les demandes
            </Link>
            <Link to="/api-docs" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              API Docs v0.2
            </Link>
          </div>
        </div>

        {/* --- PILOTAGE AGILE (KANBAN) --- */}
        <div className="card" style={{ background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3>⚙️ Pilotage Agile (Kanban)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Visualisez le flux Kanban, les limites WIP et les métriques de livraison des Sprints 1 et 2.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link to="/dashboardSprint2" className="btn" style={{ background: '#0f172a', textDecoration: 'none' }}>
              Dashboard Sprint 2
            </Link>
            <Link to="/dashboardSprint1" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Sprint 1
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}