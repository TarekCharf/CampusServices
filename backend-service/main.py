from fastapi import FastAPI, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from models import DemandeCreate, DemandeResponse, DemandeUpdate, EtatDemande
from data import get_connection, init_db, reset_db
from datetime import datetime

app = FastAPI(title="CampusServices API - Sprint 2", version="0.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation de la base SQLite au démarrage du serveur
init_db()

etudiant_router = APIRouter(prefix="/api/etudiant", tags=["Espace Étudiant"])
agent_router = APIRouter(prefix="/api/agent", tags=["Espace Agent"])

# Route pour gérer les demandes des étudiants

@etudiant_router.post("/demandes", response_model=DemandeResponse, status_code=status.HTTP_201_CREATED)
def creer_demande(demande: DemandeCreate):
    """CP-1 & CP-7 : Déposer une demande avec validation des champs et énumérations"""
    conn = get_connection()
    cursor = conn.cursor()

    # Calculer le prochain numéro D-10X disponible en base
    cursor.execute("SELECT num FROM demandes")
    existing_nums = {row["num"] for row in cursor.fetchall()}

    counter = len(existing_nums) + 1
    numero = f"D-10{counter}"
    while numero in existing_nums:
        counter += 1
        numero = f"D-10{counter}"

    now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    etat_initial = EtatDemande.recue.value
    type_val = demande.type_demande.value if hasattr(demande.type_demande, "value") else demande.type_demande

    cursor.execute("""
        INSERT INTO demandes (num, etudiant_num, type_demande, etat, date_derniere_modification, motif_refus)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (numero, demande.etudiant_num, type_val, etat_initial, now, None))
    conn.commit()

    cursor.execute("SELECT * FROM demandes WHERE num = ?", (numero,))
    created = dict(cursor.fetchone())
    conn.close()
    return created

@etudiant_router.get("/demandes/{numero}", response_model=DemandeResponse, status_code=status.HTTP_200_OK)
def consulter_suivi(numero: str):
    """CP-2 : Consulter le suivi par numéro de demande"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM demandes WHERE num = ?", (numero,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demande introuvable"
        )
    return dict(row)

# Routes pour gérer les demandes des agents

@agent_router.get("/demandes", response_model=list[DemandeResponse], status_code=status.HTTP_200_OK)
def lister_demandes(etat: EtatDemande | None = None):
    """CP-3 (US03) : Consulter toutes les demandes"""
    conn = get_connection()
    cursor = conn.cursor()
    if etat is not None:
        cursor.execute("SELECT * FROM demandes WHERE etat = ? ORDER BY num ASC", (etat.value,))
    else:
        cursor.execute("SELECT * FROM demandes ORDER BY num ASC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

@agent_router.get("/demandes/{numero}", response_model=DemandeResponse, status_code=status.HTTP_202_ACCEPTED)
def consulter_demande(numero: str):
    """CP-4 : Traiter une demande(en traitement)"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM demandes WHERE num = ?", (numero,))
    row = cursor.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demande introuvable"
        )
    if dict(row)["etat"] not in EtatDemande.recue.value:
        return dict(row)
    
    now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    cursor.execute("""
        UPDATE demandes
        SET etat = ?, date_derniere_modification = ?
        WHERE num = ?
    """, (EtatDemande.en_traitement.value, now, numero))
    conn.commit()

    cursor.execute("SELECT * FROM demandes WHERE num = ?", (numero,))
    updated = dict(cursor.fetchone())
    conn.close()
    return updated

@agent_router.patch("/demandes/{numero}", response_model=DemandeResponse, status_code=status.HTTP_200_OK)
def traiter_demande(numero: str, payload: DemandeUpdate):
    """CP-4 : Traiter une demande"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM demandes WHERE num = ?", (numero,))
    row = cursor.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demande introuvable"
        )

    demande_actuelle = dict(row)

    if demande_actuelle["etat"] not in (EtatDemande.recue.value, EtatDemande.en_traitement.value):
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Demande déjà traitée"
        )

    if payload.etat not in (EtatDemande.refuse, EtatDemande.valide):
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="État de la demande invalide"
        )

    if payload.etat == EtatDemande.refuse and not payload.motif_refus:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Motif de refus requis"
        )

    now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    cursor.execute("""
        UPDATE demandes
        SET etat = ?, date_derniere_modification = ?, motif_refus = ?
        WHERE num = ?
    """, (payload.etat.value, now, payload.motif_refus, numero))
    conn.commit()

    cursor.execute("SELECT * FROM demandes WHERE num = ?", (numero,))
    updated = dict(cursor.fetchone())
    conn.close()
    return updated

#Shared Routes

@app.post("/api/reset", status_code=status.HTTP_200_OK)
def reinitialiser_donnees():
    """Réinitialise la base avec uniquement les 3 demandes de départ (D-101, D-102, D-103)"""
    reset_db()
    return {"message": "Données réinitialisées avec succès", "count": 3}

app.include_router(etudiant_router)
app.include_router(agent_router)