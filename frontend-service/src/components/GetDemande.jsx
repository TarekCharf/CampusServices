import React, { useState } from 'react';
import demandeService from '../services/demandeService';
import { FormError } from './shared/FormError';
import { applyApiErrors } from '../utils/apiErrors';

export default function GetDemande() {
  const [numero, setNumero] = useState('');
  const [demande, setDemande] = useState(null);
  const [errors, setErrors] = useState({});

  // Adaptateur pour que applyApiErrors fonctionne avec useState
  const handleSetError = (field, errorObj) => {
    setErrors((prev) => {
      if (field === 'root.server') {
        return { ...prev, root: { server: errorObj } };
      }
      return { ...prev, [field]: errorObj };
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setDemande(null);
    setErrors({});

    if (!numero.trim()) {
      handleSetError('numero', { type: 'manual', message: 'Veuillez saisir un numéro de demande.' });
      return;
    }

    try {
      const response = await demandeService.getDemande(numero.trim());
      setDemande(response.data);
    } catch (err) {
      // Récupère automatiquement "Demande introuvable" (HTTP 404) ou l'erreur serveur
      applyApiErrors(err, handleSetError, ['numero']);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Consulter le suivi d'une demande</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: D-101, D-104..."
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
        />
        <button type="submit" className="btn">Rechercher</button>
      </form>

      {/* Affiche l'erreur de saisie locale (champ vide) */}
      <FormError error={errors.numero} />

      {/* Affiche l'erreur renvoyée par FastAPI ("Demande introuvable" ou serveur éteint) */}
      <FormError error={errors.root?.server} />

      {demande && (
        <div className="card" style={{ background: '#f8fafc', marginTop: '1rem' }}>
          <h3>Détails du dossier {demande.num}</h3>
          <p><strong>Étudiant :</strong> {demande.etudiant_num}</p>
          <p><strong>Type :</strong> {demande.type_demande}</p>
          <p><strong>État actuel :</strong> <span className="badge">{demande.etat}</span></p>
          <p><strong>Dernière modification :</strong> {demande.date_derniere_modification}</p>
        </div>
      )}
    </div>
  );
}