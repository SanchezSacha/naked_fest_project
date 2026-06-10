export type EventData = {
  id: string;
  artist: string;
  category: string;
  genre: string;
  origin: string;
  date: string;
  time: string;
  duration: string;
  stage: string;
  image: string;
  accentColor: string;
  accentClass: string;
  accentBgClass: string;
  accentBorderClass: string;
  accentTextClass: string;
  layerA: string;
  layerB: string;
  description: string;
  temperature: string;
  db: string;
  rating: number;
};

export const events: Record<string, EventData> = {
  frontex: {
    id: "frontex",
    artist: "Frontex",
    category: "Concert",
    genre: "Techno Industrielle",
    origin: "DE",
    date: "SAM 25",
    time: "23:00",
    duration: "2H",
    stage: "Scène Glacier",
    image: "/event_1.png",
    accentColor: "#c8ff00",
    accentClass: "text-lime",
    accentBgClass: "bg-lime",
    accentBorderClass: "border-lime",
    accentTextClass: "text-dark",
    layerA: "text-pink",
    layerB: "text-cyan",
    description:
      "Frontex transforme l'acier et la glace en arme sonique. Beats industriels forgés dans la nuit arctique, rythmiques martelées au-delà du seuil humain. Une performance qui efface toute notion de confort et repousse les frontières du corps jusqu'à l'extase mécanique.",
    temperature: "-8°C",
    db: "115 DB",
    rating: 5,
  },
  "king-vibe": {
    id: "king-vibe",
    artist: "King Vibe",
    category: "Concert",
    genre: "Experimental Noise",
    origin: "NO",
    date: "DIM 26",
    time: "02:00",
    duration: "1H30",
    stage: "Sanctuaire de Glace",
    image: "/Event_2.png",
    accentColor: "#ff2d9b",
    accentClass: "text-pink",
    accentBgClass: "bg-pink",
    accentBorderClass: "border-pink",
    accentTextClass: "text-white",
    layerA: "text-cyan",
    layerB: "text-lime",
    description:
      "King Vibe orchestre le chaos. Noise expérimental surgi des fjords norvégiens, couches de fréquences brutes qui déchirent le silence des Ardennes en mille fragments lumineux. Aucune mélodie. Aucune pitié. Juste la vibration pure qui réorganise le monde depuis l'intérieur.",
    temperature: "-6°C",
    db: "118 DB",
    rating: 4,
  },
  "2nd-gen": {
    id: "2nd-gen",
    artist: "2nd-Gen",
    category: "Concert",
    genre: "Glitch Ambient",
    origin: "FR",
    date: "VEN 24",
    time: "22:00",
    duration: "1H45",
    stage: "Sanctuaire de Glace",
    image: "/event_3.png",
    accentColor: "#00f5ff",
    accentClass: "text-cyan",
    accentBgClass: "bg-cyan",
    accentBorderClass: "border-cyan",
    accentTextClass: "text-dark",
    layerA: "text-pink",
    layerB: "text-lime",
    description:
      "2nd-Gen ouvre le festival avec une plongée dans le glitch ambiant. Textures numériques fracturées, drones hypnotiques nés de l'ère du bug et de la dérive algorithmique. Le point zéro d'une nuit qui ne ressemble à aucune autre — l'ouverture rituelle du froid radical.",
    temperature: "-4°C",
    db: "108 DB",
    rating: 4,
  },
};

export type ReminderDelay = "HOURS_24" | "HOURS_2" | "MINUTES_30";

export type NotificationEntry = {
  eventId: string;
  delay: ReminderDelay;
};

const STORAGE_KEY = "naked_fest_notifications";

export function getNotifications(): NotificationEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveNotifications(entries: NotificationEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function isEventNotified(eventId: string): boolean {
  return getNotifications().some((n) => n.eventId === eventId);
}

export function getEventDelay(eventId: string): ReminderDelay {
  return getNotifications().find((n) => n.eventId === eventId)?.delay ?? "HOURS_2";
}

export function toggleNotification(eventId: string): boolean {
  const entries = getNotifications();
  const idx = entries.findIndex((n) => n.eventId === eventId);
  if (idx !== -1) {
    entries.splice(idx, 1);
    saveNotifications(entries);
    return false;
  } else {
    entries.push({ eventId, delay: "HOURS_2" });
    saveNotifications(entries);
    return true;
  }
}

export function setNotificationDelay(eventId: string, delay: ReminderDelay): void {
  const entries = getNotifications();
  const entry = entries.find((n) => n.eventId === eventId);
  if (entry) {
    entry.delay = delay;
    saveNotifications(entries);
  }
}
