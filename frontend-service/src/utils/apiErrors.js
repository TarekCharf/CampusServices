export function getApiErrors(error) {
  const data = error?.response?.data;
  if (!data || typeof data !== 'object') return null;
  return data;
}

export function applyApiErrors(error, setError, fields = []) {
  const data = getApiErrors(error);

  // Pas de réponse exploitable (serveur éteint, erreur réseau, etc.)
  if (!data) {
    setError('root.server', {
      type: 'server',
      message: 'Impossible de contacter le serveur. Réessaie plus tard.',
    });
    return;
  }

  const globalMessages = [];

  // Cas 1 : Format standard FastAPI (clé "detail")
  if ('detail' in data) {
    if (Array.isArray(data.detail)) {
      // Erreurs de validation Pydantic (HTTP 422)
      data.detail.forEach((err) => {
        // Le nom du champ est le dernier élément de "loc" (ex: ["body", "etudiant_num"] -> "etudiant_num")
        const fieldName = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : null;
        
        // Nettoyage du préfixe "Value error, " ajouté automatiquement par Pydantic v2
        const cleanMsg = String(err.msg || 'Erreur de validation').replace(/^Value error,\s*/i, '');

        if (fieldName && fields.includes(fieldName)) {
          setError(fieldName, { type: 'server', message: cleanMsg });
        } else {
          globalMessages.push(cleanMsg);
        }
      });
    } else if (typeof data.detail === 'string') {
      // Erreur HTTPException classique (ex: HTTP 404 "Demande introuvable")
      globalMessages.push(data.detail);
    }
  } else {
    // Cas 2 : Fallback pour d'autres formats d'API (type Django)
    for (const [key, value] of Object.entries(data)) {
      const messages = Array.isArray(value) ? value.map(String) : [String(value)];
      if (fields.includes(key)) {
        setError(key, { type: 'server', message: messages.join('\n') });
      } else {
        globalMessages.push(...messages);
      }
    }
  }

  if (globalMessages.length > 0) {
    setError('root.server', { type: 'server', message: globalMessages.join('\n') });
  }
}