# N'FEST

Application web et PWA du festival **Naked Fest Winter'27**. Elle permet de
consulter le programme, filtrer les événements, explorer la carte du festival,
gérer ses favoris et recevoir des rappels.

Le projet utilise deux sources de données :

- **Strapi** gère le contenu du festival : événements, artistes, lieux, stands
  et sponsors.
- **PostgreSQL avec Prisma** gère les comptes, les sessions, les jetons de
  sécurité et les notifications.

## Fonctionnalités

- Programme des concerts, conférences, activités et stands.
- Filtres par date, catégorie et genre musical.
- Fiche détaillée de chaque événement.
- Carte interactive des scènes et points d'intérêt.
- Favoris persistés dans le `localStorage`, accessibles après connexion.
- Inscription, connexion, déconnexion et espace compte.
- Vérification de l'adresse email avec un lien temporaire.
- Mot de passe oublié et réinitialisation.
- Notifications push et rappels à 24 h, 2 h ou 30 min.
- Interface d'administration des notifications réservée au rôle `ADMIN`.
- Installation sur mobile et ordinateur en tant que PWA.
- Contenu Strapi avec catalogue local de secours si le CMS est indisponible.

## Technologies

- Next.js 16 avec App Router
- React 19 et TypeScript
- Tailwind CSS 4
- NextAuth 5
- Prisma 7 et PostgreSQL
- Strapi
- Resend
- Web Push et Service Worker
- Zod et bcrypt

## Prérequis

- Node.js `20.9` ou supérieur
- npm
- Docker Desktop, ou une installation locale de PostgreSQL
- Le projet Strapi `naked_fest_back_office` pour administrer le contenu

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Créer le fichier d'environnement :

```powershell
Copy-Item .env.example .env
```

3. Démarrer PostgreSQL avec Docker :

```bash
docker compose up -d
```

4. Vérifier la connexion à la base dans `.env` :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=app"
```

5. Générer le client Prisma et appliquer les migrations :

```bash
npx prisma generate
npx prisma migrate dev
```

6. Lancer l'application :

```bash
npm run dev
```

L'application est ensuite disponible sur
[http://localhost:3000](http://localhost:3000).

## Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=app"

# Authentification
AUTH_SECRET="une-longue-valeur-aleatoire"

# Envoi des emails
RESEND_API_KEY="re_xxxxxxxxx"
RESEND_FROM_EMAIL="N'FEST <onboarding@resend.dev>"

# CMS Strapi
STRAPI_URL="http://localhost:1337"
STRAPI_API_TOKEN=""

# Notifications push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_SUBJECT="mailto:contact@nakedfest.fr"
CRON_SECRET="une-valeur-secrete"
```

Pour générer les clés VAPID :

```bash
npx web-push generate-vapid-keys
```

En développement, l'adresse `onboarding@resend.dev` peut être conservée comme
expéditeur Resend. La clé `RESEND_API_KEY` doit provenir du tableau de bord
Resend. Si Resend n'est pas configuré, l'application affiche le lien de
vérification ou de réinitialisation directement dans l'interface.

Ne jamais versionner le fichier `.env` ni exposer les clés privées.

## Strapi

Le back-office Strapi fonctionne dans un dépôt séparé et doit être lancé sur
[http://localhost:1337](http://localhost:1337).

```bash
# À exécuter dans le dépôt naked_fest_back_office
npm install
npm run develop
```

Le détail des types de contenu et des droits publics à configurer se trouve
dans [STRAPI_SETUP.md](./STRAPI_SETUP.md).

Si l'API Strapi n'est pas disponible, l'application utilise temporairement les
données de démonstration définies dans `lib/festival-events.ts`.

## Pages principales

| Route | Description |
| --- | --- |
| `/` | Accueil du festival |
| `/programme` | Liste et filtres des événements |
| `/programme/[eventId]` | Détail d'un événement |
| `/carte` | Carte interactive |
| `/recherche` | Recherche d'événements |
| `/favoris` | Événements enregistrés |
| `/compte` | Profil de l'utilisateur |
| `/login` | Connexion |
| `/register` | Inscription |
| `/forgot-password` | Demande de réinitialisation |
| `/reset-password` | Choix du nouveau mot de passe |
| `/verify-email` | Validation de l'adresse email |
| `/admin/notifications` | Gestion des notifications pour les administrateurs |

## Authentification

L'inscription crée l'utilisateur dans PostgreSQL et envoie un lien de
vérification valable pendant 60 minutes. La connexion est autorisée uniquement
après la validation de l'adresse email.

Les liens de réinitialisation du mot de passe expirent après 30 minutes. Les
mots de passe sont hachés avec bcrypt et les sessions utilisent des JWT gérés
par NextAuth.

Les rôles disponibles sont :

- `USER` : accès standard au site.
- `ADMIN` : accès supplémentaire à la gestion des notifications.

## Notifications

Les notifications reposent sur le Service Worker `public/sw.js` et le protocole
Web Push. L'endpoint `/api/push/cron` traite les rappels et les notifications
programmées ; il doit être appelé régulièrement avec `CRON_SECRET`.

```bash
curl -X POST "http://localhost:3000/api/push/cron" \
  -H "Authorization: Bearer votre-secret"
```

La configuration complète est documentée dans
[NOTIFICATIONS_SETUP.md](./NOTIFICATIONS_SETUP.md).

## Commandes utiles

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance le serveur de développement |
| `npm run dev:watch` | Relance le serveur lorsque `.env` change |
| `npm run build` | Génère le client Prisma puis compile l'application |
| `npm run start` | Lance la version de production |
| `npm run lint` | Vérifie la qualité du code |
| `npm run prisma:generate` | Régénère le client Prisma |
| `npx prisma migrate dev` | Crée et applique une migration locale |
| `npx prisma studio` | Ouvre l'interface de consultation de la base |

## Structure du projet

```text
app/
  (main)/                Pages publiques principales
  admin/                 Pages réservées à l'administration
  api/                   Routes serveur Next.js
  generated/prisma/      Client Prisma généré
components/              Composants partagés
lib/                     Authentification, données, emails et notifications
prisma/
  migrations/            Historique des migrations
  schema.prisma          Modèles de la base PostgreSQL
public/                  Images, icônes PWA et Service Worker
scripts/                 Scripts de développement
```

## Vérifications avant une contribution

```bash
npm run lint
npm run build
```

Lors d'une modification du schéma Prisma, créer une nouvelle migration et
versionner le dossier généré dans `prisma/migrations`.
