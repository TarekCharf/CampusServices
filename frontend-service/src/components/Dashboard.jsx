import React, { useState, useEffect } from 'react';

// Chronologie réelle extraite du journal d'événements Jira (16 nov. 15h54 -> 16 nov. 17h46)
const TIMELINE_EVENTS = [
  {
    time: '16 Nov 15h54',
    minutesFromStart: 0,
    eventTitle: 'Démarrage du Sprint 1 (Périmètre initial : 7 pts)',
    description: 'CP-1 et CP-2 entrent dans "En cours" (WIP = 2/2). CP-7 attend dans "Prêt".',
    decision: 'Respect strict de la capacité initiale (max 2 cartes En cours).',
    totalCards: 3,
    cards: [
      { id: 'CP-1', title: 'Déposer une demande', status: 'En cours', points: 3, startMin: 0, endMin: null },
      { id: 'CP-2', title: 'Consulter le suivi', status: 'En cours', points: 2, startMin: 0, endMin: null },
      { id: 'CP-7', title: 'Éviter une demande invalide', status: 'Prêt', points: 2, startMin: null, endMin: null },
    ]
  },
  {
    time: '16 Nov 16h55',
    minutesFromStart: 61,
    eventTitle: 'CP-1 passe en vérification (TA01)',
    description: 'Développement de POST /api/demandes achevé. CP-1 entre dans "À vérifier" (1/1) et libère une place En cours.',
    decision: 'Exécution du test TA01 sur CP-1 et tirage de CP-7 dans "En cours" (17h04).',
    totalCards: 3,
    cards: [
      { id: 'CP-1', title: 'Déposer une demande', status: 'À vérifier', points: 3, startMin: 0, endMin: null },
      { id: 'CP-2', title: 'Consulter le suivi', status: 'En cours', points: 2, startMin: 0, endMin: null },
      { id: 'CP-7', title: 'Éviter une demande invalide', status: 'Prêt', points: 2, startMin: null, endMin: null },
    ]
  },
  {
    time: '16 Nov 17h04',
    minutesFromStart: 70,
    eventTitle: 'CP-1 résolu (3 pts) & démarrage de CP-7',
    description: 'TA01 validé : CP-1 passe dans "Terminé" (70 min). CP-7 entre immédiatement dans "En cours" (WIP = 2/2 avec CP-2).',
    decision: 'Périmètre réalisé : 3 / 7 pts.',
    totalCards: 3,
    cards: [
      { id: 'CP-1', title: 'Déposer une demande', status: 'Terminé', points: 3, startMin: 0, endMin: 70 },
      { id: 'CP-2', title: 'Consulter le suivi', status: 'En cours', points: 2, startMin: 0, endMin: null },
      { id: 'CP-7', title: 'Éviter une demande invalide', status: 'En cours', points: 2, startMin: 70, endMin: null },
    ]
  },
  {
    time: '16 Nov 17h16',
    minutesFromStart: 82,
    eventTitle: 'CP-2 et CP-7 résolus (7 / 7 pts atteints)',
    description: 'Tests TA02 et TA03 validés : CP-2 (82 min) et CP-7 (12 min) passent dans "Terminé".',
    decision: 'Tout le périmètre backend initial est livré.',
    totalCards: 3,
    cards: [
      { id: 'CP-1', title: 'Déposer une demande', status: 'Terminé', points: 3, startMin: 0, endMin: 70 },
      { id: 'CP-2', title: 'Consulter le suivi', status: 'Terminé', points: 2, startMin: 0, endMin: 82 },
      { id: 'CP-7', title: 'Éviter une demande invalide', status: 'Terminé', points: 2, startMin: 70, endMin: 82 },
    ]
  },
  {
    time: '16 Nov 17h17',
    minutesFromStart: 83,
    eventTitle: 'Ajout au sprint : CP-9 et CP-10 (Périmètre → 13 pts)',
    description: 'Les tâches techniques UI React (CP-9, 3 pts) et Dashboard Kanban (CP-10, 3 pts) sont ajoutées et tirées "En cours" (WIP = 2/2).',
    decision: 'Estimation mise à jour à 17h22 (+6 pts). Aucune autre carte tirée.',
    totalCards: 5,
    cards: [
      { id: 'CP-1', title: 'Déposer une demande', status: 'Terminé', points: 3, startMin: 0, endMin: 70 },
      { id: 'CP-2', title: 'Consulter le suivi', status: 'Terminé', points: 2, startMin: 0, endMin: 82 },
      { id: 'CP-7', title: 'Éviter une demande invalide', status: 'Terminé', points: 2, startMin: 70, endMin: 82 },
      { id: 'CP-9', title: 'Créer une interface utilisateur', status: 'En cours', points: 3, startMin: 83, endMin: null },
      { id: 'CP-10', title: 'Intégrer un dashboard Kanban', status: 'En cours', points: 3, startMin: 83, endMin: null },
    ]
  },
  {
    time: '16 Nov 17h44',
    minutesFromStart: 110,
    eventTitle: '⚠️ Règle WIP appliquée (Colonne "À vérifier" pleine 1/1)',
    description: 'CP-9 passe dans "À vérifier" (1/1). CP-10 est prêt à être vérifié mais patiente 1 min dans "En cours" pour respecter la limite WIP.',
    decision: 'Clôturer TR01 (CP-9) avant de basculer CP-10 en vérification.',
    totalCards: 5,
    cards: [
      { id: 'CP-1', title: 'Déposer une demande', status: 'Terminé', points: 3, startMin: 0, endMin: 70 },
      { id: 'CP-2', title: 'Consulter le suivi', status: 'Terminé', points: 2, startMin: 0, endMin: 82 },
      { id: 'CP-7', title: 'Éviter une demande invalide', status: 'Terminé', points: 2, startMin: 70, endMin: 82 },
      { id: 'CP-9', title: 'Créer une interface utilisateur', status: 'À vérifier', points: 3, startMin: 83, endMin: null },
      { id: 'CP-10', title: 'Intégrer un dashboard Kanban', status: 'En cours', points: 3, startMin: 83, endMin: null, blocked: true },
    ]
  },
  {
    time: '16 Nov 17h45',
    minutesFromStart: 111,
    eventTitle: 'CP-9 résolu (10 pts) & CP-10 en vérification',
    description: 'CP-9 passe dans "Terminé" (28 min). CP-10 entre aussitôt dans "À vérifier" (1/1) pour exécution du test TR02.',
    decision: 'Vérification finale du tableau Kanban.',
    totalCards: 5,
    cards: [
      { id: 'CP-1', title: 'Déposer une demande', status: 'Terminé', points: 3, startMin: 0, endMin: 70 },
      { id: 'CP-2', title: 'Consulter le suivi', status: 'Terminé', points: 2, startMin: 0, endMin: 82 },
      { id: 'CP-7', title: 'Éviter une demande invalide', status: 'Terminé', points: 2, startMin: 70, endMin: 82 },
      { id: 'CP-9', title: 'Créer une interface utilisateur', status: 'Terminé', points: 3, startMin: 83, endMin: 111 },
      { id: 'CP-10', title: 'Intégrer un dashboard Kanban', status: 'À vérifier', points: 3, startMin: 83, endMin: null },
    ]
  },
  {
    time: '16 Nov 17h46',
    minutesFromStart: 112,
    eventTitle: '🏁 Fin du Sprint 1 (Release v0.1) — 100 % des tickets livrés',
    description: 'CP-10 passe dans "Terminé" (29 min). Toutes les cartes du sprint (5 tickets / 13 Story Points) sont achevées et testées.',
    decision: 'Incrément v0.1 prêt pour la Sprint Review et tagué sur Git.',
    totalCards: 5,
    cards: [
      { id: 'CP-1', title: 'Déposer une demande', status: 'Terminé', points: 3, startMin: 0, endMin: 70 },
      { id: 'CP-2', title: 'Consulter le suivi', status: 'Terminé', points: 2, startMin: 0, endMin: 82 },
      { id: 'CP-7', title: 'Éviter une demande invalide', status: 'Terminé', points: 2, startMin: 70, endMin: 82 },
      { id: 'CP-9', title: 'Créer une interface utilisateur', status: 'Terminé', points: 3, startMin: 83, endMin: 111 },
      { id: 'CP-10', title: 'Intégrer un dashboard Kanban', status: 'Terminé', points: 3, startMin: 83, endMin: 112 },
    ]
  }
];

