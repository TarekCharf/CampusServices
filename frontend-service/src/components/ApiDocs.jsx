import React from 'react';

export default function ApiDocs() {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Documentation des Endpoints API (v0.2)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            CampusServices API — Sprint 2 (OAS 3.1 • Persistance SQLite)
          </p>
        </div>
        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          🚀 Ouvrir Swagger UI (FastAPI)
        </a>
      </div>

      {/* --- ESPACE ÉTUDIANT --- */}
      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
        Espace Étudiant (<code>/api/etudiant</code>)
      </h3>

      <div className="card" style={{ background: '#f8fafc', marginBottom: '1rem' }}>
        <h3>
          <span className="badge" style={{ background: '#dcfce7', color: '#16a34a' }}>POST</span>{' '}
          /api/etudiant/demandes
        </h3>
        <p><strong>Objectif :</strong> Déposer une nouvelle demande d'attestation (CP-1 & CP-7).</p>
        <p><strong>Corps JSON attendu :</strong></p>
        <pre style={{ background: '#1e293b', color: '#f8fafc', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem', overflowX: 'auto' }}>
{`{
  "etudiant_num": "MAT-001",
  "type_demande": "Scolarité" // ou "Réussite"
}`}
        </pre>
      </div>

      <div className="card" style={{ background: '#f8fafc', marginBottom: '1.5rem' }}>
        <h3>
          <span className="badge">GET</span>{' '}
          /api/etudiant/demandes/{'{numero}'}
        </h3>
        <p><strong>Objectif :</strong> Consulter l'état d'avancement et le motif éventuel d'une demande (CP-2 & CP-6).</p>
        <p><strong>Exemple d'appel :</strong> <code>http://127.0.0.1:8000/api/etudiant/demandes/D-101</code></p>
      </div>

      {/* --- ESPACE AGENT --- */}
      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
        Espace Agent (<code>/api/agent</code>)
      </h3>

      <div className="card" style={{ background: '#f8fafc', marginBottom: '1rem' }}>
        <h3>
          <span className="badge">GET</span>{' '}
          /api/agent/demandes
        </h3>
        <p><strong>Objectif :</strong> Lister l'ensemble des demandes enregistrées en base SQLite (CP-3 & CP-8).</p>
        <p><strong>Exemple d'appel :</strong> <code>http://127.0.0.1:8000/api/agent/demandes</code></p>
      </div>

      <div className="card" style={{ background: '#f8fafc', marginBottom: '1rem' }}>
        <h3>
          <span className="badge">GET</span>{' '}
          /api/agent/demandes/{'{numero}'}
        </h3>
        <p><strong>Objectif :</strong> Consulter le détail complet d'un dossier avant traitement.</p>
        <p><strong>Exemple d'appel :</strong> <code>http://127.0.0.1:8000/api/agent/demandes/D-101</code></p>
      </div>

      <div className="card" style={{ background: '#f8fafc', marginBottom: '1.5rem' }}>
        <h3>
          <span className="badge" style={{ background: '#fef3c7', color: '#d97706' }}>PATCH</span>{' '}
          /api/agent/demandes/{'{numero}'}
        </h3>
        <p><strong>Objectif :</strong> Valider ou refuser une demande avec justification obligatoire en cas de refus (CP-4 & CP-5).</p>
        <p><strong>Corps JSON attendu :</strong></p>
        <pre style={{ background: '#1e293b', color: '#f8fafc', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem', overflowX: 'auto' }}>
{`// Validation :
{
  "etat": "Validée",
  "motif_refus": null
}

// Refus (motif obligatoire) :
{
  "etat": "Refusée",
  "motif_refus": "Justificatif d'inscription manquant"
}`}
        </pre>
      </div>

      {/* --- UTILITAIRES / ADMINISTRATION --- */}
      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
        Utilitaires & Tests
      </h3>

      <div className="card" style={{ background: '#f8fafc' }}>
        <h3>
          <span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>POST</span>{' '}
          /api/reset
        </h3>
        <p><strong>Objectif :</strong> Réinitialiser la base de données SQLite avec les 3 dossiers de référence (<code>D-101</code>, <code>D-102</code>, <code>D-103</code>).</p>
        <p><strong>Exemple d'appel :</strong> <code>http://127.0.0.1:8000/api/reset</code></p>
      </div>
    </div>
  );
}