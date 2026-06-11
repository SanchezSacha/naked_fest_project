import type { FestivalEvent } from "@/lib/festival-events";

type JsonRecord = Record<string, unknown>;

export type HomeFeature = {
  icon: string;
  iconAlt: string;
  title: string;
  description: string;
};

export type HomeStat = {
  value: string;
  label: string;
  color: "lime" | "pink" | "cyan" | "violet";
};

export type PracticalInfo = {
  number: string;
  color: "lime" | "pink" | "cyan" | "violet";
  title: string;
  body: string;
};

export type StrapiHomePage = {
  heroEyebrow: string;
  title: string;
  edition: string;
  tagline: string;
  locationLabel: string;
  heroImage: string;
  features: HomeFeature[];
  stats: HomeStat[];
  featuredEvents: FestivalEvent[];
  mapTitle: string;
  mapSubtitle: string;
  mapDescription: string;
  mapImage: string;
  practicalInfos: PracticalInfo[];
};

function getStrapiUrl() {
  return (process.env.STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {};
  if (process.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }
  return headers;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCategory(value: string): FestivalEvent["category"] {
  const category = slugify(value);
  if (category.includes("conference")) return "conferences";
  if (category.includes("activite")) return "activites";
  if (category.includes("stand")) return "stands";
  return "concerts";
}

function getAttributes(item: JsonRecord) {
  return (item.attributes && typeof item.attributes === "object"
    ? item.attributes
    : item) as JsonRecord;
}

function relationItems(value: unknown): JsonRecord[] {
  if (!value || typeof value !== "object") return [];
  const record = value as JsonRecord;
  const data = record.data ?? value;
  if (Array.isArray(data)) {
    return data.filter((item): item is JsonRecord => Boolean(item) && typeof item === "object");
  }
  return data && typeof data === "object" ? [data as JsonRecord] : [];
}

function getRelationName(value: unknown): string | null {
  const item = relationItems(value)[0];
  if (!item) return typeof value === "string" ? value : null;
  const attrs = getAttributes(item);
  return String(attrs.name ?? attrs.title ?? attrs.label ?? "").trim() || null;
}

function getEventArtistNames(value: unknown): string[] {
  return relationItems(value)
    .sort((a, b) => Number(getAttributes(a).order ?? 0) - Number(getAttributes(b).order ?? 0))
    .map((item) => getRelationName(getAttributes(item).artist))
    .filter((name): name is string => Boolean(name));
}

function getMediaUrl(value: unknown) {
  const item =
    relationItems(value)[0] ??
    (value && typeof value === "object" ? (value as JsonRecord) : null);
  if (!item) throw new Error("Un media requis est absent dans Strapi.");
  const url = getAttributes(item).url;
  if (typeof url !== "string" || !url) throw new Error("URL de media Strapi invalide.");
  if (url.startsWith("/uploads/")) {
    return `/api/strapi/media/${url.slice("/uploads/".length)}`;
  }
  return url;
}

function getDayId(startsAt: string, value: unknown): FestivalEvent["day"] {
  if (value === "VEN" || value === "SAM" || value === "DIM") return value;
  const day = new Date(startsAt).getDay();
  if (day === 5) return "VEN";
  if (day === 0) return "DIM";
  return "SAM";
}

function getTime(startsAt: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Paris",
  }).format(new Date(startsAt));
}

