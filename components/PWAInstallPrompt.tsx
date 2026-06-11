"use client";

import { useEffect, useState } from "react";

type Platform = "android" | "ios" | "macos" | "desktop";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt: () => Promise<void>;
}

const DISMISS_KEY = "nfest-pwa-install-dismissed";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform;
  
  const isIOS =
    /iphone|ipad|ipod/.test(ua) ||
    // iPadOS 13+ se présente comme un Mac avec écran tactile
    (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";
  
  if (/android/.test(ua)) return "android";
  
  // macOS (vrai Mac, pas iPad) - Safari n'a pas de beforeinstallprompt
  const isMac = platform === "MacIntel" || platform === "MacAppleSilicon" || /macintosh/.test(ua);
  if (isMac) return "macos";
  
  return "desktop";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function PWAInstallPrompt() {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const setupTimer = window.setTimeout(() => {
      setPlatform(detectPlatform());
      const stashed = (window as Window & { __pwaPrompt?: BeforeInstallPromptEvent | null })
        .__pwaPrompt;
      if (stashed) setDeferredPrompt(stashed);
    }, 0);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // Émis par le script du <head> quand le prompt arrive avant le montage
    const onInstallable = () => {
      const p = (window as Window & { __pwaPrompt?: BeforeInstallPromptEvent | null }).__pwaPrompt;
      if (p) setDeferredPrompt(p);
    };
    window.addEventListener("pwa-installable", onInstallable);

    const onInstalled = () => {
      setVisible(false);
      localStorage.setItem(DISMISS_KEY, "1");
    };
    window.addEventListener("appinstalled", onInstalled);

    // Petit délai pour ne pas surgir instantanément au chargement
    const timer = window.setTimeout(() => {
      setVisible(true);
      // requestAnimationFrame pour déclencher l'animation d'entrée
      requestAnimationFrame(() => setMounted(true));
    }, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("pwa-installable", onInstallable);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(setupTimer);
      window.clearTimeout(timer);
    };
  }, []);

  const close = () => {
    setMounted(false);
    window.setTimeout(() => setVisible(false), 300);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(DISMISS_KEY, "1");
    }
    setDeferredPrompt(null);
    close();
  };

  if (!visible) return null;

  const isDesktop = platform === "desktop" || platform === "macos";

  return (
    <>
      {/* Overlay — uniquement sur mobile (bottom sheet plein écran) */}
      {!isDesktop && (
        <div
          onClick={close}
          className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Installer l'application Naked Fest"
        className={
          isDesktop
            ? `fixed bottom-4 right-4 z-[100] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-dark-border bg-dark-card shadow-2xl transition-all duration-300 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`
            : `fixed bottom-0 left-0 right-0 z-[100] rounded-t-3xl border-t border-dark-border bg-dark-card shadow-2xl transition-transform duration-300 ${
                mounted ? "translate-y-0" : "translate-y-full"
              }`
        }
      >
        {/* Poignée (mobile) */}
        {!isDesktop && (
          <div className="flex justify-center pt-3">
            <span className="h-1.5 w-12 rounded-full bg-white/20" />
          </div>
        )}

        <div className="p-5 pb-safe">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl leading-none tracking-wide text-white">
                Installer l&apos;app N&apos;FEST
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Accède au festival en plein écran, comme une appli native.
              </p>
            </div>
            <button
              onClick={close}
              aria-label="Fermer"
              className="shrink-0 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Contenu spécifique plateforme */}
          <div className="mt-5">
            {platform === "ios" ? (
              <IosTutorial />
            ) : platform === "macos" ? (
              deferredPrompt ? (
                <button
                  onClick={handleAndroidInstall}
                  className="w-full rounded-xl bg-lime py-3.5 font-condensed text-base font-bold uppercase tracking-widest text-dark transition-opacity"
                >
                  Télécharger l&apos;application
                </button>
              ) : (
                <MacChromeTutorial />
              )
            ) : (
              <button
                onClick={handleAndroidInstall}
                disabled={!deferredPrompt}
                className="w-full rounded-xl bg-lime py-3.5 font-condensed text-base font-bold uppercase tracking-widest text-dark transition-opacity disabled:opacity-40"
              >
                {deferredPrompt ? "Télécharger l'application" : "Installation indisponible"}
              </button>
            )}

            {platform !== "ios" && platform !== "macos" && !deferredPrompt && (
              <p className="mt-3 text-center text-xs text-white/40">
                Ouvre le menu de ton navigateur puis choisis
                {isDesktop ? " « Installer Naked Fest »" : " « Ajouter à l'écran d'accueil »"}.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function IosTutorial() {
  const steps = [
    {
      label: (
        <>
          Appuie sur <strong className="text-white">Partager</strong>
        </>
      ),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v13" />
          <polyline points="8 7 12 3 16 7" />
          <path d="M4 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        </svg>
      ),
    },
    {
      label: (
        <>
          Choisis <strong className="text-white">Sur l&apos;écran d&apos;accueil</strong>
        </>
      ),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      label: (
        <>
          Valide avec <strong className="text-white">Ajouter</strong>
        </>
      ),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-dark-border bg-black/40 p-4">
      <p className="mb-3 font-condensed text-sm font-semibold uppercase tracking-widest text-cyan">
        Installation sur iOS
      </p>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 font-condensed text-sm font-bold text-white/80">
              {i + 1}
            </span>
            <span className="text-sm text-white/80">{step.label}</span>
            <span className="ml-auto shrink-0">{step.icon}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Kept for Safari-specific install guidance when the browser API becomes available.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MacTutorial() {
  const steps = [
    {
      label: (
        <>
          Clique sur <strong className="text-white">Partager</strong> dans Safari
        </>
      ),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v13" />
          <polyline points="8 7 12 3 16 7" />
          <path d="M4 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        </svg>
      ),
    },
    {
      label: (
        <>
          Choisis <strong className="text-white">Ajouter au Dock</strong>
        </>
      ),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      label: (
        <>
          L&apos;app s&apos;ouvre comme une fenêtre native
        </>
      ),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
        </svg>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-dark-border bg-black/40 p-4">
      <p className="mb-3 font-condensed text-sm font-semibold uppercase tracking-widest text-cyan">
        Installation sur Mac (Safari)
      </p>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 font-condensed text-sm font-bold text-white/80">
              {i + 1}
            </span>
            <span className="text-sm text-white/80">{step.label}</span>
            <span className="ml-auto shrink-0">{step.icon}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MacChromeTutorial() {
  return (
    <div className="rounded-xl border border-dark-border bg-black/40 p-4">
      <p className="mb-3 font-condensed text-sm font-semibold uppercase tracking-widest text-cyan">
        Installation sur Mac
      </p>
      <ol className="space-y-3">
        <li className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 font-condensed text-sm font-bold text-white/80">
            1
          </span>
          <span className="text-sm text-white/80">
            Clique sur le menu <strong className="text-white">⋮</strong> (Chrome/Edge)
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 font-condensed text-sm font-bold text-white/80">
            2
          </span>
          <span className="text-sm text-white/80">
            Choisis <strong className="text-white">Installer N&apos;FEST</strong>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 font-condensed text-sm font-bold text-white/80">
            3
          </span>
          <span className="text-sm text-white/80">
            L&apos;app s&apos;ouvre comme une fenêtre native
          </span>
        </li>
      </ol>
      <p className="mt-3 text-xs text-white/40">
        Sur Safari : utilisez « Ajouter au Dock » via le menu Partager.
      </p>
    </div>
  );
}
