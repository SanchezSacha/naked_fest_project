"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import AuthFormField from "@/components/AuthFormField";
import AuthPage from "@/components/AuthPage";
import AuthSubmitButton from "@/components/AuthSubmitButton";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function login(formData: FormData) {
    setError(null);
    setIsPending(true);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsPending(false);

    if (result?.error) {
      setError("Identifiants invalides ou email non verifie.");
      return;
    }

    const redirectTo = sessionStorage.getItem("nfest-post-login-redirect") || "/programme";
    sessionStorage.removeItem("nfest-post-login-redirect");
    window.location.href = redirectTo;
  }

  return (
    <AuthPage title="Connexion" subtitle="Retour au chaud, soldat du froid">
      <form action={login} className="space-y-9 md:space-y-5">
        <AuthFormField
          id="email"
          name="email"
          label="Email"
          placeholder="john.doe@example.com"
          type="email"
          autoComplete="email"
        />
        <AuthFormField
          id="password"
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          type="password"
          autoComplete="current-password"
          minLength={8}
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="font-condensed text-lg font-bold uppercase tracking-[0.1em] text-white/55 transition-colors hover:text-lime md:text-sm"
          >
            Mot de passe oublie ?
          </Link>
        </div>

        <AuthSubmitButton>{isPending ? "Connexion..." : "Se connecter"}</AuthSubmitButton>
      </form>

      {error && (
        <p className="mt-8 border border-pink/50 bg-pink/10 px-5 py-4 text-sm text-pink md:mt-4 md:py-3">
          {error}
        </p>
      )}

      <p className="mt-10 text-center font-condensed text-xl font-bold uppercase tracking-[0.08em] text-white/55 md:mt-5 md:text-base">
        Pas encore inscrit ?{" "}
        <Link href="/register" className="text-lime transition-colors duration-200 hover:text-white">
          S&apos;inscrire
        </Link>
      </p>
    </AuthPage>
  );
}
