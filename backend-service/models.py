from pydantic import BaseModel, Field, field_validator
from enum import Enum
import re

# Énumérations exigées
class TypeDemande(str, Enum):
    scolarite = "Scolarité"
    reussite = "Réussite"

class EtatDemande(str, Enum):
    recue = "Reçue"
    en_traitement = "En traitement"
    valide = "Validée"
    refuse = "Refusée"

# Modèle de données pour la création d'une demande
class DemandeCreate(BaseModel):
    etudiant_num: str = Field(..., description="Numéro de l'étudiant (identifiant fictif)")
    type_demande: TypeDemande

    @field_validator('etudiant_num')
    def valider_etudiant_num(cls, v):
        if not v or not v.strip():
            raise ValueError("L'identifiant étudiant est obligatoire.")
        if not re.match(r'^MAT-\d+$', v.strip()):
            raise ValueError("L'identifiant étudiant n'est pas au format correct (ex: MAT-001).")
        return v.strip()

    @field_validator('type_demande', mode='before')
    def valider_type_demande(cls, v):
        if not v:
            raise ValueError("Le type de demande est obligatoire.")
        if v not in TypeDemande:
            raise ValueError("Le type de demande est invalide.")
        return v

# Modèle de réponse complet (représentant l'entité Demande)
class DemandeResponse(BaseModel):
    num: str = Field(..., description="Numéro unique de la demande")
    etudiant_num: str
    type_demande: TypeDemande
    etat: EtatDemande
    date_derniere_modification: str