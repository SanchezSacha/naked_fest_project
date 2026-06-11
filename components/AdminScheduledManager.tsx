"use client";

import { useEffect, useState } from "react";

type ScheduledPush = {
  id: number;
  title: string;
  body: string;
  url: string | null;
  scheduledAt: string;
  sentAt: string | null;
  cancelledAt: string | null;
  topic: { key: string; label: string; color: string | null } | null;
};

type PushTopic = {
  id: number;
  key: string;
  label: string;
  color: string | null;
};

export default function AdminScheduledManager() {
  const [scheduled, setScheduled] = useState<ScheduledPush[]>([]);
  const [topics, setTopics] = useState<PushTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    url: "/",
    date: "",
    time: "",
    topicKey: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [scheduledRes, topicsRes] = await Promise.all([
        fetch("/api/push/scheduled"),
        fetch("/api/push/topics"),
      ]);

      if (scheduledRes.ok) {
        const scheduledData = await scheduledRes.json();
        setScheduled(scheduledData);
      }
      if (topicsRes.ok) {
        const topicsData = await topicsRes.json();
        setTopics(topicsData);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function createScheduled(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const scheduledAt = new Date(`${formData.date}T${formData.time}`);
    console.log("[DEBUG] Form data:", formData);
    console.log("[DEBUG] ScheduledAt:", scheduledAt);
    
    if (scheduledAt <= new Date()) {
      setError("La date et heure doivent être dans le futur");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        body: formData.body,
        url: formData.url || "/",
        scheduledAt: scheduledAt.toISOString(),
        topicKey: formData.topicKey || undefined,
      };
      console.log("[DEBUG] Payload:", payload);

      const res = await fetch("/api/push/scheduled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[DEBUG] Response status:", res.status);
      const data = await res.json().catch(() => ({ error: "Réponse invalide" }));
      console.log("[DEBUG] Response data:", data);

      if (res.ok) {
        setShowForm(false);
        setFormData({
          title: "",
          body: "",
          url: "/",
          date: "",
          time: "",
          topicKey: "",
        });
        fetchData();
      } else {
        const errorMsg = data.details 
          ? `${data.error} - ${data.details}` 
          : (data.error || `Erreur ${res.status}: ${JSON.stringify(data)}`);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("[DEBUG] Network error:", err);
      setError(`Erreur réseau: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  async function cancelScheduled(id: number) {
    if (!confirm("Annuler cette notification programmée ?")) return;

    try {
      const res = await fetch(`/api/push/scheduled/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelled: true }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch {
      // ignore
    }
  }

  async function deleteScheduled(id: number) {
    if (!confirm("Supprimer définitivement cette notification ?")) return;

    try {
      const res = await fetch(`/api/push/scheduled/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      }
    } catch {
      // ignore
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return <p className="text-white/50">Chargement...</p>;
  }

  // Séparer les notifications : à venir vs envoyées/annulées
  const upcoming = scheduled.filter(
    (s) => !s.sentAt && !s.cancelledAt && new Date(s.scheduledAt) > new Date()
  );
  const past = scheduled.filter(
    (s) => s.sentAt || s.cancelledAt || new Date(s.scheduledAt) <= new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-condensed text-xl font-bold uppercase tracking-[0.15em] text-white">
          Notifications programmées
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-lime px-4 py-2 font-condensed text-sm font-bold uppercase tracking-[0.1em] text-black transition-colors hover:bg-lime/80"
        >
          {showForm ? "Annuler" : "+ Programmer"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createScheduled} className="border border-white/20 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Changement de programme"
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
                required
                maxLength={120}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Contenu
              </label>
              <textarea
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                placeholder="Frontex joue finalement sur la Scène Glacier à 23h."
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
                required
                maxLength={500}
                rows={3}
              />
            </div>
            <div>
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Lien au clic
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="/programme"
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Source (optionnel)
              </label>
              <select
                value={formData.topicKey}
                onChange={(e) =>
                  setFormData({ ...formData, topicKey: e.target.value })
                }
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
              >
                <option value="">Tous les abonnés</option>
                {topics.map((topic) => (
                  <option key={topic.key} value={topic.key}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Heure
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-pink">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded bg-lime px-6 py-2 font-condensed text-sm font-bold uppercase tracking-[0.1em] text-black transition-colors hover:bg-lime/80 disabled:opacity-50"
          >
            {saving ? "Programmation..." : "Programmer l'envoi"}
          </button>
        </form>
      )}

      {/* Notifications à venir */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="mb-3 font-condensed text-sm uppercase tracking-[0.1em] text-lime">
            À venir ({upcoming.length})
          </h3>
          <div className="space-y-2">
            {upcoming.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-lime/30 bg-lime/5 p-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {item.topic && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.topic.color || "#ff2d9b" }}
                      />
                    )}
                    <p className="font-condensed font-bold uppercase tracking-[0.1em] text-white">
                      {item.title}
                    </p>
                  </div>
                  <p className="text-xs text-white/50">
                    {formatDate(item.scheduledAt)} {" "}
                    {item.topic && (
                      <span className="text-lime">→ {item.topic.label}</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => cancelScheduled(item.id)}
                  className="ml-2 text-xs text-orange hover:underline"
                >
                  Annuler
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      {past.length > 0 && (
        <div>
          <h3 className="mb-3 font-condensed text-sm uppercase tracking-[0.1em] text-white/40">
            Historique ({past.length})
          </h3>
          <div className="space-y-2">
            {past.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between border p-3 ${
                  item.sentAt
                    ? "border-white/10 bg-white/5"
                    : item.cancelledAt
                    ? "border-orange/30 bg-orange/5"
                    : "border-white/10"
                }`}
              >
                <div className="flex-1">
                  <p className="font-condensed font-bold uppercase tracking-[0.1em] text-white/70">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/40">
                    {formatDate(item.scheduledAt)} {" "}
                    {item.sentAt && (
                      <span className="text-lime">✓ Envoyée</span>
                    )}
                    {item.cancelledAt && (
                      <span className="text-orange">✗ Annulée</span>
                    )}
                    {!item.sentAt && !item.cancelledAt && (
                      <span className="text-white/30">Expirée</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => deleteScheduled(item.id)}
                  className="ml-2 text-xs text-white/30 hover:text-pink"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <p className="text-white/50">Aucune notification programmée.</p>
      )}
    </div>
  );
}
