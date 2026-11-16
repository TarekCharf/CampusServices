# CampusServices - Gestion des demandes d'attestation (Version v0.1 - Sprint 1)

Service web de dépôt et de suivi des demandes d'attestation développé dans le cadre du module **Développement Agile (Scrum & Kanban)**.

## 1. Objectif de la version v0.1 (Sprint 1)
Permettre à un **étudiant** de :
* **CP-1 (US01) :** Déposer une demande d'attestation (types *Scolarité* ou *Réussite*) avec un identifiant fictif au format `MAT-000` et recevoir un numéro unique avec l'état initial « Reçue ».
* **CP-7 (US07) :** Éviter l'enregistrement d'une demande invalide (champ obligatoire manquant, format d'identifiant incorrect ou type d'attestation non admis).
* **CP-2 (US02) :** Consulter le suivi d'une demande à partir de son numéro unique (ou afficher un message d'erreur clair si le numéro est introuvable).
* **CP-9 (CP-9) :** Fournir une interface utilisateur React modulaire avec navigation fluide (formulaires, documentation API intégrée, raccourcis Jira) et bouton de réinitialisation rapide.
* **CP-10 (CP-10) :** Intégrer un Dashboard Kanban dynamique simulant le cycle chronologique du Sprint 1 (respect des limites WIP et calcul temps réel des 4 métriques : WIP, Débit, Temps de cycle, Âge).

---

## 2. Pile technique et stockage
* **Backend :** Python 3 / FastAPI (validation via Pydantic).
* **Frontend :** React (JavaScript).
* **Mode de stockage (v0.1) :** Stockage en mémoire côté API (dictionnaire initialisé au démarrage) et stockage navigateur côté client. *(La persistance sur base de données SQLite sera intégrée lors du Sprint 2 / v0.2).*

---

## 3. Procédure d'installation et de lancement

### Prérequis
* Python 3.9 ou supérieur
* Node.js et npm (pour l'interface React)

### Lancement du Backend (FastAPI)
1. Ouvrez un terminal et placez-vous dans le dossier `backend` :
   ```bash
   cd backend
   ```
2. Créez et activez l'environnement virtuel :
   * **Sous Windows (PowerShell) :**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate
     ```
   * **Sous Linux / macOS :**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Installez les dépendances depuis le fichier `requirements.txt` :
   ```bash
   pip install -r requirements.txt
   ```
4. Démarrez le serveur d'API :
   ```bash
   uvicorn main:app --reload
   ```
   * L'API est accessible à l'adresse : `http://127.0.0.1:8000`
   * La documentation interactive Swagger UI est disponible sur : `http://127.0.0.1:8000/docs`

### Lancement du Frontend (React)
1. Ouvrez un second terminal et placez-vous dans le dossier `frontend` :
   ```bash
   cd frontend
   ```
2. Installez les dépendances et lancez l'application :
   ```bash
   npm install
   npm start
   ```
   * L'interface utilisateur est accessible sur `http://localhost:5173`.

---

## 4. Jeu de données initial et Réinitialisation

### Jeu de données de départ
Conformément aux spécifications de test du cahier des charges, l'application démarre systématiquement avec les 3 demandes suivantes pré-enregistrées :

| Numéro de demande | Identifiant étudiant | Type d'attestation | État initial |
| :--- | :--- | :--- | :--- |
| **D-101** | `MAT-101` | Scolarité | Reçue |
| **D-102** | `MAT-102` | Réussite | Reçue |
| **D-103** | `MAT-103` | Scolarité | Validée |

*Note : Toute nouvelle demande créée reçoit automatiquement un numéro unique incrémenté (à partir de `D-104`).*

### Méthode de réinitialisation
Pour remettre l'application à son état initial (avec uniquement `D-101`, `D-102` et `D-103`) avant d'exécuter une nouvelle campagne de tests :
1. **Via l'interface web (Recommandé) :** Cliquez directement sur le bouton 🔄 Réinitialiser dans la barre de navigation. Cette action appelle l'endpoint POST /api/reset côté backend et vide automatiquement le LocalStorage du navigateur.

2. **Manuellement :** Redémarrez le serveur Uvicorn (`uvicorn main:app --reload`) et videz le LocalStorage depuis les outils de développement du navigateur ( `F12` > *Application* > *Local Storage* > *Clear*).

---

## 5. Tests d'acceptation couverts dans cette version
Cette version `v0.1` permet d'exécuter et de valider les trois premiers scénarios de test du cahier des charges :
* **TA01 (US01) :** Création d'une demande valide pour `MAT-001` (Scolarité) $\rightarrow$ Attribution d'un numéro unique (`D-104`) et état `Reçue`.
* **TA02 (US07) :** Tentatives de soumission sans identifiant ou avec un type invalide $\rightarrow$ Rejet par validation et stabilité du nombre de demandes.
* **TA03 (US02) :** Recherche du numéro créé (`D-104`) puis d'un numéro inconnu (`Z-999`) $\rightarrow$ Affichage de l'état exact pour `D-104` et du message *« Demande introuvable »* pour `Z-999`.
* **TR01 (CP-9) :** Vérification du routage React, des liens externes (Jira, Swagger UI) et de la réinitialisation complète (POST /api/reset + purge LocalStorage).
* **TR02 (CP-10) :** Validation de la simulation chronologique du Dashboard Kanban (J1 09h00 à 11h00), du respect de la limite WIP à 10h35 et du relevé final des 4 métriques (WIP = 0, Débit = 5/5, Cycle moyen = 27 min, Âge max = 0 min).