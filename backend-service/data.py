import sqlite3
from datetime import datetime
from models import EtatDemande, TypeDemande

DB_NAME = "campus_services.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row  # Permet de convertir facilement chaque ligne en dict
    return conn

def init_db():
    """Crée la table demandes si elle n'existe pas et insère le jeu initial si la table est vide."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS demandes (
            num TEXT PRIMARY KEY,
            etudiant_num TEXT NOT NULL,
            type_demande TEXT NOT NULL,
            etat TEXT NOT NULL,
            date_derniere_modification TEXT NOT NULL,
            motif_refus TEXT
        )
    """)
    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM demandes")
    if cursor.fetchone()[0] == 0:
        seed_initial_data(conn)

    conn.close()

def seed_initial_data(conn=None):
    """Insère les 3 demandes initiales obligatoires (D-101, D-102, D-103)."""
    close_after = False
    if conn is None:
        conn = get_connection()
        close_after = True

    now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    initial_rows = [
        ("D-101", "MAT-001", TypeDemande.scolarite, EtatDemande.recue, now, None),
        ("D-102", "MAT-002", TypeDemande.reussite, EtatDemande.en_traitement, now, None),
        ("D-103", "MAT-003", TypeDemande.scolarite, EtatDemande.valide, now, None),
    ]

    cursor = conn.cursor()
    cursor.executemany("""
        INSERT INTO demandes (num, etudiant_num, type_demande, etat, date_derniere_modification, motif_refus)
        VALUES (?, ?, ?, ?, ?, ?)
    """, initial_rows)
    conn.commit()

    if close_after:
        conn.close()

def reset_db():
    """Vide la table et réinsère uniquement D-101, D-102 et D-103."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM demandes")
    conn.commit()
    seed_initial_data(conn)
    conn.close()