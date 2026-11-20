# CampusServices - Gestion des demandes d'attestation (Version v0.2 - Sprint 2)

Service web de dépôt et de suivi des demandes d'attestation développé dans le cadre du module **Développement Agile (Scrum & Kanban)**.

## 1. Objectif de la version v0.2 (Sprint 2)

Cette version finalise l'ensemble des besoins fonctionnels du produit en couvrant les **parcours Étudiant et Agent** avec persistance locale des données[cite: 17, 20] :

### Parcours Étudiant (`/api/etudiant`)
* **CP-1 (US01) :** Déposer une demande d'attestation (types *Scolarité* ou *Réussite*) avec un identifiant fictif au format `MAT-000` et recevoir un numéro unique avec l'état initial « Reçue »[cite: 2, 18].
* **CP-7 (US07) :** Éviter l'enregistrement d'une demande invalide (champ obligatoire manquant, format d'identifiant incorrect ou type d'attestation non admis)[cite: 2, 18].
* **CP-2 (US02) :** Consulter le suivi d'une demande à partir de son numéro unique (ou afficher un message d'erreur clair « Demande introuvable » si le numéro est inconnu)[cite: 3, 18].
* **CP-11 *(Retour Sprint Review 1)* :** Visualiser le **motif exact du refus** directement sur la page de suivi étudiant lorsqu'une demande est refusée par un agent[cite: 6, 22].

### Parcours Agent & Persistance (`/api/agent`)
* **CP-3 (US03) :** Consulter la liste globale des demandes enregistrées (numéro, identifiant étudiant, type, état, date de modification)[cite: 3, 18].
* **CP-4 (US04) :** Faire évoluer l'état d'une demande selon le cycle de vie autorisé (`Reçue` $\rightarrow$ `En traitement` $\rightarrow$ `Validée` ou `Refusée`) et verrouiller toute transition sur les états finaux[cite: 4, 18, 19].
* **CP-5 (US05) :** Documenter chaque décision avec horodatage et exiger un **motif non vide** en cas de refus[cite: 4, 5, 18, 19].
* **CP-6 (US06) :** Filtrer la liste des demandes par état (`Reçue`, `En traitement`, `Validée`, `Refusée`)[cite: 5, 19].
* **CP-8 (US08) :** Assurer la persistance durable des demandes et de leurs modifications sur base de données locale **SQLite** (`campus_services.db`)[cite: 4, 19].

### Interface & Pilotage Agile
* **CP-9 & CP-12 :** Interface React modulaire intégrant les vues Étudiant, l'espace Agent (liste filtrable, traitement et modale de refus), la documentation API v0.2 et la réinitialisation rapide.
* **CP-10 & CP-13 :** Dashboards Kanban dynamiques simulant le cycle chronologique réel des **Sprints 1 et 2** (respect des limites WIP et calcul temps réel des 4 métriques : WIP, Débit, Temps de cycle, Âge)[cite: 14, 15, 21].

---

## 2. Pile technique et stockage
* **Backend :** Python 3 / FastAPI (architecture modulaire avec routeurs préfixés `/api/etudiant` et `/api/agent`, validation stricte via Pydantic).
* **Frontend :** React + Vite (JavaScript, routage via `react-router-dom`, feuille de style CSS native unifiée).
* **Mode de stockage (v0.2) :** Base de données relationnelle locale **SQLite** (`backend/campus_services.db`) garantissant la conservation des données après rechargement du navigateur ou redémarrage du serveur.

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

2. **Via Swagger UI / cURL :** Envoyez une requête POST http://127.0.0.1:8000/api/reset.

---

## 5. Tests d'acceptation couverts dans cette version
Cette version `v0.2` valide l'intégralité des 8 tests d'acceptation (TA01 à TA08) et des vérifications techniques (TR01 à TR04) du cahier des charges :

* **TA01 (US01) :** Création d'une demande valide pour `MAT-001` (Scolarité) $\rightarrow$ Attribution d'un numéro unique (`D-104`) et état `Reçue`.
* **TA02 (US07) :** Tentatives de soumission sans identifiant ou avec un type invalide $\rightarrow$ Rejet par validation et stabilité du nombre de demandes.
* **TA03 (US02) :** Recherche du numéro créé (`D-104`) puis d'un numéro inconnu (`Z-999`) $\rightarrow$ Affichage de l'état exact pour `D-104` et du message **Demande introuvable** pour `Z-999`.
* **TA04 (CP-3 & CP-4 / US03–US04) :** Consultation de la liste agent, prise en charge de D-104 (En traitement) puis validation `Validée`.   
* **TA05 (CP-4, CP-5 & CP-11 / US04–US05) :** Prise en charge de D-102, rejet d'un refus sans motif, puis enregistrement d'un refus avec le motif `Pièce manquante` et vérification de son affichage côté suivi étudiant.   
* **TA06 (CP-6 / US06) :** Activation du filtre `Reçue` après TA01 à TA05 $\rightarrow$ Affichage exclusif de `D-101`.   
* **TA07 (CP-8 / US08) :** Rechargement du navigateur (`F5`) et redémarrage du serveur FastAPI $\rightarrow$ Conservation intégrale des dossiers, statuts et motifs enregistrés dans campus_services.db.   
* **TA08 (CP-4 / US04) :** Verrouillage des transitions sur un état final (`Validée` ou `Refusée`) dans l'interface React et rejet côté API (`HTTP 400`).   
* **TR01 – TR04 (CP-9, CP-10, CP-12, CP-13) :** Validation de l'interface React `v0.2`, de la documentation API intégrée et de la simulation chronologique des Dashboards Kanban des Sprints 1 et 2.