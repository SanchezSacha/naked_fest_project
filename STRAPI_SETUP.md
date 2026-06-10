# Connexion Strapi

Le front Next lit les evenements depuis Strapi via :

```env
STRAPI_URL="http://localhost:1337"
STRAPI_API_TOKEN=""
```

`STRAPI_API_TOKEN` est optionnel si la collection `events` est publique dans Strapi.
Si elle est privee, cree un token dans Strapi :

`Settings > API Tokens > Create new API Token`

Puis colle le token dans `STRAPI_API_TOKEN`.

## Collection attendue

Dans Strapi, cree une collection type avec :

- Display name : `Event`
- API ID singular : `event`
- API ID plural : `events`

Champs conseilles :

- `title` : Text
- `startsAt` : DateTime
- `time` : Text, optionnel si `startsAt` existe
- `day` : Enumeration avec `VEN`, `SAM`, `DIM`, optionnel si `startsAt` existe
- `artistName` : Text
- `genreName` : Text
- `origin` : Text
- `stageName` : Text
- `type` : Enumeration ou Text, par exemple `concerts`, `conferences`, `activites`
- `image` : Media, single

Le front accepte aussi des relations appelees `artist`, `artists`, `category`, `genre`,
`musicGenre`, `location` ou `stage` si tu preferes structurer Strapi avec plusieurs
collections.

## Lancement local

Dans le repo Strapi :

```bash
npm run develop
```

Dans le repo Next :

```bash
npm run dev
```

La page `/programme` affiche un badge discret `Strapi` si les donnees viennent du
back-office, sinon `Demo` si Strapi est coupe ou vide.
