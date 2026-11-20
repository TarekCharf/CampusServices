import { useEffect, useRef, useState } from "react";
import demandeService from "../services/demandeService";
import { useNavigate, useParams } from "react-router-dom";
import { FormError } from "./shared/FormError";
import { applyApiErrors } from "../utils/apiErrors";
import { BADGE_CLASSES } from "../utils/badgeClasses";

export default function TraiterDemande() {
  const dialogRef = useRef(null);
    
  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const {numDemande} = useParams();
  const [demande, setDemande] = useState();
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSetError = (field, errorObj) => {
    setErrors((prev) => {
      if (field === 'root.server') {
        return { ...prev, root: { server: errorObj } };
      }
      return { ...prev, [field]: errorObj };
    });
  };

  useEffect(() => {
    const fetchDemande = async () => {
    try {
      const response = await demandeService.consulterDemande(numDemande);
      setDemande(response.data);
    } catch (err) {
      applyApiErrors(err, handleSetError);
    }};
    fetchDemande();
  }, [numDemande]);

  const traiterDemande = async (etat, motif_refus = null) => {
    setErrors({});
    try {
      const response = await demandeService.traiterDemande(numDemande, etat, motif_refus);
      setDemande(response.data);
    } catch (err) {
      applyApiErrors(err, handleSetError);
    }
  };

  const closeModalRefus = async () => {
    const ok = await traiterDemande('Refusée', demande?.motif_refus || '');
    if (ok) closeModal();
  };

  return (
    <>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1>Traitement de la demande</h1>
        {demande && (
      <>
          <div className="card" style={{ background: '#f8fafc', marginTop: '1rem' }}>
            <h3>Détails du dossier {demande.num}</h3>
            <p><strong>Numéro :</strong> {demande.num}</p>
            <p><strong>Étudiant :</strong> {demande.etudiant_num}</p>
            <p><strong>Type :</strong> {demande.type_demande}</p>
            <p>
                <strong>État actuel :</strong>{" "}
                <span className={BADGE_CLASSES[demande.etat] || "badge"}>
                    {demande.etat}
                </span>
            </p>
            {demande.motif_refus && <p><strong>Motif du refus :</strong> {demande.motif_refus}</p>}
            <p><strong>Dernière modification :</strong> {demande.date_derniere_modification}</p>
          </div>

            {demande.etat !== 'Validée' && demande.etat !== 'Refusée' ? (
            <>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={() => traiterDemande('Validée', null)}>
              Valider la demande
            </button>
            <button className="btn btn-primary" onClick={openModal}>
              Refuser la demande
            </button>
          </div>

          <dialog
            ref={dialogRef}
            onClick={(e) => {
                if (e.target === dialogRef.current) closeModal();
            }}
            className="modal-dialog"
            >
            <div className="modal-body">
                <div className="modal-header">
                <h2>Refuser la demande {demande.num}</h2>
                <button
                    type="button"
                    className="modal-close"
                    onClick={closeModal}
                    aria-label="Fermer"
                >
                    ✕
                </button>
                </div>

                <div className="form-group">
                <label htmlFor="motif_refus">Motif du refus *</label>
                <textarea
                    id="motif_refus"
                    rows={3}
                    className="form-control"
                    value={demande.motif_refus || ""}
                    onChange={(e) => setDemande({ ...demande, motif_refus: e.target.value })}
                    placeholder="Précisez la raison du refus (ex : pièce justificative manquante)..."
                />
                <FormError error={errors.motif_refus} />
                <FormError error={errors.root?.server} />
                </div>

                <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Annuler
                </button>
                <button type="button" className="btn btn-danger" onClick={closeModalRefus}>
                    Confirmer le refus
                </button>
                </div>
            </div>
            </dialog>
          </>
          ) : (
            <button
            className="btn btn-disabled"
            disabled
          >
            La demande est déjà traitée.
          </button>
          )}
        </>
        )}
        
      <FormError error={errors.root?.server} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        <button
            type="button"
            className="btn"
            onClick={() => navigate('/liste-demande')}
        >
            Retour à la liste
        </button>
      </div>
      </>
    );
}