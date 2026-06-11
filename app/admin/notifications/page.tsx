import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPushConfigStatus } from "@/lib/push";
import AdminPushForm from "@/components/AdminPushForm";
import AdminTopicManager from "@/components/AdminTopicManager";

export const metadata = {
  title: "Admin · Notifications",
};

export default async function AdminNotificationsPage() {
  const session = await auth();
  const pushStatus = getPushConfigStatus();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-8 py-16 md:px-12">
      <span className="font-condensed text-[10px] tracking-[0.4em] uppercase text-pink">
        Console admin
      </span>
      <h1 className="mb-3 mt-2 font-display text-[clamp(40px,10vw,72px)] uppercase leading-none text-white">
        Notifications
      </h1>
      <p className="mb-10 max-w-prose font-body text-sm leading-relaxed text-white/50">
        Composez une notification push envoyee a tous les appareils abonnes.
        Choisissez le titre, le contenu et le lien ouvert au clic.
      </p>

      {!pushStatus.isFullyConfigured && (
        <div className="mb-8 border border-orange bg-orange/10 px-6 py-5">
          <p className="font-condensed text-sm font-bold uppercase tracking-[0.15em] text-orange">
            ⚠ Configuration incomplete
          </p>
          <p className="mt-2 text-sm text-white/70">
            Les notifications push ne sont pas configurees. Variables manquantes :
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-white/70">
            {!pushStatus.hasPublicKey && (
              <li>NEXT_PUBLIC_VAPID_PUBLIC_KEY</li>
            )}
            {!pushStatus.hasPrivateKey && <li>VAPID_PRIVATE_KEY</li>}
          </ul>
          <p className="mt-3 text-sm text-white/50">
            Generez les cles avec :{" "}
            <code className="rounded bg-black/30 px-2 py-1 text-lime">
              npx web-push generate-vapid-keys
            </code>
          </p>
        </div>
      )}

      {pushStatus.isFullyConfigured && (
        <>
          <div className="mb-12">
            <AdminTopicManager />
          </div>
          <hr className="mb-12 border-white/10" />
          <AdminPushForm />
        </>
      )}
    </main>
  );
}
