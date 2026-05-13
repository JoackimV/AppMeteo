# App Meteo

Application météo front-end développée avec **Vite (Vanilla JS)**.  
Elle permet de rechercher une ville et d’afficher les conditions actuelles, les prévisions heure par heure et les prévisions sur plusieurs jours.

---

## Stack technique

- **Node.js / npm**
- **Vite** (template Vanilla JavaScript)
- **JavaScript**
- **HTML5**
- **CSS3**
- **Bootstrap**
- **Bootstrap Icons**

---

## Fonctionnalités

- Recherche de ville via un champ texte
- Recherche de ville via map
- Indication location de la ville sur une map
- Affichage de la météo actuelle :
  - Température (actuelle, max, min)
  - Précipitations
- Direction et vitesse du vent 
- Prévisions météo heure par heure
- Prévisions météo journalières (14 jours)
- Layout responsive

---

## Structure du projet

app_meteo/  
├─ index.html  
├─ package.json  
├─ public/
   ├─ app.html
   ├─ compass.svg
   └─ geo-alt-fill.svg
└─ src/  
   ├─ main.js  
   ├─ weatherData.js  
   ├─ weatherIcon.js  
   ├─ cityLocation.js  
   ├─ helpers.js  
   ├─ style.css   
   ├─ compass.js  
   └─ assets/  
	  └─ wind_unselected.svg

---

## Installation

### Prérequis

- **Node.js**
- **npm** (installé avec Node.js)

### Installer les dépendances

```powershell
npm install
```

---

## Lancer le projet en développement

```powershell
npm run dev
```

Vite affiche ensuite une URL locale (souvent `http://localhost:5173`).

---

## Build de production

```powershell
npm run build
```

Les fichiers optimisés sont générés dans le dossier `dist/`.

---

## Prévisualiser la build

```powershell
npm run preview
```

---

## Scripts npm

- `npm run dev` : démarre le serveur de développement  
- `npm run build` : génère la version de production  
- `npm run preview` : lance un serveur local pour tester la build

---

## Architecture rapide

- `src/main.js` : point d’entrée de l’application, rendu HTML et logique d’affichage météo.  
- `src/weatherData.js` : récupération et préparation des données météo.  
- `src/weatherIcon.js` : mapping des codes météo vers les icônes Bootstrap.  
- `src/cityLocation.js` : logique liée à la ville/localisation.  
- `src/style.css` : styles personnalisés de l’interface.

---

## Auteur

Projet réalisé par **Joackim VESTU**.

