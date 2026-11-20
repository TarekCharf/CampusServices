import React, { useState, useEffect } from 'react';

// Chronologie réelle extraite du journal d'événements Jira (19 nov. 18h32 -> 20 nov. 16h28)
// Périmètre initial : 17 pts (CP-3: 2, CP-4: 4->3, CP-8: 3->4, CP-5: 3, CP-11: 2, CP-6: 3)
// Ajouts en cours de sprint : CP-12 (2 pts), CP-13 (2 pts) -> Périmètre final : 21 pts (8 tickets)
const TIMELINE_EVENTS_S2 = [
  {
    time: '19 Nov 18h32',
    minutesFromStart: 0,
    eventTitle: 'Démarrage du Sprint 2 (Périmètre initial : 17 pts)',
    description: 'CP-3 (liste agent) et CP-8 (persistance SQLite) entrent dans "En cours" (WIP = 2/2). CP-4, CP-5, CP-11 et CP-6 attendent dans "Prêt".',
    decision: 'Prioriser le socle de lecture et la base SQLite avant les mutations de statut (respect WIP = 2/2).',
    totalCards: 6,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'En cours', points: 2, startMin: 0, endMin: null },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'En cours', points: 3, startMin: 0, endMin: null },
      { id: 'CP-4', title: 'Traiter une demande', status: 'Prêt', points: 4, startMin: null, endMin: null },
      { id: 'CP-5', title: 'Documenter une décision', status: 'Prêt', points: 3, startMin: null, endMin: null },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'Prêt', points: 2, startMin: null, endMin: null },
      { id: 'CP-6', title: 'Filtrer par état', status: 'Prêt', points: 3, startMin: null, endMin: null },
    ]
  },
  {
    time: '19 Nov 18h37',
    minutesFromStart: 5,
    eventTitle: 'CP-3 résolu (2 / 17 pts) & démarrage de CP-4',
    description: 'Endpoint GET /api/agent/demandes validé : CP-3 passe dans "Terminé" (5 min). CP-4 entre immédiatement dans "En cours" (WIP = 2/2 avec CP-8).',
    decision: 'Flux tiré : une place libérée dans "En cours" permet de tirer CP-4.',
    totalCards: 6,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'Terminé', points: 2, startMin: 0, endMin: 5 },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'En cours', points: 3, startMin: 0, endMin: null },
      { id: 'CP-4', title: 'Traiter une demande', status: 'En cours', points: 4, startMin: 5, endMin: null },
      { id: 'CP-5', title: 'Documenter une décision', status: 'Prêt', points: 3, startMin: null, endMin: null },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'Prêt', points: 2, startMin: null, endMin: null },
      { id: 'CP-6', title: 'Filtrer par état', status: 'Prêt', points: 3, startMin: null, endMin: null },
    ]
  },
  {
    time: '19 Nov 19h15',
    minutesFromStart: 43,
    eventTitle: 'CP-4 résolu (7 / 17 pts) & démarrage de CP-5',
    description: 'Cycle de vie PATCH /api/agent/demandes/{num} validé (TA04 & TA08) : CP-4 passe dans "Terminé" (38 min). CP-5 entre dans "En cours" (WIP = 2/2).',
    decision: 'Enchaîner avec CP-5 (motif de refus obligatoire) qui dépend directement de CP-4.',
    totalCards: 6,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'Terminé', points: 2, startMin: 0, endMin: 5 },
      { id: 'CP-4', title: 'Traiter une demande', status: 'Terminé', points: 4, startMin: 5, endMin: 43 },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'En cours', points: 3, startMin: 0, endMin: null },
      { id: 'CP-5', title: 'Documenter une décision', status: 'En cours', points: 3, startMin: 43, endMin: null },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'Prêt', points: 2, startMin: null, endMin: null },
      { id: 'CP-6', title: 'Filtrer par état', status: 'Prêt', points: 3, startMin: null, endMin: null },
    ]
  },
  {
    time: '19 Nov 20h15',
    minutesFromStart: 103,
    eventTitle: '⚠️ CP-8 résolu (9 / 17 pts) & régulation WIP sur CP-5',
    description: 'Persistance SQLite validée (TA07) : CP-8 passe dans "Terminé" (103 min). CP-5 passe dans "À vérifier" (1/1) et CP-11 entre dans "En cours".',
    decision: 'Limite À vérifier (1/1) respectée : vérification de TA05 sur CP-5 avant de tirer CP-6.',
    totalCards: 6,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'Terminé', points: 2, startMin: 0, endMin: 5 },
      { id: 'CP-4', title: 'Traiter une demande', status: 'Terminé', points: 4, startMin: 5, endMin: 43 },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'Terminé', points: 3, startMin: 0, endMin: 103 },
      { id: 'CP-5', title: 'Documenter une décision', status: 'À vérifier', points: 3, startMin: 43, endMin: null },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'En cours', points: 2, startMin: 103, endMin: null },
      { id: 'CP-6', title: 'Filtrer par état', status: 'Prêt', points: 3, startMin: null, endMin: null },
    ]
  },
  {
    time: '19 Nov 20h27',
    minutesFromStart: 115,
    eventTitle: 'CP-5 résolu (12 / 17 pts) & démarrage de CP-6',
    description: 'Test TA05 validé : CP-5 passe dans "Terminé" (72 min). CP-6 entre dans "En cours" aux côtés de CP-11 (WIP = 2/2).',
    decision: 'Finaliser les 2 dernières User Stories du périmètre initial.',
    totalCards: 6,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'Terminé', points: 2, startMin: 0, endMin: 5 },
      { id: 'CP-4', title: 'Traiter une demande', status: 'Terminé', points: 4, startMin: 5, endMin: 43 },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'Terminé', points: 3, startMin: 0, endMin: 103 },
      { id: 'CP-5', title: 'Documenter une décision', status: 'Terminé', points: 3, startMin: 43, endMin: 115 },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'En cours', points: 2, startMin: 103, endMin: null },
      { id: 'CP-6', title: 'Filtrer par état', status: 'En cours', points: 3, startMin: 115, endMin: null },
    ]
  },
  {
    time: '19 Nov 20h28',
    minutesFromStart: 116,
    eventTitle: 'CP-11 résolu (14 / 17 pts) — Retour Revue Sprint 1 intégré',
    description: 'Affichage du motif de refus dans le suivi étudiant validé : CP-11 passe dans "Terminé" (13 min). CP-6 reste seul En cours (WIP = 1/2).',
    decision: 'Critère issu de la Revue Sprint 1 vérifié avec succès.',
    totalCards: 6,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'Terminé', points: 2, startMin: 0, endMin: 5 },
      { id: 'CP-4', title: 'Traiter une demande', status: 'Terminé', points: 4, startMin: 5, endMin: 43 },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'Terminé', points: 3, startMin: 0, endMin: 103 },
      { id: 'CP-5', title: 'Documenter une décision', status: 'Terminé', points: 3, startMin: 43, endMin: 115 },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'Terminé', points: 2, startMin: 103, endMin: 116 },
      { id: 'CP-6', title: 'Filtrer par état', status: 'En cours', points: 3, startMin: 115, endMin: null },
    ]
  },
  {
    time: '19 Nov 20h40',
    minutesFromStart: 128,
    eventTitle: 'CP-6 résolu (17/17 pts) & Ajout de CP-12 et CP-13 (→ 21 pts)',
    description: 'Filtre par état validé (TA06, 13 min). Les tâches techniques CP-12 (UI Agent, 2 pts) et CP-13 (Dashboard Kanban S2, 2 pts) sont ajoutées et tirées "En cours" (WIP = 2/2).',
    decision: 'Périmètre étendu à 21 pts (8 tickets) après livraison complète des 6 User Stories.',
    totalCards: 8,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'Terminé', points: 2, startMin: 0, endMin: 5 },
      { id: 'CP-4', title: 'Traiter une demande', status: 'Terminé', points: 4, startMin: 5, endMin: 43 },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'Terminé', points: 3, startMin: 0, endMin: 103 },
      { id: 'CP-5', title: 'Documenter une décision', status: 'Terminé', points: 3, startMin: 43, endMin: 115 },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'Terminé', points: 2, startMin: 103, endMin: 116 },
      { id: 'CP-6', title: 'Filtrer par état', status: 'Terminé', points: 3, startMin: 115, endMin: 128 },
      { id: 'CP-12', title: "Adapter l'interface utilisateur", status: 'En cours', points: 2, startMin: 128, endMin: null },
      { id: 'CP-13', title: 'Ajouter le dashboard Kanban S2', status: 'En cours', points: 2, startMin: 128, endMin: null },
    ]
  },
  {
    time: '20 Nov 16h00',
    minutesFromStart: 1288,
    eventTitle: 'CP-12 résolu (19 / 21 pts) & CP-13 en vérification',
    description: 'Vues Agent React (ListeDemande, TraiterDemande, modale de refus, ApiDocs v0.2) validées (TR03). CP-13 passe dans "À vérifier" (1/1).',
    decision: 'Vérifier les 4 métriques Kanban de CP-13 (TR04) avant la clôture.',
    totalCards: 8,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'Terminé', points: 2, startMin: 0, endMin: 5 },
      { id: 'CP-4', title: 'Traiter une demande', status: 'Terminé', points: 4, startMin: 5, endMin: 43 },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'Terminé', points: 3, startMin: 0, endMin: 103 },
      { id: 'CP-5', title: 'Documenter une décision', status: 'Terminé', points: 3, startMin: 43, endMin: 115 },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'Terminé', points: 2, startMin: 103, endMin: 116 },
      { id: 'CP-6', title: 'Filtrer par état', status: 'Terminé', points: 3, startMin: 115, endMin: 128 },
      { id: 'CP-12', title: "Adapter l'interface utilisateur", status: 'Terminé', points: 2, startMin: 128, endMin: 1288 },
      { id: 'CP-13', title: 'Ajouter le dashboard Kanban S2', status: 'À vérifier', points: 2, startMin: 128, endMin: null },
    ]
  },
  {
    time: '20 Nov 16h28',
    minutesFromStart: 1316,
    eventTitle: '🏁 Fin du Sprint 2 (Release v0.2) — 100 % des tickets livrés (21 / 21 pts)',
    description: 'CP-13 résolu à 16h26 et réajustement final des estimations (CP-8 → 4 pts, CP-4 → 3 pts, total maintenu à 21 pts). Clôture officielle à 16h28.',
    decision: 'Incrément v0.2 complet prêt pour la Sprint Review 2 et la soutenance.',
    totalCards: 8,
    cards: [
      { id: 'CP-3', title: 'Consulter les demandes', status: 'Terminé', points: 2, startMin: 0, endMin: 5 },
      { id: 'CP-4', title: 'Traiter une demande', status: 'Terminé', points: 3, startMin: 5, endMin: 43 },
      { id: 'CP-8', title: 'Retrouver les demandes (SQLite)', status: 'Terminé', points: 4, startMin: 0, endMin: 103 },
      { id: 'CP-5', title: 'Documenter une décision', status: 'Terminé', points: 3, startMin: 43, endMin: 115 },
      { id: 'CP-11', title: 'Consulter le motif de refus', status: 'Terminé', points: 2, startMin: 103, endMin: 116 },
      { id: 'CP-6', title: 'Filtrer par état', status: 'Terminé', points: 3, startMin: 115, endMin: 128 },
      { id: 'CP-12', title: "Adapter l'interface utilisateur", status: 'Terminé', points: 2, startMin: 128, endMin: 1288 },
      { id: 'CP-13', title: 'Ajouter le dashboard Kanban S2', status: 'Terminé', points: 2, startMin: 128, endMin: 1314 },
    ]
  }
];

