# Compte rendu fonctionnel

## Site web

### Liste et filtres des evenements

Statut : realise.

- Catalogue partage entre le programme, les fiches, les favoris et la carte.
- Concerts, conferences, activites et stands disponibles dans les donnees de demo.
- Filtres par date, categorie et genre musical.
- Tri chronologique.
- Donnees Strapi utilisees automatiquement quand la collection `events` est disponible.
- Donnees locales de secours lorsque Strapi est arrete ou vide.

### Detail des evenements

Statut : realise.

- Route dynamique `/programme/[eventId]`.
- Date, horaires, duree, lieu, adresse et coordonnees.
- Description et liste des artistes/intervenants.
- Lien vers le marqueur correspondant sur la carte.
- Ajout ou retrait des favoris depuis la fiche.

### Carte interactive

Statut : realise.

- Plusieurs marqueurs selectionnables.
- Scenes, stands, entree, point information et poste de secours.
- Zoom, reinitialisation et panneau de detail.
- Coordonnees geographiques affichees.
- Lien entre un marqueur de scene et la fiche evenement.

### Favoris

Statut : realise.

- Ajout et retrait depuis la liste et la fiche.
- Connexion obligatoire avant l'ajout.
- Persistance dans `localStorage`.
- Page `/favoris`.
- Filtres par date et categorie.
- Tri chronologique ascendant ou descendant.

### PWA

Statut : realise.

- Manifest dynamique Next.js.
- Service worker.
- Icones et captures.
- Prompt d'installation Android/desktop.
- Instructions iOS et macOS.
- Mode `standalone`.

### Notifications et rappels

Statut : non traite volontairement.

Cette fonctionnalite est developpee sur une autre branche, conformement a la consigne.

## Comptes et sessions

Statut : realise.

- Inscription avec confirmation de mot de passe.
- Connexion et deconnexion.
- Session JWT Auth.js/NextAuth.
- Verification d'email avec token limite dans le temps.
- Envoi des emails avec Resend.
- Mot de passe oublie et reinitialisation avec token limite dans le temps.
- Affichage du nom de l'utilisateur connecte.

## API

Statut : realise pour la lecture publique.

- `GET /api/events`
- `GET /api/events/[eventId]`
- Proxy Strapi `GET /api/strapi/events`
- Donnees detaillees et persistantes disponibles des que Strapi expose la collection.
- Fallback local pour le developpement.

## Back-office Strapi

Statut : partiel, bloque par le repo externe.

Le repo `nfest_admin` existe, mais son dossier `src/api` ne contient actuellement que
`.gitkeep`. Aucun content-type n'est versionne et `/api/events` n'est donc pas disponible.

Le front Next est pret a consommer Strapi. Il reste a creer dans le repo Strapi les
content-types `Event`, `Artist`, `Location`, `Stand`, `Sponsor`, `Category` et
`MusicGenre`, puis a regler les permissions ou fournir un `STRAPI_API_TOKEN`.

Une fois ces collections creees, Strapi fournit nativement la creation, la modification,
la suppression, la recherche, les filtres, le tri et la pagination dans le back-office.

## Verification technique

- ESLint : OK.
- TypeScript : OK.
- Types de routes Next.js : OK.
- Build de production : bloque dans l'environnement de travail uniquement par le
  telechargement des Google Fonts, le reseau sortant etant indisponible.
