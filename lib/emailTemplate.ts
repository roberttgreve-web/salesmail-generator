import { FormData, FormatData, FORMAT_LABELS } from "./types";

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

function buildNamen(namen: [string, string, string]): string {
  return namen.filter((n) => n.trim()).join(", ");
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
        lines.push(`Ein Beispiel aus der Praxis: ${format.beispielTitel} (${format.beispielLink})`);
      } else {
        lines.push(`Ein Beispiel aus der Praxis: ${format.beispielTitel}`);
      }
    }
  }

  return lines.join("\n");
}

function buildSVSection(data: FormData, p: Pronomen): string {
  const lines: string[] = [];
  lines.push("Schulvermarktung");
  lines.push("");

  const medienboxLink = "https://www.deinerstertag.de/schulen/medienbox/";
  const videostundeLink = "https://www.deinerstertag.de/schulen/videostunde/";
  const schulsuche = "https://www.deinerstertag.de/schulsuche/";

  const gebiet = data.svGebiet
    ? ` in ${p.deinerIhrer} Region (${data.svGebiet})`
    : ` in ${p.deinerIhrer} Region`;

  let svText: string;
  if (!data.svMedienbox && !data.svVideostunde) {
    svText = `${p.deineIhre} Medien erreichen Schulen und Arbeitsagenturen${gebiet}.`;
  } else if (!data.svMedienbox) {
    svText = `${p.deineIhre} Medien erreichen Schulen und Arbeitsagenturen${gebiet}. Unsere Videostunde (${videostundeLink}) bringt praxisnahe Berufseinblicke direkt ins Klassenzimmer – gehalten von unserer Videolehrkraft vom Smartboard, inklusive kostenlosem Unterrichtsmaterial.`;
  } else if (!data.svVideostunde) {
    svText = `${p.deineIhre} Medien erreichen Schulen und Arbeitsagenturen${gebiet} über unsere Medienbox (${medienboxLink}), die Lehrkräfte kostenfrei ausleihen können – inklusive unseres mobilen Routers „BerUFO", mit dem Schüler*innen ${p.deineIhre.toLowerCase()} Medien auch ohne Schul-WLAN direkt im Klassenzimmer streamen können.`;
  } else {
    svText = `${p.deineIhre} Medien erreichen Schulen und Arbeitsagenturen${gebiet} über zwei Instrumente: Lehrkräfte können unsere Medienbox (${medienboxLink}) kostenfrei ausleihen – inklusive unseres mobilen Routers „BerUFO", mit dem Schüler*innen ${p.deineIhre.toLowerCase()} Medien auch ohne Schul-WLAN direkt im Klassenzimmer streamen können. Unsere Videostunde (${videostundeLink}) bringt darüber hinaus praxisnahe Berufseinblicke direkt ins Klassenzimmer – gehalten von unserer Videolehrkraft vom Smartboard, inklusive kostenlosem Unterrichtsmaterial.`;
  }

  lines.push(svText);

  if (data.svSchulenInfo) {
    lines.push("");
    lines.push(data.svSchulenInfo);
  }

  lines.push("");
  lines.push(
    `Eine Übersicht unserer Partnerschulen ${p.findestFinden} hier: Zu unseren Partnerschulen (${schulsuche})`
  );

  return lines.join("\n");
}

function buildKostenSection(data: FormData): string {
  const lines: string[] = [];
  lines.push("Kosten (netto)");
  lines.push("");

  data.formate.forEach((f) => {
    const label = FORMAT_LABELS[f.type];
    const prod =
      f.type === "sprachnachricht" ? f.preisProduktion || "0" : f.preisProduktion;

    if (!prod && f.type !== "sprachnachricht") return;

    let line: string;
    if (f.preisProduktion2) {
      line = `${label} Produktion (einmalig): ${prod} € (mit Schulprogramm) / ${f.preisProduktion2} € (ohne Schulprogramm)`;
    } else {
      line = `${label} Produktion (einmalig): ${prod} €`;
    }

    if (data.schulvermarktung && data.svPreis) {
      line += ` Schulprogramm (jährlich): ${data.svPreis} €`;
    }

    lines.push(line);
  });

  if (data.schulvermarktung && data.svLaufzeit) {
    lines.push("");
    lines.push(`Die Vertragslaufzeit für das Schulprogramm beträgt ${data.svLaufzeit}.`);
  }

  return lines.join("\n");
}

export function generateEmail(data: FormData): { betreff: string; text: string } {
  const p = getPronomen(data.anredeSiezen);
  const namen = buildNamen(data.namen);
  const hasFormate = data.formate.length > 0;

  const betreff = "Die Angebote von DEIN ERSTER TAG";

  const lines: string[] = [];

  lines.push(`${data.anredePraefix} ${namen},`);
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

  const hasKosten =
    hasFormate &&
    (data.formate.some(
      (f) => f.type === "sprachnachricht" || f.preisProduktion
    ) ||
      (data.schulvermarktung && data.svPreis));

  if (hasKosten) {
    lines.push("");
    lines.push(buildKostenSection(data));
  }

  if (data.anhang) {
    lines.push("");
    lines.push(`Siehe anbei: ${data.anhangText}.`);
  }

  if (data.formalAngebot) {
    lines.push("");
    lines.push(`Auf Wunsch erstelle ich ${p.euchIhnen} gerne auch ein formelles Angebot.`);
  }

  lines.push("");
  if (data.followUpText) {
    lines.push(`Ich freue mich auf unser Follow-up am ${data.followUpText}.`);
  } else {
    lines.push(
      `Bei weiteren Fragen stehe ich ${p.euchIhnen} jederzeit gern zur Verfügung.`
    );
  }

  lines.push("");
  lines.push(data.grusszeile === "berlin" ? "Viele Grüße aus Berlin" : "Viele Grüße");
  lines.push("");
  lines.push(data.unterschrift);

  return { betreff, text: lines.join("\n") };
}
