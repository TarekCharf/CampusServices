function collectMessages(err) {
  if (!err || typeof err !== 'object') return [];

  if (typeof err.message === 'string' && err.message) {
    return err.message.split('\n');
  }

  return Object.entries(err)
    .filter(([key]) => key !== 'ref' && key !== 'type' && key !== 'types')
    .flatMap(([, value]) => collectMessages(value));
}

// Déstructuration { error } corrigée ici
export function FormError({ error }) {
  const messages = [...new Set(collectMessages(error))];
  if (!messages.length) return null;

  return messages.length === 1 ? (
    <p className="alert alert-error" role="alert">{messages[0]}</p>
  ) : (
    <ul className="alert alert-error list-disc pl-4" role="alert">
      {messages.map((m, i) => (
        <li key={i}>{m}</li>
      ))}
    </ul>
  );
}