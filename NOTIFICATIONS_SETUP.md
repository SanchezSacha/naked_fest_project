# Notifications Push — Configuration

Système de notifications push web (PWA) pour Naked Fest. Deux modes :

1. **Manuel (intervention humaine)** : un administrateur compose une notification (titre, contenu, lien) et l'envoie à tous les abonnés depuis `/admin/notifications`.
2. **Automatique (rappels d'événements)** : les abonnés programment des rappels (24h / 2h / 30min avant un événement). Un cron envoie les rappels arrivés à échéance.

## 1. Variables d'environnement

Ajouter dans `.env` :

```
# Clés VAPID (web push)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:contact@nakedfest.fr

# Secret pour protéger l'endpoint cron
CRON_SECRET=...
```

Générer les clés VAPID :

```bash
npx web-push generate-vapid-keys
```

Copier `Public Key` dans `NEXT_PUBLIC_VAPID_PUBLIC_KEY` et `Private Key` dans `VAPID_PRIVATE_KEY`.

## 2. Test local

Les notifications push nécessitent HTTPS (sauf `localhost`). Pour tester :

```bash
next dev --experimental-https
```

Autoriser les notifications dans le navigateur lorsqu'il le demande.

## 3. Endpoints API

| Méthode | Route | Rôle |
| --- | --- | --- |
| `POST` | `/api/push/subscribe` | Enregistre un abonnement (corps = `PushSubscription` sérialisé) |
| `POST` | `/api/push/unsubscribe` | Supprime un abonnement (`{ endpoint }`) |
| `GET` | `/api/push/vapid-public-key` | Renvoie la clé publique VAPID |
| `POST` | `/api/push/send` | **Admin** — envoi manuel `{ title, body, url? }` |
| `POST`/`DELETE` | `/api/push/reminders` | Crée/annule un rappel `{ eventId, delay, endpoint }` |
| `GET`/`POST` | `/api/push/cron` | Traite les rappels dus (protégé par `CRON_SECRET`) |

`delay` accepte : `HOURS_24`, `HOURS_2`, `MINUTES_30`.

## 4. Accès admin

L'envoi manuel et la page `/admin/notifications` requièrent un utilisateur avec `role = ADMIN`.

Promouvoir un utilisateur :

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'ton@email.fr';
```

## 5. Déclenchement du cron

Appeler périodiquement (toutes les 5 min p.ex.) l'endpoint cron avec le secret :

```bash
curl -X POST "https://<domaine>/api/push/cron" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Sur Vercel, configurer un Cron Job pointant vers `/api/push/cron` (le header d'autorisation Vercel peut être remplacé par `?secret=$CRON_SECRET`).

## 6. Rappels d'événements (note)

Les rappels (`EventReminder`) sont liés à la table Prisma `Event` (`eventId`) afin de calculer `remindAt = startsAt - délai`. Le composant `EventReminderButton` (`components/EventReminderButton.tsx`) est prêt à être placé sur la page de détail d'un événement, dès lors que les événements sont disponibles en base Prisma avec un identifiant numérique (actuellement la page de détail utilise des données statiques).
