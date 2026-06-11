"use client";

import { useEffect, useState } from "react";

type PushTopic = {
  id: number;
  key: string;
  label: string;
  description: string | null;
  color: string | null;
  isDefault: boolean;
  _count?: { subscriptions: number };
};

export default function AdminTopicManager() {
  const [topics, setTopics] = useState<PushTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    key: "",
    label: "",
    description: "",
    color: "#ff2d9b",
    isDefault: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const res = await fetch("/api/push/topics");
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function createTopic(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/push/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          key: "",
          label: "",
          description: "",
          color: "#ff2d9b",
          isDefault: false,
        });
        fetchTopics();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de la creation");
      }
    } catch {
      setError("Erreur reseau");
    }
  }

  if (loading) {
    return <p className="text-white/50">Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-condensed text-xl font-bold uppercase tracking-[0.15em] text-white">
          Sources de notification
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-lime px-4 py-2 font-condensed text-sm font-bold uppercase tracking-[0.1em] text-black transition-colors hover:bg-lime/80"
        >
          {showForm ? "Annuler" : "+ Nouvelle source"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createTopic} className="border border-white/20 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Cle (technique)
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) =>
                  setFormData({ ...formData, key: e.target.value })
                }
                placeholder="general"
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Label (affichage)
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="General"
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Notifications generales du festival"
                className="mt-1 w-full border border-white/20 bg-black/30 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                Couleur
              </label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="h-10 w-20"
                />
                <span className="text-sm text-white/50">{formData.color}</span>
              </div>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Abonnement auto par defaut
              </label>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-pink">{error}</p>
          )}

          <button
            type="submit"
            className="mt-4 rounded bg-lime px-6 py-2 font-condensed text-sm font-bold uppercase tracking-[0.1em] text-black transition-colors hover:bg-lime/80"
          >
            Creer
          </button>
        </form>
      )}

      {topics.length === 0 ? (
        <p className="text-white/50">Aucune source creee.</p>
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between border border-white/10 p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: topic.color || "#ff2d9b" }}
                />
                <div>
                  <p className="font-condensed font-bold uppercase tracking-[0.1em] text-white">
                    {topic.label}
                  </p>
                  <p className="text-xs text-white/50">
                    {topic.key}
                    {topic.isDefault && (
                      <span className="ml-2 text-lime">(defaut)</span>
                    )}
                  </p>
                  {topic.description && (
                    <p className="text-xs text-white/40">{topic.description}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="rounded bg-white/10 px-2 py-1 text-xs text-white/70">
                  {topic._count?.subscriptions ?? 0} abonnes
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
