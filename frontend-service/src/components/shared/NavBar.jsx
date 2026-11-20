import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import demandeService from '../../services/demandeService';

export default function Navbar() {
  const [jiraOpen, setJiraOpen] = useState(false);
  const [etudiantOpen, setEtudiantOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleReset = async () => {
    if (!window.confirm("Voulez-vous vraiment réinitialiser les données et ne garder que D-101, D-102 et D-103 ?")) {
      return;
    }

    setLoadingReset(true);
    try {
      await demandeService.resetDemande();
      
      // Réinitialisation du stockage navigateur (Sprint 1)
      localStorage.removeItem('campus_demandes');
      
      toast.success("Données réinitialisées (D-101 à D-103 conservées) !");
    } catch (err) {
      toast.error("Erreur lors de la réinitialisation du serveur.");
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">CampusServices v0.2</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        <li 
          className="dropdown" 
          onMouseEnter={() => setDashboardOpen(true)} 
          onMouseLeave={() => setDashboardOpen(false)}
        >
          <button className="dropdown-btn" onClick={() => setDashboardOpen(!dashboardOpen)}>
            Dashboard Kanban ▾
          </button>
          {dashboardOpen && (
            <div className="dropdown-menu">
              <Link to="/dashboardSprint1">Sprint 1</Link>
              <Link to="/dashboardSprint2">Sprint 2</Link>
            </div>
          )}
        </li>

        <li 
          className="dropdown" 
          onMouseEnter={() => setEtudiantOpen(true)} 
          onMouseLeave={() => setEtudiantOpen(false)}
        >
          <button className="dropdown-btn" onClick={() => setEtudiantOpen(!etudiantOpen)}>
            Espace Étudiants ▾
          </button>
          {etudiantOpen && (
            <div className="dropdown-menu">
              <Link to="/creer-demande">Déposer demande</Link>
              <Link to="/suivi-demande">Suivre demande</Link>
            </div>
          )}
        </li>

        <li><Link to="/liste-demande">Espace Agent</Link></li>
        
        <li 
          className="dropdown" 
          onMouseEnter={() => setJiraOpen(true)} 
          onMouseLeave={() => setJiraOpen(false)}
        >
          <button className="dropdown-btn" onClick={() => setJiraOpen(!jiraOpen)}>
            Jira ▾
          </button>
          {jiraOpen && (
            <div className="dropdown-menu">
              <a href="https://tarekcharf5656.atlassian.net/jira/software/projects/CP/boards/40/backlog" target="_blank" rel="noreferrer">
                📋 Product Backlog
              </a>
              <a href="https://tarekcharf5656.atlassian.net/jira/software/projects/CP/boards/40?filter=&groupBy=none" target="_blank" rel="noreferrer">
                📊 Tableau Kanban Jira
              </a>
            </div>
          )}
        </li>

        <li><Link to="/api-docs">API Docs</Link></li>

        <li>
          <button 
            onClick={handleReset} 
            disabled={loadingReset}
            className="btn btn-sm"
            style={{ backgroundColor: '#dc2626', color: 'white', marginLeft: '0.5rem' }}
          >
            {loadingReset ? 'Reset...' : '🔄 Réinitialiser'}
          </button>
        </li>
      </ul>
    </nav>
  );
}