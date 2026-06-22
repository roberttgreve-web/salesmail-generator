import {
  FormData,
  FormatData,
  FORMAT_LABELS,
  Person,
  PRODUKTION_PREISE,
  SV_PREISE,
  SvGebiet,
} from "./types";

interface Pronomen {
  deinIhr: string;
  dirIhnen: string;
  erhaeltErhalten: string;
  deinemIhrem: string;
  deineIhre: string;
  deinerIhrer: string;
  findestFinden: string;
  euchIhnen: string;
  ihrenEuren: string;
}

function getPronomen(siezen: boolean): Pronomen {
  if (siezen) {
    return {
      deinIhr: "Ihr",
      dirIhnen: "Ihnen",
      erhaeltErhalten: "Sie erhalten",
      deinemIhrem: "Ihrem",
      deineIhre: "Ihre",
      deinerIhrer: "Ihrer",
      findestFinden: "finden Sie",
      euchIhnen: "Ihnen",
      ihrenEuren: "Ihren",
    };
  }
  return {
    deinIhr: "dein",
    dirIhnen: "dir",
    erhaeltErhalten: "du erhältst",
    deinemIhrem: "deinem",
    deineIhre: "Eure",
    deinerIhrer: "eurer",
    findestFinden: "findet ihr",
    euchIhnen: "euch",
    ihrenEuren: "euren",
  };
}

function buildAnrede(personen: Person[], siezen: boolean): string {
  const active = personen.filter((p) => p.vorname.trim() || p.nachname.trim());
  if (active.length === 0) return "";
  const parts = active.map((p) => {
    if (siezen) {
      return p.geschlecht === "maennlich"
        ? `Sehr geehrter Herr ${p.nachname}`
        : `Sehr geehrte Frau ${p.nachname}`;
    } else {
      return p.geschlecht === "maennlich"
        ? `Lieber ${p.vorname}`
        : `Liebe ${p.vorname}`;
    }
  });
  return parts.join(", ") + ",";
}

function gebietPhrase(gebiet: SvGebiet, siezen: boolean): string {
  if (gebiet === "regional") return siezen ? "in Ihrer Region" : "in eurer Region";
  if (gebiet === "bundesland") return siezen ? "in Ihrem Bundesland" : "in eurem Bundesland";
  return "bundesweit";
}

function formatPreis(n: number): string {
  return n.toLocaleString("de-DE");
}

const ANZAHL_WEGE = ["einen Weg", "zwei Wege", "drei Wege", "vier Wege"];

function buildFormatSection(format: FormatData, index: number, p: Pronomen): string {
  const label = FORMAT_LABELS[format.type];
  const lines: string[] = [];

  lines.push(`${index + 1}. ${label}`);
  lines.push("");

  if (format.type === "sprachnachricht") {
    lines.push(
      `Wir stellen ${p.ihrenEuren} Beruf durch eine Sprachnachricht ${p.deinerIhrer} Azubis und mithilfe von Mini-Games dar – wahlweise eingesprochen durch eine/n ${p.deinerIhrer} Auszubildenden oder per KI produziert.`
    );
  } else {
    lines.push(
      `Vom Kickoff über das Drehbuch bis zu Schnitt und Vertonung übernehmen wir die gesamte Produktion – ${p.erhaeltErhalten} die Rechte an ${p.deinemIhrem} Medium zur freien Nutzung.`
    );
    if (format.beispielTitel) {
      lines.push("");
      if (format.beispielLink) {
        lines.push(
          `Ein Beispiel aus der Praxis: ${format.beispielTitel} (${format.beispielLink})`
        );
      } else {
        lines.push(`Ein Beispiel aus der Praxis: ${format.beispielTitel}`);
      }
    }
  }

  return lines.join("\n");
}

