import React, { useState, useEffect } from 'react';

// Chronologie exacte du Sprint 1 (J1 09h00 -> J1 11h00)
const TIMELINE_EVENTS = [
  {
    time: 'J1 09h00',
    minutesFromStart: 0,
    eventTitle: 'Démarrage du Sprint 1',
    description: 'CP-1 entre dans "En cours". Les autres cartes sont prêtes dans le backlog du sprint.',
    decision: 'Respect de la capacité initiale (WIP = 1/2).',
    cards: [
      { id: 'CP-1', title: 'Déposer une demande (US01)', status: 'En cours', points: 3, startMin: 0, endMin: null },
      { id: 'CP-7', title: 'Éviter demande invalide (US07)', status: 'Prêt', points: 2, startMin: null, endMin: null },
      { id: 'CP-2', title: 'Consulter le suivi (US02)', status: 'Prêt', points: 2, startMin: null, endMin: null },
      { id: 'CP-9', title: 'Interface Utilisateur React', status: 'Prêt', points: 3, startMin: null, endMin: null },
      { id: 'CP-10', title: 'Dashboard Kanban Dynamique', status: 'Prêt', points: 2, startMin: null, endMin: null },
    ]
  },
  {
    time: 'J1 09h20',
    minutesFromStart: 20,
    eventTitle: 'CP-1 prêt pour vérification & lancement CP-7',
    description: 'CP-1 passe dans "À vérifier" (1/1). CP-7 est tirée dans "En cours" (1/2).',
    decision: 'Exécution du test d’acceptation TA01 sur CP-1.',
    cards: [
      { id: 'CP-1', title: 'Déposer une demande (US01)', status: 'À vérifier', points: 3, startMin: 0, endMin: null },
      { id: 'CP-7', title: 'Éviter demande invalide (US07)', status: 'En cours', points: 2, startMin: 15, endMin: null },
      { id: 'CP-2', title: 'Consulter le suivi (US02)', status: 'Prêt', points: 2, startMin: null, endMin: null },
      { id: 'CP-9', title: 'Interface Utilisateur React', status: 'Prêt', points: 3, startMin: null, endMin: null },
      { id: 'CP-10', title: 'Dashboard Kanban Dynamique', status: 'Prêt', points: 2, startMin: null, endMin: null },
    ]
  },
  {
    time: 'J1 09h35',
    minutesFromStart: 35,
    eventTitle: 'CP-1 Terminé & ajustement validateur CP-7',
    description: 'TA01 validé (CP-1 Terminé en 25 min). CP-7 passe en vérification (1/1) après correction du validateur regex MAT-000.',
    decision: 'Vérification TA02 lancée sur CP-7.',
    cards: [
      { id: 'CP-1', title: 'Déposer une demande (US01)', status: 'Terminé', points: 3, startMin: 0, endMin: 25 },
      { id: 'CP-7', title: 'Éviter demande invalide (US07)', status: 'À vérifier', points: 2, startMin: 15, endMin: null },
      { id: 'CP-2', title: 'Consulter le suivi (US02)', status: 'Prêt', points: 2, startMin: null, endMin: null },
      { id: 'CP-9', title: 'Interface Utilisateur React', status: 'Prêt', points: 3, startMin: null, endMin: null },
      { id: 'CP-10', title: 'Dashboard Kanban Dynamique', status: 'Prêt', points: 2, startMin: null, endMin: null },
    ]
  },
  {
    time: 'J1 09h55',
    minutesFromStart: 55,
    eventTitle: 'CP-7 Terminé & CP-2 en vérification',
    description: 'CP-7 est terminé (25 min). CP-2 a été développé et entre dans "À vérifier" (1/1).',
    decision: 'Exécution de TA03 (recherche dossier existant + Z-999).',
    cards: [
      { id: 'CP-1', title: 'Déposer une demande (US01)', status: 'Terminé', points: 3, startMin: 0, endMin: 25 },
      { id: 'CP-7', title: 'Éviter demande invalide (US07)', status: 'Terminé', points: 2, startMin: 15, endMin: 40 },
      { id: 'CP-2', title: 'Consulter le suivi (US02)', status: 'À vérifier', points: 2, startMin: 40, endMin: null },
      { id: 'CP-9', title: 'Interface Utilisateur React', status: 'Prêt', points: 3, startMin: null, endMin: null },
      { id: 'CP-10', title: 'Dashboard Kanban Dynamique', status: 'Prêt', points: 2, startMin: null, endMin: null },
    ]
  },
  {
    time: 'J1 10h25',
    minutesFromStart: 85,
    eventTitle: 'Parcours Backend terminé — Développement Frontend en parallèle',
    description: 'Toutes les US métier sont terminées. CP-9 et CP-10 sont simultanément "En cours" (WIP max = 2/2 atteint).',
    decision: 'Aucune nouvelle carte tirée tant qu’une place ne se libère.',
    cards: [
      { id: 'CP-1', title: 'Déposer une demande (US01)', status: 'Terminé', points: 3, startMin: 0, endMin: 25 },
      { id: 'CP-7', title: 'Éviter demande invalide (US07)', status: 'Terminé', points: 2, startMin: 15, endMin: 40 },
      { id: 'CP-2', title: 'Consulter le suivi (US02)', status: 'Terminé', points: 2, startMin: 40, endMin: 60 },
      { id: 'CP-9', title: 'Interface Utilisateur React', status: 'En cours', points: 3, startMin: 60, endMin: null },
      { id: 'CP-10', title: 'Dashboard Kanban Dynamique', status: 'En cours', points: 2, startMin: 85, endMin: null },
    ]
  },
  {
    time: 'J1 10h35',
    minutesFromStart: 95,
    eventTitle: '⚠️ Règle WIP appliquée (Colonne "À vérifier" pleine)',
    description: 'CP-9 passe dans "À vérifier" (1/1). CP-10 est prêt à être testé mais reste bloqué en "En cours" car la vérification est pleine.',
    decision: 'Priorité donnée à la clôture de CP-9 avant de déplacer CP-10.',
    cards: [
      { id: 'CP-1', title: 'Déposer une demande (US01)', status: 'Terminé', points: 3, startMin: 0, endMin: 25 },
      { id: 'CP-7', title: 'Éviter demande invalide (US07)', status: 'Terminé', points: 2, startMin: 15, endMin: 40 },
      { id: 'CP-2', title: 'Consulter le suivi (US02)', status: 'Terminé', points: 2, startMin: 40, endMin: 60 },
      { id: 'CP-9', title: 'Interface Utilisateur React', status: 'À vérifier', points: 3, startMin: 60, endMin: null },
      { id: 'CP-10', title: 'Dashboard Kanban Dynamique', status: 'En cours', points: 2, startMin: 85, endMin: null, blocked: true },
    ]
  },
  {
    time: 'J1 10h40',
    minutesFromStart: 100,
    eventTitle: 'Déblocage du flux : CP-10 passe en vérification',
    description: 'CP-9 est validé et passe dans "Terminé" (35 min). La place en vérification se libère pour CP-10 (1/1).',
    decision: 'Vérification des métriques et de la timeline sur CP-10.',
    cards: [
      { id: 'CP-1', title: 'Déposer une demande (US01)', status: 'Terminé', points: 3, startMin: 0, endMin: 25 },
      { id: 'CP-7', title: 'Éviter demande invalide (US07)', status: 'Terminé', points: 2, startMin: 15, endMin: 40 },
      { id: 'CP-2', title: 'Consulter le suivi (US02)', status: 'Terminé', points: 2, startMin: 40, endMin: 60 },
      { id: 'CP-9', title: 'Interface Utilisateur React', status: 'Terminé', points: 3, startMin: 60, endMin: 95 },
      { id: 'CP-10', title: 'Dashboard Kanban Dynamique', status: 'À vérifier', points: 2, startMin: 85, endMin: null },
    ]
  },
  {
    time: 'J1 11h00',
    minutesFromStart: 120,
    eventTitle: '🏁 Clôture du Sprint 1 (Release v0.1)',
    description: 'CP-10 est terminé (35 min). Toutes les cartes du sprint sont livrées et testées.',
    decision: 'Incrément v0.1 prêt pour la Sprint Review.',
    cards: [
      { id: 'CP-1', title: 'Déposer une demande (US01)', status: 'Terminé', points: 3, startMin: 0, endMin: 25 },
      { id: 'CP-7', title: 'Éviter demande invalide (US07)', status: 'Terminé', points: 2, startMin: 15, endMin: 40 },
      { id: 'CP-2', title: 'Consulter le suivi (US02)', status: 'Terminé', points: 2, startMin: 40, endMin: 60 },
      { id: 'CP-9', title: 'Interface Utilisateur React', status: 'Terminé', points: 3, startMin: 60, endMin: 95 },
      { id: 'CP-10', title: 'Dashboard Kanban Dynamique', status: 'Terminé', points: 2, startMin: 85, endMin: 120 },
    ]
  }
];

