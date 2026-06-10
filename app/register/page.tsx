"use client";

import Link from "next/link";
import { useState } from "react";
import AuthFormField from "@/components/AuthFormField";
import AuthPage from "@/components/AuthPage";
import AuthSubmitButton from "@/components/AuthSubmitButton";

type RegisterResponse = {
  error?: string;
  emailSent?: boolean;
  verificationUrl?: string;
};

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function register(formData: FormData) {
    setError(null);
    setVerificationUrl(null);
    setEmailSent(false);
    setIsPending(true);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        name: formData.get("name"),
        password: formData.get("password"),
        passwordConfirmation: formData.get("passwordConfirmation"),
      }),
    });

    const data = (await res.json().catch(() => ({}))) as RegisterResponse;
    setIsPending(false);

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue pendant l'inscription.");
      return;
    }

    setEmailSent(Boolean(data.emailSent));
    setVerificationUrl(data.verificationUrl ?? null);
  }

  return (
    <AuthPage title="Creer un compte" subtitle="Rejoignez la liberation par le froid">
      <form action={register} className="space-y-9">
        <AuthFormField
          id="name"
          name="name"
          label="Nom complet"
          placeholder="Maya Laurent"
          type="text"
          autoComplete="name"
        />
        <AuthFormField
          id="email"
          name="email"
          label="Email"
          placeholder="maya@nfest.fr"
          type="email"
          autoComplete="email"
        />
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

        <AuthSubmitButton>{isPending ? "Creation..." : "Creer mon compte"}</AuthSubmitButton>
      </form>

      {error && (
        <p className="mt-8 border border-pink/50 bg-pink/10 px-5 py-4 text-sm text-pink">
          {error}
        </p>
      )}

      {emailSent && (
        <div className="mt-8 border border-lime/50 bg-lime/10 px-5 py-4 text-sm text-white/75">
          <p className="font-condensed text-lg font-bold uppercase tracking-[0.16em] text-lime">
            Email envoye
          </p>
          <p className="mt-2">
            Consulte ta boite mail pour verifier ton compte avant de te connecter.
          </p>
        </div>
      )}

      {verificationUrl && (
        <div className="mt-8 border border-lime/50 bg-lime/10 px-5 py-4 text-sm text-white/75">
          <p className="font-condensed text-lg font-bold uppercase tracking-[0.16em] text-lime">
            Mode test sans Resend
          </p>
          <p className="mt-2">
            Ajoute ta cle Resend pour recevoir l&apos;email. En attendant, utilise ce lien :
          </p>
          <Link
            href={verificationUrl}
            className="mt-3 inline-block break-all text-lime underline underline-offset-4 transition-colors hover:text-white"
          >
            {verificationUrl}
          </Link>
        </div>
      )}

      <p className="mt-10 text-center font-condensed text-xl font-bold uppercase tracking-[0.08em] text-white/55">
        Deja inscrit ?{" "}
        <Link href="/login" className="text-lime transition-colors duration-200 hover:text-white">
          Se connecter
        </Link>
      </p>
    </AuthPage>
  );
}