const COLUMNS = [
  { name: 'Prêt', limit: null },
  { name: 'En cours', limit: 2 },
  { name: 'À vérifier', limit: 1 },
  { name: 'Terminé', limit: null }
];

// Formate les minutes écoulées depuis le démarrage réel (16 Nov 15h54)
const formatClock = (mins) => {
  if (mins === null) return '-';
  const totalMins = 15 * 60 + 54 + mins;
  const h = String(Math.floor(totalMins / 60)).padStart(2, '0');
  const m = String(totalMins % 60).padStart(2, '0');
  return `16 Nov ${h}h${m}`;
};

export default function Dashboard() {
  const [stepIndex, setStepIndex] = useState(TIMELINE_EVENTS.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSnapshot = TIMELINE_EVENTS[stepIndex];
  const cards = currentSnapshot.cards;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= TIMELINE_EVENTS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePlayToggle = () => {
    if (!isPlaying && stepIndex === TIMELINE_EVENTS.length - 1) {
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
            <h2 style={{ marginBottom: '0.25rem' }}>Cycle Réel du Sprint 1 — Simulation Chronologique</h2>
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
              disabled={stepIndex === TIMELINE_EVENTS.length - 1 || isPlaying}
              onClick={() => setStepIndex(s => s + 1)}
            >
              Suivant ▶
            </button>
          </div>
        </div>

        {/* Barre de progression des jalons horaires */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '4px', flexWrap: 'wrap' }}>
          {TIMELINE_EVENTS.map((ev, idx) => (
            <button
              key={ev.time}
              onClick={() => { setIsPlaying(false); setStepIndex(idx); }}
              style={{
                flex: 1,
                minWidth: '75px',
                padding: '0.4rem 0.2rem',
                fontSize: '0.75rem',
                fontWeight: idx === stepIndex ? '700' : '400',
                background: idx <= stepIndex ? 'var(--primary)' : '#e2e8f0',
                color: idx <= stepIndex ? 'white' : 'var(--text-dark)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {ev.time.replace('16 Nov ', '')}
            </button>
          ))}
        </div>

        {/* Journal de l'événement significatif à cet instant */}
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem',
          borderRadius: '6px',
          background: currentSnapshot.time === '16 Nov 17h44' ? '#fef3c7' : '#f1f5f9',
          borderLeft: `4px solid ${currentSnapshot.time === '16 Nov 17h44' ? '#d97706' : 'var(--primary)'}`
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
          <div className="metric-value">{avgCycleTime} min</div>
        </div>
        <div className="metric-box">
          <div>Âge max carte ouverte</div>
          <div className="metric-value">{maxAge} min</div>
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
                      borderLeftColor: card.blocked ? '#d97706' : card.status === 'Terminé' ? '#16a34a' : 'var(--primary)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>{card.id}</strong>
                      <span>{card.points} pts</span>
                    </div>
                    <div style={{ fontWeight: 600, margin: '0.4rem 0' }}>{card.title}</div>

                    {card.blocked && (
                      <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 600, marginBottom: '0.3rem' }}>
                        ⏳ En attente (Vérification pleine 1/1)
                      </div>
                    )}

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Début : {formatClock(card.startMin)} {card.endMin !== null && `| Fin : ${formatClock(card.endMin)}`}
                    </div>

                    {cycleDuration !== null && (
                      <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginTop: '0.2rem' }}>
                        ✓ Temps de cycle : {cycleDuration} min
                      </div>
                    )}

                    {currentAge !== null && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                        ⏱ Âge ouvert : {currentAge} min
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