export type DayId = "VEN" | "SAM" | "DIM";

export type FestivalEvent = {
  id: string;
  strapiId: number;
  title: string;
  artist: string;
  speakers: string[];
  category: "concerts" | "conferences" | "activites" | "stands";
  genre: string;
  genreId: string;
  origin: string;
  day: DayId;
  dateLabel: string;
  startsAt: string;
  endsAt: string;
  time: string;
  duration: string;
  stage: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  dateBg: string;
  dateText: string;
  accent: string;
  hoverBorder: string;
};
