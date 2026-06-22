export type FormatType = "kurzerklart" | "360grad" | "insights" | "sprachnachricht";

export const FORMAT_LABELS: Record<FormatType, string> = {
  kurzerklart: "#kurzerklärt",
  "360grad": "360-Grad",
  insights: "Insights",
  sprachnachricht: "Sprachnachricht & Mini-Games",
};

export interface FormatData {
  type: FormatType;
  beispielTitel: string;
  beispielLink: string;
  preisProduktion: string;
  preisProduktion2: string;
}

export interface FormData {
  anredeSiezen: boolean;
  anredePraefix: "Liebe" | "Lieber" | "Liebe/r";
  namen: [string, string, string];
  unternehmen: string;

  formate: FormatData[];

  schulvermarktung: boolean;
  svGebiet: string;
  svPreis: string;
  svLaufzeit: string;
  svMedienbox: boolean;
  svVideostunde: boolean;
  svSchulenInfo: string;

  anhang: boolean;
  anhangText: string;
  formalAngebot: boolean;

  grusszeile: "standard" | "berlin";
  unterschrift: string;
  followUpText: string;
}

export const DEFAULT_FORM: FormData = {
  anredeSiezen: true,
  anredePraefix: "Liebe",
  namen: ["", "", ""],
  unternehmen: "",

  formate: [
    {
      type: "kurzerklart",
      beispielTitel: "",
      beispielLink: "",
      preisProduktion: "",
      preisProduktion2: "",
    },
  ],

  schulvermarktung: true,
  svGebiet: "",
  svPreis: "",
  svLaufzeit: "",
  svMedienbox: true,
  svVideostunde: true,
  svSchulenInfo: "",

  anhang: false,
  anhangText: "Alleinstellungsmerkmale",
  formalAngebot: true,

  grusszeile: "standard",
  unterschrift: "Robert Greve",
  followUpText: "",
};
