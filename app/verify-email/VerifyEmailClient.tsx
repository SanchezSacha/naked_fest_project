"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token ? "Verification du lien en cours..." : "Le lien de verification est incomplet.",
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { error?: string };

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error ?? "Lien invalide ou expire.");
          return;
        }

        setStatus("success");
        setMessage("Email verifie. Tu peux maintenant te connecter.");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Impossible de verifier ce lien pour le moment.");
      });
  }, [token]);

  return (
    <>
      <div
        className={`border px-5 py-5 text-sm ${
          status === "success"
            ? "border-lime/50 bg-lime/10 text-white/75"
            : status === "error"
              ? "border-pink/50 bg-pink/10 text-pink"
              : "border-white/20 bg-white/5 text-white/60"
        }`}
      >
        {message}
      </div>

      <p className="mt-10 text-center font-condensed text-xl font-bold uppercase tracking-[0.08em] text-white/55">
        Retour a la{" "}
        <Link href="/login" className="text-lime transition-colors duration-200 hover:text-white">
          connexion
        </Link>
      </p>
    </>
  );
}
