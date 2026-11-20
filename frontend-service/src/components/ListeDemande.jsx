import { useEffect, useState } from "react";
import demandeService from "../services/demandeService";
import { applyApiErrors } from "../utils/apiErrors";
import { FormError } from "./shared/FormError";
import { useNavigate } from "react-router-dom";
import { BADGE_CLASSES } from "../utils/badgeClasses";

export default function ListeDemande() {
  const [etat, setEtat] = useState("");
  const [demandes, setDemandes] = useState([]);
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
    const fetchDemandes = async () => {
    try {
      const response = await demandeService.listDemande(etat);
      setDemandes(response.data);
    } catch (err) {
      applyApiErrors(err, handleSetError);
    }};
    fetchDemandes();
  }, [etat]);

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Liste des demandes</h1>
      <div className="form-group">
        <label htmlFor="filtre-etat">Filtrer par état</label>
        <select
          id="filtre-etat"
          className="form-control"
          value={etat}
          onChange={(e) => setEtat(e.target.value)}
        >
          <option value="">Tous les états</option>
          <option value="Reçue">Reçue</option>
          <option value="En traitement">En traitement</option>
          <option value="Validée">Validée</option>
          <option value="Refusée">Refusée</option>
        </select>
      </div>
      {demandes.length === 0 && !errors.root?.server ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
          Aucune demande trouvée pour cet état.
        </p>
      ) : (
      demandes.map((demande) => (
        <div key={demande.num} className="card" style={{ background: '#f8fafc', marginTop: '1rem' }}>
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
          {demande.etat !== 'Validée' && demande.etat !== 'Refusée' ? (
            <button
            className="btn btn-primary"
            onClick={() => navigate(`/traiter-demande/${demande.num}`)}
          >
            Traiter la demande
          </button>
          ) : (
            <button
            className="btn btn-disabled"
            disabled
          >
            La demande est déjà traitée.
          </button>
          )}
        </div>
      ))
    )}
      <FormError error={errors.root?.server} />
    </div>
  );
}