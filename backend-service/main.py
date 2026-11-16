from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from models import DemandeCreate, DemandeResponse, EtatDemande
from data import demandes_db, get_initial_demandes
from datetime import datetime

app = FastAPI(title="CampusServices API - Sprint 1", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/demandes", response_model=DemandeResponse, status_code=status.HTTP_201_CREATED)
def creer_demande(demande: DemandeCreate):
    """US01 & US07 : Déposer une demande avec validation des champs et énumérations"""
    counter = len(demandes_db) + 1
    numero = f"D-10{counter}"
    while numero in demandes_db:
        counter += 1
        numero = f"D-10{counter}"
    
    nouvelle_demande = {
        "num": numero,
        "etudiant_num": demande.etudiant_num,
        "type_demande": demande.type_demande,
        "etat": EtatDemande.recue,  # État initial par défaut R1
        "date_derniere_modification": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    demandes_db[numero] = nouvelle_demande
    return nouvelle_demande

@app.get("/api/demandes/{numero}", response_model=DemandeResponse, status_code=status.HTTP_200_OK)
def consulter_suivi(numero: str):
    """US02 : Consulter le suivi par numéro de demande"""
    if numero not in demandes_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demande introuvable"
        )
    return demandes_db[numero]


@app.post("/api/reset", status_code=status.HTTP_200_OK)
def reinitialiser_donnees():
    """Réinitialise la base avec uniquement les 3 demandes de départ (D-101, D-102, D-103)"""
    global demandes_db
    demandes_db = get_initial_demandes()
    return {"message": "Données réinitialisées avec succès", "count": len(demandes_db)}