const COLUMNS = [
  { name: 'Prêt', limit: null },
  { name: 'En cours', limit: 2 },
  { name: 'À vérifier', limit: 1 },
  { name: 'Terminé', limit: null }
];

// Formate les minutes écoulées depuis le démarrage réel (19 Nov 18h32)
const formatClock = (mins) => {
  if (mins === null) return '-';
  const baseMinutes = 18 * 60 + 32 + mins;
  const dayOffset = Math.floor(baseMinutes / (24 * 60));
  const dayLabel = dayOffset === 0 ? '19 Nov' : '20 Nov';
  const remMins = baseMinutes % (24 * 60);
  const h = String(Math.floor(remMins / 60)).padStart(2, '0');
  const m = String(remMins % 60).padStart(2, '0');
  return `${dayLabel} ${h}h${m}`;
};

// Formate une durée en minutes ou heures+minutes si > 60 min
const formatDuration = (mins) => {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${String(m).padStart(2, '0')}m`;
};

export default function DashboardSprint2() {
  const [stepIndex, setStepIndex] = useState(TIMELINE_EVENTS_S2.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSnapshot = TIMELINE_EVENTS_S2[stepIndex];
  const cards = currentSnapshot.cards;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= TIMELINE_EVENTS_S2.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePlayToggle = () => {
    if (!isPlaying && stepIndex === TIMELINE_EVENTS_S2.length - 1) {
      setStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Calcul dynamique des 4 mesures Kanban à l'instant t
  const openCards = cards.filter(c => c.status === 'En cours' || c.status === 'À vérifier');
  const completedCards = cards.filter(c => c.status === 'Terminé');

  const wipCount = openCards.length;
  const debitCount = completedCards.length;

  const avgCycleTime = completedCards.length
    ? Math.round(completedCards.reduce((acc, c) => acc + (c.endMin - c.startMin), 0) / completedCards.length)
    : 0;

  const maxAge = openCards.length
    ? Math.max(...openCards.map(c => currentSnapshot.minutesFromStart - c.startMin))
    : 0;

  return (
    <div>
      {/* En-tête et contrôles de simulation du cycle de sprint */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>Cycle Réel du Sprint 2 — Simulation Chronologique</h2>
            <span className="badge" style={{ fontSize: '0.9rem' }}>🕒 Instant : {currentSnapshot.time}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="btn btn-sm"
              style={{ background: '#475569' }}
              disabled={stepIndex === 0 || isPlaying}
              onClick={() => setStepIndex(s => s - 1)}
            >
              ◀ Précédent
            </button>

            <button
              className="btn btn-sm"
              style={{ background: isPlaying ? '#dc2626' : '#16a34a', minWidth: '150px' }}
              onClick={handlePlayToggle}
            >
              {isPlaying ? '⏸ Pause' : '▶ Rejouer le sprint'}
            </button>

            <button
              className="btn btn-sm"
              style={{ background: '#475569' }}
              disabled={stepIndex === TIMELINE_EVENTS_S2.length - 1 || isPlaying}
              onClick={() => setStepIndex(s => s + 1)}
            >
              Suivant ▶
            </button>
          </div>
        </div>

        {/* Barre de progression des jalons horaires */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '4px', flexWrap: 'wrap' }}>
          {TIMELINE_EVENTS_S2.map((ev, idx) => (
            <button
              key={ev.time}
              onClick={() => { setIsPlaying(false); setStepIndex(idx); }}
              style={{
                flex: 1,
                minWidth: '82px',
                padding: '0.4rem 0.25rem',
                fontSize: '0.73rem',
                fontWeight: idx === stepIndex ? '700' : '400',
                background: idx <= stepIndex ? 'var(--primary)' : '#e2e8f0',
                color: idx <= stepIndex ? 'white' : 'var(--text-dark)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {ev.time}
            </button>
          ))}
        </div>

        {/* Journal de l'événement significatif à cet instant */}
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem',
          borderRadius: '6px',
          background: currentSnapshot.time === '19 Nov 20h15' ? '#fef3c7' : '#f1f5f9',
          borderLeft: `4px solid ${currentSnapshot.time === '19 Nov 20h15' ? '#d97706' : 'var(--primary)'}`
        }}>
          <strong>{currentSnapshot.eventTitle} :</strong> {currentSnapshot.description}
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <strong>Décision Kanban :</strong> {currentSnapshot.decision}
          </div>
        </div>
      </div>

      {/* 4 Mesures Kanban recalculées dynamiquement */}
      <div className="kanban-metrics">
        <div className="metric-box">
          <div>WIP (Cartes actives)</div>
          <div className="metric-value">{wipCount}</div>
        </div>
        <div className="metric-box">
          <div>Débit (Terminées)</div>
          <div className="metric-value">{debitCount} / {currentSnapshot.totalCards}</div>
        </div>
        <div className="metric-box">
          <div>Temps de cycle moyen</div>
          <div className="metric-value">{formatDuration(avgCycleTime)}</div>
        </div>
        <div className="metric-box">
          <div>Âge max carte ouverte</div>
          <div className="metric-value">{formatDuration(maxAge)}</div>
        </div>
      </div>

      {/* Colonnes Kanban */}
      <div className="kanban-board">
        {COLUMNS.map(col => {
          const colCards = cards.filter(c => c.status === col.name);
          const isFull = col.limit !== null && colCards.length === col.limit;
          const isOverLimit = col.limit !== null && colCards.length > col.limit;

          return (
            <div key={col.name} className="kanban-col">
              <div className="kanban-col-header">
                <span>{col.name}</span>
                {col.limit !== null && (
                  <span
                    className={`wip-limit ${isOverLimit ? 'wip-exceeded' : ''}`}
                    style={isFull ? { background: '#fef3c7', color: '#b45309', fontWeight: 'bold' } : {}}
                  >
                    {colCards.length} / {col.limit}
                  </span>
                )}
              </div>

              {colCards.map(card => {
                const cycleDuration = card.endMin !== null ? card.endMin - card.startMin : null;
                const currentAge = card.startMin !== null && card.endMin === null
                  ? currentSnapshot.minutesFromStart - card.startMin
                  : null;

                return (
                  <div
                    key={card.id}
                    className="kanban-card"
                    style={{
                      borderLeftColor: card.status === 'À vérifier' ? '#d97706' : card.status === 'Terminé' ? '#16a34a' : 'var(--primary)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>{card.id}</strong>
                      <span>{card.points} pts</span>
                    </div>
                    <div style={{ fontWeight: 600, margin: '0.4rem 0' }}>{card.title}</div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Début : {formatClock(card.startMin)} {card.endMin !== null && `| Fin : ${formatClock(card.endMin)}`}
                    </div>

                    {cycleDuration !== null && (
                      <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginTop: '0.2rem' }}>
                        ✓ Temps de cycle : {formatDuration(cycleDuration)}
                      </div>
                    )}

                    {currentAge !== null && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                        ⏱ Âge ouvert : {formatDuration(currentAge)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}