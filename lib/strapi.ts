import type { FestivalEvent } from "@/lib/festival-events";

const fallbackImages = ["/event_1.png", "/Event_2.png", "/event_3.png"];

function getStrapiUrl() {
  return (process.env.STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
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

function getAttributes(item: Record<string, unknown>) {
  return (item.attributes && typeof item.attributes === "object"
    ? item.attributes
    : item) as Record<string, unknown>;
}

function getRelationName(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value.map(getRelationName).filter(Boolean).join(", ") || null;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data.map(getRelationName).filter(Boolean).join(", ") || null;
    }

    if (record.data && typeof record.data === "object") {
      return getRelationName(record.data);
    }

    const attrs = getAttributes(record);
    return String(attrs.name ?? attrs.title ?? attrs.label ?? "").trim() || null;
  }

  return null;
}

function getMediaUrl(value: unknown, fallback: string) {
  if (!value) return fallback;

  if (typeof value === "string") {
    return value.startsWith("http") || value.startsWith("/") ? value : fallback;
  }

  if (typeof value !== "object") return fallback;

  const record = value as Record<string, unknown>;
  const media = Array.isArray(record.data) ? record.data[0] : record.data ?? record;

  if (!media || typeof media !== "object") return fallback;

  const attrs = getAttributes(media as Record<string, unknown>);
  const url = attrs.url;

  if (typeof url !== "string") return fallback;
  if (url.startsWith("http")) return url;

  return `${getStrapiUrl()}${url}`;
}

function getDayId(startsAt: string | null, fallback: unknown): FestivalEvent["day"] {
  if (fallback === "VEN" || fallback === "SAM" || fallback === "DIM") {
    return fallback;
  }

  if (!startsAt) return "SAM";

  const day = new Date(startsAt).getDay();
  if (day === 5) return "VEN";
  if (day === 0) return "DIM";
  return "SAM";
}

function getTime(startsAt: string | null, fallback: unknown) {
  if (typeof fallback === "string" && fallback.trim()) return fallback;
  if (!startsAt) return "23:00";

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(startsAt));
}

function getDateLabel(day: FestivalEvent["day"], startsAt: string | null) {
  if (!startsAt) return `${day} 25`;
  const date = new Date(startsAt);
  return `${day} ${String(date.getDate()).padStart(2, "0")}`;
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

function mapStrapiEvent(item: Record<string, unknown>, index: number): FestivalEvent {
  const attrs = getAttributes(item);
  const startsAt = typeof attrs.startsAt === "string" ? attrs.startsAt : null;
  const endsAt = typeof attrs.endsAt === "string" ? attrs.endsAt : startsAt;
  const day = getDayId(startsAt, attrs.day);
  const style = getDayStyle(day);
  const genre = getRelationName(attrs.genre ?? attrs.musicGenre) ?? String(attrs.genreName ?? "Live").trim();
  const category = getRelationName(attrs.category) ?? String(attrs.type ?? "concerts").trim();
  const artist =
    getRelationName(attrs.artists ?? attrs.artist) ??
    String(attrs.artistName ?? attrs.title ?? "Evenement N'FEST").trim();
  const rawId = item.documentId ?? item.id ?? attrs.slug ?? attrs.id ?? slugify(artist);

  return {
    id: String(rawId),
    title: String(attrs.title ?? artist).trim(),
    day,
    dateLabel: getDateLabel(day, startsAt),
    startsAt: startsAt ?? "2027-01-25T23:00:00+01:00",
    endsAt: endsAt ?? startsAt ?? "2027-01-26T00:30:00+01:00",
    image: getMediaUrl(attrs.image ?? attrs.cover, fallbackImages[index % fallbackImages.length]),
    artist,
    speakers: artist.split(",").map((name) => name.trim()).filter(Boolean),
    genre,
    origin: String(attrs.origin ?? attrs.country ?? "FR").trim(),
    stage: getRelationName(attrs.location ?? attrs.stage) ?? String(attrs.stageName ?? "Scene principale").trim(),
    time: getTime(startsAt, attrs.time),
    duration: String(attrs.duration ?? "1H30").trim(),
    address: String(attrs.address ?? "Fatal Fields, Ardennes, France").trim(),
    latitude: Number(attrs.latitude ?? 49.763),
    longitude: Number(attrs.longitude ?? 4.7202),
    description: String(
      attrs.description ?? "Retrouvez toutes les informations de cet evenement N'FEST.",
    ).trim(),
    category: getCategory(category || "concerts"),
    genreId: slugify(genre || "live"),
    ...style,
  };
}

export async function fetchStrapiEvents(): Promise<FestivalEvent[]> {
  const baseUrl = getStrapiUrl();
  const url = new URL("/api/events", baseUrl);
  url.searchParams.set("populate", "*");
  url.searchParams.set("pagination[pageSize]", "100");
  url.searchParams.set("sort[0]", "startsAt:asc");

  const headers: HeadersInit = {};
  if (process.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error("Impossible de recuperer les evenements Strapi");
  }

  const payload = (await response.json()) as { data?: unknown };
  const data = Array.isArray(payload.data) ? payload.data : [];

  return data
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map(mapStrapiEvent);
}
