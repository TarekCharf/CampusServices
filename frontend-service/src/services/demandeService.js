import api from "./api";

const demandeService = {
  //etudiant
  createDemande: (data) => api.post('/etudiant/demandes/', data),
  getDemande: (id) => api.get(`/etudiant/demandes/${id}/`),

  //agent
  listDemande: (etat) => api.get(`/agent/demandes`, { params: etat ? { etat } : {} }),
  consulterDemande: (id) => api.get(`/agent/demandes/${id}/`),
  traiterDemande: (id, etat, motif_refus) => api.patch(`/agent/demandes/${id}/`, { etat, motif_refus }),

  //shared
  resetDemande: () => api.post('/reset/')
};
export default demandeService;