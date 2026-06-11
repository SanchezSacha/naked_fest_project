// Configuration web-push (VAPID) et helpers d'envoi de notifications.
import webpush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT ?? "mailto:contact@nakedfest.fr";

let configured = false;

export function isPushConfigured() {
  return Boolean(publicKey && privateKey);
}

export function getPushConfigStatus() {
  return {
    hasPublicKey: Boolean(publicKey),
    hasPrivateKey: Boolean(privateKey),
    hasSubject: Boolean(process.env.VAPID_SUBJECT),
    isFullyConfigured: Boolean(publicKey && privateKey),
  };
}

function ensureConfigured() {
  if (configured) return;

  const missing: string[] = [];
  if (!publicKey) missing.push("NEXT_PUBLIC_VAPID_PUBLIC_KEY");
  if (!privateKey) missing.push("VAPID_PRIVATE_KEY");

  if (missing.length > 0 || !publicKey || !privateKey) {
    throw new Error(
      `Cles VAPID manquantes : ${missing.join(", ")}. Generez-les avec : npx web-push generate-vapid-keys`,
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export type PushTarget = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
};

export type PushResult = {
  sent: number;
  failed: number;
  // Endpoints injoignables (404/410) a supprimer en base.
  expiredEndpoints: string[];
};

export async function sendPushToTargets(
  targets: PushTarget[],
  payload: PushPayload,
): Promise<PushResult> {
  ensureConfigured();

  const data = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/",
    icon: payload.icon ?? "/icon-192.png",
    badge: payload.badge ?? "/icon-96.png",
    tag: payload.tag,
  });

  const expiredEndpoints: string[] = [];
  let sent = 0;
  let failed = 0;

  await Promise.all(
    targets.map(async (target) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: target.endpoint,
            keys: { p256dh: target.p256dh, auth: target.auth },
          },
          data,
        );
        sent += 1;
      } catch (err) {
        failed += 1;
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          expiredEndpoints.push(target.endpoint);
        }
      }
    }),
  );

  return { sent, failed, expiredEndpoints };
}
