import React, { useState } from 'react';
import demandeService from '../services/demandeService';
import toast from 'react-hot-toast';
import { FormError } from './shared/FormError';
import { applyApiErrors } from '../utils/apiErrors';

export default function CreateDemande() {
  const [etudiantNum, setEtudiantNum] = useState('');
  const [typeDemande, setTypeDemande] = useState('Scolarité');
  const [resultat, setResultat] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultat(null);
    setErrors({});

    try {
      // Avec Axios, si la requête réussit (201 Created), on récupère directement response.data
      const response = await demandeService.createDemande({
        etudiant_num: etudiantNum,
        type_demande: typeDemande
      });

      const data = response.data;
      toast.success('Demande créée avec succès !');

      // Stockage navigateur (Sprint 1)
      const historique = JSON.parse(localStorage.getItem('campus_demandes') || '[]');
      localStorage.setItem('campus_demandes', JSON.stringify([...historique, data]));

      setResultat(data);
      setEtudiantNum('');
    } catch (err) {
      // On passe bien "err" (l'erreur attrapée) et notre adaptateur handleSetError
      applyApiErrors(err, handleSetError, ['etudiant_num', 'type_demande']);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Déposer une demande d'attestation</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Identifiant Étudiant (ex: MAT-001)</label>
          <input
            type="text"
            className="form-control"
            placeholder="MAT-001"
            value={etudiantNum}
            onChange={(e) => setEtudiantNum(e.target.value)}
          />
          {/* Affiche l'erreur spécifique du champ etudiant_num */}
          <FormError error={errors.etudiant_num} />
        </div>

        <div className="form-group">
          <label>Type d'attestation</label>
          <select
            className="form-control"
            value={typeDemande}
            onChange={(e) => setTypeDemande(e.target.value)}
          >
            <option value="Scolarité">Scolarité</option>
            <option value="Réussite">Réussite</option>
          </select>
          {/* Affiche l'erreur spécifique du champ type_demande */}
          <FormError error={errors.type_demande} />
        </div>

        <button type="submit" className="btn">Soumettre la demande</button>
      </form>

      {/* Affiche les erreurs globales du serveur (ex: serveur éteint) */}
      <FormError error={errors.root?.server} />

      {resultat && (
        <div className="alert alert-success">
          ✅ Demande créée avec succès !<br />
          <strong>Numéro unique :</strong> {resultat.num} <br />
          <strong>État :</strong> <span className="badge">{resultat.etat}</span>
        </div>
      )}
    </div>
  );
}