function buildSVSection(data: FormData, p: Pronomen): string {
  const medienboxLink = "https://www.deinerstertag.de/schulen/medienbox/";
  const videostundeLink = "https://www.deinerstertag.de/schulen/videostunde/";
  const schulsuche = "https://www.deinerstertag.de/schulsuche/";

  const phrase = gebietPhrase(data.svGebiet, data.anredeSiezen);

  const lines: string[] = [];
  lines.push("Schulvermarktung");
  lines.push("");
  lines.push(
    `${p.deineIhre} Medien erreichen Schulen und Arbeitsagenturen ${phrase} über zwei Instrumente: Lehrkräfte können unsere Medienbox (${medienboxLink}) kostenfrei ausleihen – inklusive unseres mobilen Routers „BerUFO", mit dem Schüler*innen ${p.deineIhre.toLowerCase()} Medien auch ohne Schul-WLAN direkt im Klassenzimmer streamen können. Unsere Videostunde (${videostundeLink}) bringt darüber hinaus praxisnahe Berufseinblicke direkt ins Klassenzimmer – gehalten von unserer Videolehrkraft vom Smartboard, inklusive kostenlosem Unterrichtsmaterial.`
  );
  lines.push("");
  lines.push(
    `Eine Übersicht unserer Partnerschulen ${p.findestFinden} hier: Zu unseren Partnerschulen (${schulsuche})`
  );

  return lines.join("\n");
}

function buildKostenSection(data: FormData): string {
  const svPreis = data.schulvermarktung ? SV_PREISE[data.svGebiet] : null;

  const lines: string[] = [];
  lines.push("Kosten (netto)");
  lines.push("");

  data.formate.forEach((f) => {
    const label = FORMAT_LABELS[f.type];
    const prod = PRODUKTION_PREISE[f.type];
    let line = `${label} Produktion (einmalig): ${formatPreis(prod)} €`;
    if (svPreis !== null) {
      line += ` Schulprogramm (jährlich): ${formatPreis(svPreis)} €`;
    }
    lines.push(line);
  });

  if (data.schulvermarktung && data.svLaufzeit) {
    lines.push("");
    lines.push(
      `Die Vertragslaufzeit für das Schulprogramm beträgt ${data.svLaufzeit}.`
    );
  }

  return lines.join("\n");
}

export function generateEmail(data: FormData): { betreff: string; text: string } {
  const p = getPronomen(data.anredeSiezen);
  const anrede = buildAnrede(data.personen, data.anredeSiezen);
  const hasFormate = data.formate.length > 0;

  const lines: string[] = [];

  if (anrede) lines.push(anrede);
  lines.push("");
  lines.push(
    `vielen Dank für ${p.deinIhr} Interesse an den Angeboten von DEIN ERSTER TAG – ich freue mich, ${p.dirIhnen} hiermit Informationen zukommen zu lassen.`
  );

  if (hasFormate) {
    lines.push("");
    const anzahl = ANZAHL_WEGE[Math.min(data.formate.length - 1, 3)];
    lines.push(
      `Es gibt ${anzahl}, Schüler*innen ${p.ihrenEuren} Beruf anschaulich darzustellen:`
    );
    lines.push("");
    lines.push("Medienproduktion");
    lines.push("");
    data.formate.forEach((f, i) => {
      if (i > 0) lines.push("");
      lines.push(buildFormatSection(f, i, p));
    });
  }

  if (data.schulvermarktung) {
    lines.push("");
    lines.push(buildSVSection(data, p));
  }

  if (hasFormate) {
    lines.push("");
    lines.push(buildKostenSection(data));
  }

  if (data.anhang) {
    lines.push("");
    lines.push(`Siehe anbei: ${data.anhangText}.`);
  }

  if (data.formalAngebot) {
    lines.push("");
    lines.push(
      `Auf Wunsch erstelle ich ${p.euchIhnen} gerne auch ein formelles Angebot.`
    );
  }

  lines.push("");
  if (data.followUp && (data.followUpDatum || data.followUpUhrzeit)) {
    const termin = [
      data.followUpDatum,
      data.followUpUhrzeit ? `um ${data.followUpUhrzeit} Uhr` : "",
    ]
      .filter(Boolean)
      .join(" ");
    lines.push(`Ich freue mich auf unser Follow-up am ${termin}.`);
  } else {
    lines.push(
      `Bei weiteren Fragen stehe ich ${p.euchIhnen} jederzeit gern zur Verfügung.`
    );
  }

  lines.push("");
  lines.push("Beste Grüße");
  lines.push("");
  lines.push(data.unterschrift);

  return { betreff: "Die Angebote von DEIN ERSTER TAG", text: lines.join("\n") };
}
