"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AuthFormField from "@/components/AuthFormField";
import AuthSubmitButton from "@/components/AuthSubmitButton";

type ResetPasswordResponse = {
  error?: string;
};

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function resetPassword(formData: FormData) {
    setError(null);
    setSuccess(false);
    setIsPending(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: formData.get("password"),
        passwordConfirmation: formData.get("passwordConfirmation"),
      }),
    });

    const data = (await res.json().catch(() => ({}))) as ResetPasswordResponse;
    setIsPending(false);

    if (!res.ok) {
      setError(data.error ?? "Impossible de changer le mot de passe.");
      return;
    }

    setSuccess(true);
  }

  return (
    <>
      <form action={resetPassword} className="space-y-9">
        <AuthFormField
          id="password"
          name="password"
          label="Mot de passe"
          placeholder="ex: Glacier2027!"
          type="password"
          autoComplete="new-password"
        />
        <AuthFormField
          id="passwordConfirmation"
          name="passwordConfirmation"
          label="Confirmer le mot de passe"
          placeholder="retapez Glacier2027!"
          type="password"
          autoComplete="new-password"
        />
        <AuthSubmitButton>{isPending ? "Mise a jour..." : "Changer le mot de passe"}</AuthSubmitButton>
      </form>

      {!token && (
        <p className="mt-8 border border-pink/50 bg-pink/10 px-5 py-4 text-sm text-pink">
          Le lien de reinitialisation est incomplet.
        </p>
      )}

      {error && (
        <p className="mt-8 border border-pink/50 bg-pink/10 px-5 py-4 text-sm text-pink">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-8 border border-lime/50 bg-lime/10 px-5 py-4 text-sm text-white/75">
          Mot de passe mis a jour. Tu peux maintenant te connecter.
        </p>
      )}

      <p className="mt-10 text-center font-condensed text-xl font-bold uppercase tracking-[0.08em] text-white/55">
        Aller a la{" "}
        <Link href="/login" className="text-lime transition-colors duration-200 hover:text-white">
          connexion
        </Link>
      </p>
    </>
  );
}
