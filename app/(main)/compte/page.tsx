"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { type FormEvent, useRef, useState } from "react";

// ── Champ de formulaire ────────────────────────────────────────────────────

function Field({
  id,
  label,
  type = "text",
  defaultValue,
  placeholder,
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-condensed text-xs uppercase tracking-[0.25em] text-white/35"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`mt-2 h-12 w-full border bg-[#111113] px-4 font-condensed text-sm uppercase tracking-[0.08em] text-white outline-none transition-colors placeholder:text-white/25 focus:border-lime ${
          error ? "border-pink" : "border-white/20 hover:border-white/40"
        }`}
      />
      {error && (
        <p className="mt-1 font-condensed text-[10px] uppercase tracking-[0.15em] text-pink">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Modale de confirmation de suppression ──────────────────────────────────

function DeleteModal({
  onClose,
  onConfirm,
  isPending,
  error,
}: {
  onClose: () => void;
  onConfirm: (password: string) => void;
  isPending: boolean;
  error: string | null;
}) {
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = passwordRef.current?.value ?? "";
    if (password) onConfirm(password);
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg border border-[#252525] bg-[#09090b]">
        {/* En-tête */}
        <div className="border-b border-[#252525] px-8 py-7">
          <span className="font-condensed text-xs uppercase tracking-[0.3em] text-pink">
            Action irreversible
          </span>
          <h2 className="mt-2 font-display text-4xl uppercase text-white">
            Supprimer le compte
          </h2>
        </div>

        {/* Corps */}
        <form onSubmit={handleSubmit} className="px-8 py-7">
          <p className="text-sm leading-7 text-white/60">
            Cette action supprimera definitvement ton compte et toutes les donnees associees.
            Elle ne peut pas etre annulee.
          </p>

          <div className="mt-6">
            <label
              htmlFor="delete-password"
              className="font-condensed text-xs uppercase tracking-[0.25em] text-white/35"
            >
              Confirme ton mot de passe
            </label>
            <input
              ref={passwordRef}
              id="delete-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`mt-2 h-12 w-full border bg-[#111113] px-4 font-condensed text-sm uppercase tracking-[0.08em] text-white outline-none transition-colors placeholder:text-white/25 focus:border-pink ${
                error ? "border-pink" : "border-white/20 hover:border-white/40"
              }`}
            />
            {error && (
              <p className="mt-2 border border-pink/30 bg-pink/10 px-4 py-3 font-condensed text-xs uppercase tracking-[0.12em] text-pink">
                {error}
              </p>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/20 bg-white/5 px-4 py-3 font-condensed text-xs uppercase tracking-[0.18em] text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.08)]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 border-2 border-pink bg-pink px-4 py-3 font-condensed text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-transparent hover:[color:var(--neon-pink)] hover:shadow-[0_0_18px_rgba(255,45,155,0.24)] disabled:opacity-50"
            >
              {isPending ? "Suppression..." : "Supprimer definitivement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────

export default function AccountPage() {
  const { data: session, update, status } = useSession();
  const loaded = status !== "loading";

  // Surcharge locale pour affichage immédiat après sauvegarde
  const [localUser, setLocalUser] = useState<{ name?: string | null; email?: string | null } | null>(null);
  const user = localUser ?? session?.user ?? null;

  // Formulaire d'édition
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEditError(null);
    setPasswordError(null);
    setEditSuccess(false);
    setIsSaving(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const currentPassword = (form.elements.namedItem("currentPassword") as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value;
    const newPasswordConfirmation = (form.elements.namedItem("newPasswordConfirmation") as HTMLInputElement).value;

    const payload: Record<string, string> = { name, email };
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
      payload.newPasswordConfirmation = newPasswordConfirmation;
    }

    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsSaving(false);

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      const msg = body.error ?? "Une erreur est survenue";
      // Erreur ciblée sur le champ mot de passe actuel
      if (msg.toLowerCase().includes("mot de passe actuel") || msg.toLowerCase().includes("incorrect")) {
        setPasswordError(msg);
      } else {
        setEditError(msg);
      }
      return;
    }

    const updated = (await res.json()) as { name?: string | null; email?: string | null };
    setLocalUser(updated);
    setEditSuccess(true);
    setIsEditing(false);
    await update({ name: updated.name ?? "", email: updated.email ?? "" });
  }

  async function handleDelete(password: string) {
    setDeleteError(null);
    setIsDeleting(true);

    const res = await fetch("/api/users/me", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDeleteError((body as { error?: string }).error ?? "Une erreur est survenue");
      setIsDeleting(false);
      return;
    }

    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen">
      {/* En-tête */}
      <section className="border-b border-[#252525] px-8 pb-12 pt-14 md:px-12 md:pt-16">
        <span className="font-condensed text-xs uppercase tracking-[0.3em] text-pink">
          Espace personnel
        </span>
        <h1 className="mt-3 font-display text-[clamp(56px,12vw,96px)] uppercase leading-none text-white">
          Mon compte
        </h1>
      </section>

      {/* Contenu principal */}
      {!loaded ? (
        <section className="flex items-center justify-center py-28">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime/30 border-t-lime" />
        </section>
      ) : user ? (
        <>
          {/* Profil */}
          <section className="border-b border-[#252525]">
            <div className="grid md:grid-cols-[1.15fr_0.85fr]">
              {/* Identite */}
              <div className="border-b border-[#252525] px-8 py-10 md:border-b-0 md:border-r md:px-12 md:py-14">
                <span className="font-condensed text-xs uppercase tracking-[0.3em] text-white/35">
                  Identite
                </span>

                {!isEditing ? (
                  <>
                    <h2 className="mt-3 font-display text-5xl uppercase text-white md:text-6xl">
                      {user.name ?? "Utilisateur"}
                    </h2>
                    <p className="mt-2 font-condensed text-sm uppercase tracking-[0.15em] text-white/50">
                      {user.email}
                    </p>

                    {editSuccess && (
                      <p className="mt-4 font-condensed text-xs uppercase tracking-[0.15em] text-lime">
                        ✓ Modifications enregistrees
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => { setIsEditing(true); setEditSuccess(false); }}
                      className="mt-8 border border-lime bg-lime px-5 py-3 font-condensed text-xs font-bold uppercase tracking-[0.18em] text-dark transition-all duration-300 hover:bg-[#111113] hover:[color:var(--neon-lime)] hover:shadow-[0_0_18px_rgba(200,255,0,0.25)]"
                    >
                      Modifier les informations
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleEditSubmit} className="mt-6 space-y-5">
                    <Field
                      id="name"
                      label="Nom"
                      defaultValue={user.name ?? ""}
                      placeholder="Ton nom"
                      autoComplete="name"
                    />
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      defaultValue={user.email ?? ""}
                      placeholder="ton@email.com"
                      autoComplete="email"
                    />

                    {/* Section mot de passe */}
                    <div className="border-t border-[#252525] pt-5">
                      <span className="font-condensed text-xs uppercase tracking-[0.25em] text-white/35">
                        Changer le mot de passe{" "}
                        <span className="normal-case tracking-normal text-white/20">(optionnel)</span>
                      </span>
                      <div className="mt-4 space-y-4">
                        <Field
                          id="currentPassword"
                          label="Mot de passe actuel"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="off"
                          error={passwordError ?? undefined}
                        />
                        <Field
                          id="newPassword"
                          label="Nouveau mot de passe"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                        <Field
                          id="newPasswordConfirmation"
                          label="Confirmation"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    {editError && (
                      <p className="border border-pink/30 bg-pink/10 px-4 py-3 font-condensed text-xs uppercase tracking-[0.12em] text-pink">
                        {editError}
                      </p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="border-2 border-lime bg-lime px-7 py-3 font-condensed text-xs font-bold uppercase tracking-[0.22em] text-dark transition-all duration-300 hover:bg-[#111113] hover:[color:var(--neon-lime)] hover:shadow-[0_0_18px_rgba(200,255,0,0.25)] disabled:opacity-50"
                      >
                        {isSaving ? "Enregistrement..." : "Enregistrer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setEditError(null); setPasswordError(null); }}
                        className="px-5 py-3 font-condensed text-xs uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Statut */}
              <aside className="px-8 py-10 md:px-10 md:py-14">
                <dl className="space-y-8">
                  <div>
                    <dt className="font-condensed text-xs uppercase tracking-[0.25em] text-white/35">
                      Statut
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 font-condensed text-lg font-bold uppercase tracking-[0.08em] text-lime">
                      <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
                      Connecte
                    </dd>
                  </div>
                  <div>
                    <dt className="font-condensed text-xs uppercase tracking-[0.25em] text-white/35">
                      Festival
                    </dt>
                    <dd className="mt-1 font-condensed text-lg font-bold uppercase tracking-[0.08em] text-white">
                      N&apos;FEST 2027
                    </dd>
                  </div>
                  <div>
                    <dt className="font-condensed text-xs uppercase tracking-[0.25em] text-white/35">
                      Dates
                    </dt>
                    <dd className="mt-1 font-condensed text-lg font-bold uppercase tracking-[0.08em] text-white">
                      24 – 26 Jan 2027
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </section>

          {/* Actions */}
          <section className="grid border-b border-[#252525] divide-y divide-[#252525] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <Link
              href="/favoris"
              className="group flex items-center justify-between px-8 py-10 transition-colors hover:bg-white/[0.02] md:px-12"
            >
              <div>
                <span className="font-condensed text-xs uppercase tracking-[0.3em] text-white/35">
                  Ma selection
                </span>
                <p className="mt-2 font-display text-4xl uppercase text-white group-hover:text-lime transition-colors">
                  Mes favoris
                </p>
              </div>
              <span className="font-display text-4xl text-white/20 group-hover:text-lime transition-colors">
                →
              </span>
            </Link>

            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/login" })}
              className="group flex items-center justify-between px-8 py-10 transition-colors hover:bg-white/[0.02] md:px-12 text-left"
            >
              <div>
                <span className="font-condensed text-xs uppercase tracking-[0.3em] text-white/35">
                  Session
                </span>
                <p className="mt-2 font-display text-4xl uppercase text-white group-hover:text-pink transition-colors">
                  Deconnexion
                </p>
              </div>
              <span className="font-display text-4xl text-white/20 group-hover:text-pink transition-colors">
                →
              </span>
            </button>
          </section>

          {/* Zone dangereuse */}
          <section className="border-b border-[#252525] px-8 py-10 md:px-12 md:py-14">
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-pink">
              Zone dangereuse
            </span>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/45">
              La suppression du compte est definitive et irreversible. Toutes tes donnees seront effacees.
            </p>
            <button
              type="button"
              onClick={() => { setShowDeleteModal(true); setDeleteError(null); }}
              className="mt-6 border border-pink bg-pink px-5 py-3 font-condensed text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-transparent hover:[color:var(--neon-pink)] hover:shadow-[0_0_18px_rgba(255,45,155,0.24)]"
            >
              Supprimer le compte
            </button>
          </section>
        </>
      ) : (
        /* Non connecté */
        <section className="px-8 py-24 text-center md:px-12">
          <p className="font-display text-5xl uppercase text-white/20">Non connecte</p>
          <p className="mt-4 font-condensed text-sm uppercase tracking-[0.2em] text-white/35">
            Connecte-toi pour acceder a ton espace personnel
          </p>
          <Link
            href="/login"
            className="mt-10 inline-flex border-2 border-lime bg-lime px-8 py-4 font-condensed text-xs font-bold uppercase tracking-[0.22em] text-dark transition-all duration-300 hover:bg-[#111113] hover:[color:var(--neon-lime)] hover:shadow-[0_0_18px_rgba(200,255,0,0.25)]"
          >
            Connexion
          </Link>
        </section>
      )}

      {/* Modale suppression */}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isPending={isDeleting}
          error={deleteError}
        />
      )}
    </div>
  );
}
