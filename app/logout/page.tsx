"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import AuthPage from "@/components/AuthPage";

export default function LogoutPage() {
  useEffect(() => {
    void signOut({ redirectTo: "/login" });
  }, []);

  return (
    <AuthPage title="Deconnexion" subtitle="Fin de session">
      <p className="border border-white/20 bg-white/5 px-5 py-5 text-sm text-white/60">
        Deconnexion en cours...
      </p>
    </AuthPage>
  );
}
