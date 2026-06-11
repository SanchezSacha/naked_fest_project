"use client";

import { useEffect, useState } from "react";
import {
  getCurrentSubscription,
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push-client";
import PushTopicSelector from "./PushTopicSelector";

type Status = "loading" | "unsupported" | "denied" | "off" | "on";

export default function PushSubscriptionToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Frontiere async : evite un setState synchrone dans l'effet.
      await Promise.resolve();
      const supported = isPushSupported();
      const sub = supported
        ? await getCurrentSubscription().catch(() => null)
        : null;

      if (cancelled) return;

      if (!supported) {
        setStatus("unsupported");
      } else if (Notification.permission === "denied") {
        setStatus("denied");
      } else if (sub) {
        setStatus("on");
        setEndpoint(sub.endpoint);
      } else {
        setStatus("off");
        setEndpoint(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleEnable() {
    setBusy(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      await subscribeToPush();
      setStatus("on");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Echec de l'activation");
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    setBusy(true);
    setError(null);
    try {
      await unsubscribeFromPush();
      setStatus("off");
      setEndpoint(null);
    } catch {
      setError("Echec de la desactivation");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading" || status === "unsupported") {
    return null;
  }

  const baseBtn =
    "self-start border px-6 py-3 font-condensed text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-50";

  return (
    <div className="flex flex-col gap-2">
      {status === "denied" && (
        <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40">
          Notifications bloquees dans le navigateur
        </p>
      )}

      {status === "off" && (
        <button
          type="button"
          onClick={handleEnable}
          disabled={busy}
          className={`${baseBtn} border-lime text-lime hover:bg-lime hover:text-dark hover:shadow-[0_0_18px_rgba(200,255,0,0.24)]`}
        >
          {busy ? "Activation..." : "Activer les notifications"}
        </button>
      )}

      {status === "on" && (
        <>
          <button
            type="button"
            onClick={handleDisable}
            disabled={busy}
            className={`${baseBtn} border-pink text-pink hover:bg-pink hover:text-white hover:shadow-[0_0_18px_rgba(255,45,155,0.24)]`}
          >
            {busy ? "..." : "Desactiver les notifications"}
          </button>
          {endpoint && <PushTopicSelector endpoint={endpoint} />}
        </>
      )}

      {error && (
        <p className="font-condensed text-xs uppercase tracking-[0.2em] text-orange">
          {error}
        </p>
      )}
    </div>
  );
}
