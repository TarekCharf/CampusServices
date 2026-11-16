import api from "./api";

const demandeService = {
  createDemande: (data) => api.post('/demandes/', data),
  getDemande: (id) => api.get(`/demandes/${id}/`),
  resetDemande: () => api.post('/reset/')
};
export default demandeService;