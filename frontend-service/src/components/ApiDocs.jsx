import React from 'react';

export default function ApiDocs() {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Documentation des Endpoints API (v0.1)</h2>
        <a 
          href="http://127.0.0.1:8000/docs" 
          target="_blank" 
          rel="noreferrer" 
          className="btn"
        >
          🚀 Ouvrir Swagger UI (FastAPI)
        </a>
      </div>

      <div className="card" style={{ background: '#f8fafc', marginBottom: '1rem' }}>
        <h3><span className="badge" style={{ background: '#dcfce7', color: '#16a34a' }}>POST</span> /api/demandes</h3>
        <p><strong>Objectif :</strong> Créer une nouvelle demande d'attestation (US01 & US07).</p>
        <p><strong>Corps JSON attendu :</strong></p>
        <pre style={{ background: '#1e293b', color: '#f8fafc', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem' }}>
{`{
  "etudiant_num": "MAT-001",
  "type_demande": "Scolarité" // ou "Réussite"
}`}
        </pre>
      </div>

      <div className="card" style={{ background: '#f8fafc' }}>
        <h3><span className="badge">GET</span> /api/demandes/{'{numero}'}</h3>
        <p><strong>Objectif :</strong> Consulter l'état d'avancement d'une demande existante (US02).</p>
        <p><strong>Exemple d'appel :</strong> <code>http://127.0.0.1:8000/api/demandes/D-101</code></p>
      </div>
    </div>
  );
}