const COLUMNS = [
  { name: 'Prêt', limit: null },
  { name: 'En cours', limit: 2 },
  { name: 'À vérifier', limit: 1 },
  { name: 'Terminé', limit: null }
];

// Utilitaire pour formater les minutes depuis 09h00 en heure lisible (ex: 25 -> "09h25")
const formatClock = (mins) => {
  if (mins === null) return '-';
  const totalMins = 9 * 60 + mins;
  const h = String(Math.floor(totalMins / 60)).padStart(2, '0');
  const m = String(totalMins % 60).padStart(2, '0');
  return `J1 ${h}h${m}`;
};

export default function Dashboard() {
  const [stepIndex, setStepIndex] = useState(TIMELINE_EVENTS.length - 1); // Par défaut à la fin du sprint (11h00)
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSnapshot = TIMELINE_EVENTS[stepIndex];
  const cards = currentSnapshot.cards;

  // Lecture automatique de l'historique du sprint
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
    }, 2000); // Avance toutes les 2 secondes

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePlayToggle = () => {
    if (!isPlaying && stepIndex === TIMELINE_EVENTS.length - 1) {
      setStepIndex(0); // Redémarre depuis 09h00 si on était déjà à la fin
    }
    setIsPlaying(!isPlaying);
  };

  // Calcul dynamique des 4 mesures Kanban à l'instant t
  const openCards = cards.filter(c => c.status === 'En cours' || c.status === 'À vérifier');
  const completedCards = cards.filter(c => c.status === 'Terminé');

  const wipCount = openCards.length;
  const debitCount = completedCards.length;

  const avgCycleTime = completedCards.length
    ? (completedCards.reduce((acc, c) => acc + (c.endMin - c.startMin), 0) / completedCards.length).toFixed(0)
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
            <h2 style={{ marginBottom: '0.25rem' }}>Cycle du Sprint 1 — Simulation Chronologique</h2>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '4px' }}>
          {TIMELINE_EVENTS.map((ev, idx) => (
            <button
              key={ev.time}
              onClick={() => { setIsPlaying(false); setStepIndex(idx); }}
              style={{
                flex: 1,
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
              {ev.time.replace('J1 ', '')}
            </button>
          ))}
        </div>

        {/* Journal de l'événement significatif à cet instant */}
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem',
          borderRadius: '6px',
          background: currentSnapshot.time === 'J1 10h35' ? '#fef3c7' : '#f1f5f9',
          borderLeft: `4px solid ${currentSnapshot.time === 'J1 10h35' ? '#d97706' : 'var(--primary)'}`
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
          <div className="metric-value">{debitCount} / 5</div>
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