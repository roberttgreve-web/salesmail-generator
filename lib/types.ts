export type FormatType = "kurzerklart" | "360grad" | "sprachnachricht";

export const FORMAT_LABELS: Record<FormatType, string> = {
  kurzerklart: "#kurzerklärt",
  "360grad": "360-Grad-Rundgang",
  sprachnachricht: "Sprachnachricht / Mini-Games",
};

export const PRODUKTION_PREISE: Record<FormatType, number> = {
  kurzerklart: 4900,
  "360grad": 14900,
  sprachnachricht: 0,
};

export type SvGebiet = "regional" | "bundesland" | "bundesweit";

export const SV_PREISE: Record<SvGebiet, number> = {
  regional: 4500,
  bundesland: 6500,
  bundesweit: 9500,
};

export const SV_GEBIET_LABELS: Record<SvGebiet, string> = {
  regional: "Regional – 4.500 €/Jahr",
  bundesland: "Bundesland – 6.500 €/Jahr",
  bundesweit: "Bundesweit – 9.500 €/Jahr",
};

export const UNTERSCHRIFTEN = [
  "Franziska Miodek",
  "Ferdinand Sieglin",
  "Marie Hemmis",
  "Ann-Kathrin Fees",
  "Robert Greve",
] as const;

export type Unterschrift = (typeof UNTERSCHRIFTEN)[number];

export interface Person {
  vorname: string;
  nachname: string;
  geschlecht: "maennlich" | "weiblich";
}

export interface FormatData {
  type: FormatType;
  beispielTitel: string;
  beispielLink: string;
}

export interface FormData {
  anredeSiezen: boolean;
  personen: Person[];

  formate: FormatData[];

  svGebiet: SvGebiet;

  anhang: boolean;
  formalAngebot: boolean;
  followUp: boolean;
  followUpDatum: string;
  followUpUhrzeit: string;

  unterschrift: Unterschrift;
}

export const DEFAULT_FORM: FormData = {
  anredeSiezen: true,
  personen: [{ vorname: "", nachname: "", geschlecht: "weiblich" }],

  formate: [
    { type: "kurzerklart", beispielTitel: "", beispielLink: "" },
  ],

  svGebiet: "regional",

  anhang: false,
  formalAngebot: true,
  followUp: false,
  followUpDatum: "",
  followUpUhrzeit: "",

  unterschrift: "Robert Greve",
};
