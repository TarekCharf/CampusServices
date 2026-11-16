from datetime import datetime
from models import TypeDemande, EtatDemande

# Jeu de données initial structuré selon tes modèles (Section 3 du sujet)[cite: 3]
def get_initial_demandes():
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "D-101": {
            "num": "D-101",
            "etudiant_num": "MAT-101",
            "type_demande": "Scolarité",
            "etat": "Reçue",
            "date_derniere_modification": now
        },
        "D-102": {
            "num": "D-102",
            "etudiant_num": "MAT-102",
            "type_demande": "Réussite",
            "etat": "Reçue",
            "date_derniere_modification": now
        },
        "D-103": {
            "num": "D-103",
            "etudiant_num": "MAT-103",
            "type_demande": "Scolarité",
            "etat": "Validée",
            "date_derniere_modification": now
        }
    }

demandes_db = get_initial_demandes()