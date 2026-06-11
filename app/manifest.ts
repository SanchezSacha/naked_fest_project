import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Naked Fest Winter'27",
    short_name: "N'FEST",
    description: "La libération par le froid & le son — festival hivernal extrême",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "portrait-primary",
    scope: "/",
    lang: "fr",
    dir: "ltr",
    categories: ["music", "events", "entertainment"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Programme",
        short_name: "Programme",
        description: "Voir le programme du festival",
        url: "/programme",
        icons: [
          {
            src: "/icon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Mes favoris",
        short_name: "Favoris",
        description: "Voir mes evenements favoris",
        url: "/favoris",
        icons: [
          {
            src: "/icon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Carte",
        short_name: "Plan",
        description: "Voir la carte du festival",
        url: "/carte",
        icons: [
          {
            src: "/icon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Page d'accueil du Naked Fest Winter'27",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "Page d'accueil du Naked Fest Winter'27",
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