function getDuration(startsAt: string, endsAt: string) {
  const minutes = Math.max(0, Math.round((Date.parse(endsAt) - Date.parse(startsAt)) / 60_000));
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours ? `${hours}H` : ""}${remaining ? String(remaining).padStart(2, "0") : ""}` || "0H";
}

function getDayStyle(day: FestivalEvent["day"]) {
  if (day === "VEN") {
    return {
      dateBg: "bg-cyan",
      dateText: "text-dark",
      accent: "text-cyan",
      hoverBorder: "group-hover:[border-top-color:#00f5ff]",
    };
  }
  if (day === "DIM") {
    return {
      dateBg: "bg-pink",
      dateText: "text-white",
      accent: "text-pink",
      hoverBorder: "group-hover:[border-top-color:#ff2d9b]",
    };
  }
  return {
    dateBg: "bg-lime",
    dateText: "text-dark",
    accent: "text-lime",
    hoverBorder: "group-hover:[border-top-color:#c8ff00]",
  };
}

function mapStrapiEvent(item: JsonRecord): FestivalEvent {
  const attrs = getAttributes(item);
  const startsAt = String(attrs.startsAt ?? "");
  const endsAt = String(attrs.endsAt ?? startsAt);
  if (!startsAt || !endsAt) throw new Error("Dates d'evenement Strapi manquantes.");

  const day = getDayId(startsAt, attrs.day);
  const names = getEventArtistNames(attrs.eventArtists);
  const artist = names[0] ?? String(attrs.title ?? "");
  const genre = getRelationName(attrs.genre) ?? "";
  const locationItem = relationItems(attrs.location)[0];
  const location = locationItem ? getAttributes(locationItem) : {};
  const category = getRelationName(attrs.category) ?? String(attrs.type ?? "");
  const id = String(attrs.slug ?? item.documentId ?? item.id ?? "");
  const strapiId = Number(item.id ?? attrs.id);
  if (!id || !Number.isInteger(strapiId) || !artist || !genre) {
    throw new Error("Relations d'evenement Strapi incompletes.");
  }

  return {
    id,
    strapiId,
    title: String(attrs.title ?? artist),
    artist,
    speakers: names.length > 0 ? names : [artist],
    category: getCategory(category),
    genre,
    genreId: slugify(genre),
    origin: String(attrs.origin ?? ""),
    day,
    dateLabel: `${day} ${String(new Date(startsAt).getDate()).padStart(2, "0")}`,
    startsAt,
    endsAt,
    time: getTime(startsAt),
    duration: getDuration(startsAt, endsAt),
    stage: String(location.name ?? ""),
    address: String(location.address ?? ""),
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
    description: String(attrs.description ?? ""),
    image: getMediaUrl(attrs.image),
    ...getDayStyle(day),
  };
}

function addEventPopulate(url: URL, prefix = "populate") {
  url.searchParams.set(`${prefix}[image]`, "true");
  url.searchParams.set(`${prefix}[category]`, "true");
  url.searchParams.set(`${prefix}[genre]`, "true");
  url.searchParams.set(`${prefix}[location]`, "true");
  url.searchParams.set(`${prefix}[eventArtists][populate][artist]`, "true");
}

export async function fetchStrapiEvents(): Promise<FestivalEvent[]> {
  const url = new URL("/api/events", getStrapiUrl());
  addEventPopulate(url);
  url.searchParams.set("pagination[pageSize]", "100");
  url.searchParams.set("sort[0]", "startsAt:asc");

  const response = await fetch(url, { headers: getHeaders(), next: { revalidate: 30 } });
  if (!response.ok) throw new Error(`Strapi events: HTTP ${response.status}`);

  const payload = (await response.json()) as { data?: unknown };
  return (Array.isArray(payload.data) ? payload.data : [])
    .filter((item): item is JsonRecord => Boolean(item) && typeof item === "object")
    .map(mapStrapiEvent);
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function fetchStrapiHomePage(): Promise<StrapiHomePage> {
  const url = new URL("/api/home-page", getStrapiUrl());
  url.searchParams.set("populate[heroImage]", "true");
  url.searchParams.set("populate[mapImage]", "true");
  addEventPopulate(url, "populate[featuredEvents][populate]");

  const response = await fetch(url, { headers: getHeaders(), next: { revalidate: 30 } });
  if (!response.ok) throw new Error(`Strapi home page: HTTP ${response.status}`);

  const payload = (await response.json()) as { data?: JsonRecord };
  if (!payload.data) throw new Error("La page d'accueil Strapi est vide.");
  const attrs = getAttributes(payload.data);

  return {
    heroEyebrow: String(attrs.heroEyebrow ?? ""),
    title: String(attrs.title ?? ""),
    edition: String(attrs.edition ?? ""),
    tagline: String(attrs.tagline ?? ""),
    locationLabel: String(attrs.locationLabel ?? ""),
    heroImage: getMediaUrl(attrs.heroImage),
    features: asArray<HomeFeature>(attrs.features),
    stats: asArray<HomeStat>(attrs.stats),
    featuredEvents: relationItems(attrs.featuredEvents).map(mapStrapiEvent),
    mapTitle: String(attrs.mapTitle ?? ""),
    mapSubtitle: String(attrs.mapSubtitle ?? ""),
    mapDescription: String(attrs.mapDescription ?? ""),
    mapImage: getMediaUrl(attrs.mapImage),
    practicalInfos: asArray<PracticalInfo>(attrs.practicalInfos),
  };
}
