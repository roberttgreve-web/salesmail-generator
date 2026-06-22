import {
  FormData,
  FormatData,
  FORMAT_LABELS,
  Person,
  PRODUKTION_PREISE,
  SV_PREISE,
  SvGebiet,
} from "./types";

interface P {
  IhrEuer: string;
  IhnenDir: string;
  SieIhr: string;
  IhreEure: string;
  IhrerEurer: string;
  IhremEurem: string;
  IhrenEuren: string;
  erhaltenErhaltet: string;
  gebenGebt: string;
  findenFindet: string;
  sendeZu: string;
}

function pron(siezen: boolean): P {
  if (siezen) {
    return {
      IhrEuer: "Ihr",
      IhnenDir: "Ihnen",
      SieIhr: "Sie",
      IhreEure: "Ihre",
      IhrerEurer: "Ihrer",
      IhremEurem: "Ihrem",
      IhrenEuren: "Ihren",
      erhaltenErhaltet: "erhalten",
      gebenGebt: "geben",
      findenFindet: "finden Sie",
      sendeZu: "sende ich Ihnen",
    };
  }
  return {
    IhrEuer: "Euer",
    IhnenDir: "dir",
    SieIhr: "ihr",
    IhreEure: "Eure",
    IhrerEurer: "eurer",
    IhremEurem: "eurem",
    IhrenEuren: "euren",
    erhaltenErhaltet: "erhaltet",
    gebenGebt: "gebt",
    findenFindet: "findet ihr",
    sendeZu: "sende ich dir",
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
    }
    return p.geschlecht === "maennlich" ? `Lieber ${p.vorname}` : `Liebe ${p.vorname}`;
  });
  return parts.join(", ") + ",";
}

function gebietPhrase(gebiet: SvGebiet, p: P): string {
  if (gebiet === "regional") return `in ${p.IhrerEurer} Region`;
  if (gebiet === "bundesland") return `in ${p.IhremEurem} Bundesland`;
  return "bundesweit";
}

function formatPreis(n: number): string {
  return n.toLocaleString("de-DE");
}

function buildBerufsmediumSection(formate: FormatData[], p: P): string {
  const bullet = formate.length > 1 ? "• " : "";
  const lines: string[] = [];
  lines.push(`${p.IhrEuer} Berufsmedium`);
  lines.push("");

  formate.forEach((f) => {
    if (f.type === "sprachnachricht") {
      lines.push(
        `${bullet}${p.IhrEuer} Beruf wird bei uns lebendig und authentisch dargestellt – durch eine Sprachnachricht ${p.IhrerEurer} Auszubildenden und interaktive Mini-Games. Die Vertonung kann entweder direkt durch eine oder einen ${p.IhrerEurer} Auszubildenden erfolgen oder alternativ KI-gestützt produziert werden.`
      );
    }
    if (f.type === "kurzerklart") {
      lines.push(
        `${bullet}Mit #kurzerklärt präsentieren wir einen Ausbildungsberuf auf unterhaltsame, moderne und kompakte Weise. Wir begleiten den gesamten Produktionsprozess – vom Kickoff über das Drehbuch bis hin zu Schnitt und Vertonung.`
      );
      if (f.beispielTitel) {
        const ex = f.beispielLink
          ? `${f.beispielTitel} (${f.beispielLink})`
          : f.beispielTitel;
        lines.push(`${bullet}Hier eine Beispielproduktion: ${ex}`);
      }
    }
    if (f.type === "360grad") {
      lines.push(
        `${bullet}Mit einem aufregenden 360-Grad-Rundgang ${p.gebenGebt} ${p.SieIhr} Schüler*innen authentische Einblicke in ${p.IhreEure} Ausbildungs- und Betriebsräume.`
      );
      if (f.beispielTitel) {
        const ex = f.beispielLink
          ? `${f.beispielTitel} (${f.beispielLink})`
          : f.beispielTitel;
        lines.push(`${bullet}Hier eine Beispielproduktion: ${ex}`);
      }
    }
  });

  return lines.join("\n");
}

function buildSVSection(gebiet: SvGebiet, p: P): string {
  const medienboxLink = "https://www.deinerstertag.de/schulen/medienbox/";
  const videostundeLink = "https://www.deinerstertag.de/schulen/videostunde/";
  const schulsuche = "https://www.deinerstertag.de/schulsuche/";
  const phrase = gebietPhrase(gebiet, p);
  const zugang =
    gebiet === "bundesweit"
      ? "einen bundesweiten Zugang zu Schüler*innen"
      : `einen direkten Zugang zu Schüler*innen ${phrase}`;

  const lines: string[] = [];
  lines.push("Unsere Schulvermarktung");
  lines.push("");
  lines.push(
    `${p.IhreEure} Medien erreichen Schulen ${phrase} über drei zentrale Wege: unsere kostenfrei ausleihbare Medienbox (${medienboxLink}), unsere Videostunde (${videostundeLink}) mit praxisnahen Berufseinblicken direkt im Klassenzimmer sowie die Berufsberatung der Arbeitsagenturen. Mehr als die Hälfte aller deutschen Arbeitsagenturen nutzt unsere Formate bereits an Schulen und auf Messen.`
  );
  lines.push("");
  lines.push(
    `So ermöglichen wir ${p.IhnenDir} ${zugang} – mit einem Schülerkontakt, der bis zu 90 % günstiger ist als auf Schülermessen.`
  );
  lines.push("");
  lines.push(
    `Auf unserer Schulsuche (${schulsuche}) ${p.findenFindet} ${p.SieIhr}, welche Schulen derzeit ${phrase} bei uns aktiv sind.`
  );
  return lines.join("\n");
}

function buildNutzungsrechteSection(formate: FormatData[], p: P): string {
  const hasS = formate.some((f) => f.type === "sprachnachricht");
  const hasK = formate.some((f) => f.type === "kurzerklart");
  const has3 = formate.some((f) => f.type === "360grad");
  const medium = formate.length === 1 ? `${p.IhremEurem} Medium` : `${p.IhrenEuren} Medien`;

  let suffix: string;
  if (!hasS) {
    suffix =
      "zur unbefristeten freien Nutzung auf Messen, der Website, Social Media oder Events – auch über den Vertragszeitraum hinaus.";
  } else if (!hasK && !has3) {
    suffix =
      "zur freien Nutzung auf Messen, der Website, Social Media oder Events – bis zum Ende der Vertragslaufzeit.";
  } else if (hasK && !has3) {
    suffix =
      "zur freien Nutzung auf Messen, der Website, Social Media oder Events. Bei #kurzerklärt gelten die Rechte unbefristet, bei den Sprachnachrichten und den Mini-Games bis zum Ende der Vertragslaufzeit.";
  } else if (has3 && !hasK) {
    suffix =
      "zur freien Nutzung auf Messen, der Website, Social Media oder Events. Bei den 360-Grad-Rundgängen gelten die Rechte unbefristet, bei den Sprachnachrichten und den Mini-Games bis zum Ende der Vertragslaufzeit.";
  } else {
    suffix =
      "zur freien Nutzung auf Messen, der Website, Social Media oder Events. Bei den 360-Grad-Rundgängen und #kurzerklärt gelten die Rechte unbefristet, bei den Sprachnachrichten sowie den Mini-Games bis zum Ende der Vertragslaufzeit.";
  }

  return `Nutzungsrechte\n\n${p.SieIhr} ${p.erhaltenErhaltet} die Rechte an ${medium} ${suffix}`;
}

function buildKostenSection(formate: FormatData[], svGebiet: SvGebiet): string {
  const svPreis = SV_PREISE[svGebiet];
  const showFormatName = formate.length > 1;
  const lines: string[] = [];
  lines.push("Kosten");
  lines.push("");

  formate.forEach((f, i) => {
    if (i > 0) lines.push("");
    if (showFormatName) lines.push(FORMAT_LABELS[f.type]);
    const prod = PRODUKTION_PREISE[f.type];
    lines.push(
      `Produktion: ${formatPreis(prod)} €${f.type !== "sprachnachricht" ? " einmalig" : ""}`
    );
    lines.push(`Schulvermarktung: ${formatPreis(svPreis)} € jährlich`);
  });

  lines.push("");
  lines.push("Die Laufzeit der Schulvermarktung beträgt ein Jahr.");
  return lines.join("\n");
}

export function generateEmail(data: FormData): { betreff: string; text: string } {
  const p = pron(data.anredeSiezen);
  const anrede = buildAnrede(data.personen, data.anredeSiezen);
  const hasFormate = data.formate.length > 0;
  const lines: string[] = [];

  if (anrede) lines.push(anrede);
  lines.push("");
  lines.push(
    `vielen Dank für ${p.IhrEuer} Interesse an DEIN ERSTER TAG – dem größten Schulprogramm für Berufsorientierung in Deutschland.`
  );
  lines.push("");
  lines.push(
    `Ich freue mich sehr, ${p.IhnenDir} im Folgenden weitere Informationen zu unseren Angeboten zukommen zu lassen:`
  );

  if (hasFormate) {
    lines.push("");
    lines.push(buildBerufsmediumSection(data.formate, p));
  }

  lines.push("");
  lines.push(buildSVSection(data.svGebiet, p));

  if (hasFormate) {
    lines.push("");
    lines.push(buildNutzungsrechteSection(data.formate, p));
    lines.push("");
    lines.push(buildKostenSection(data.formate, data.svGebiet));
  }

  if (data.formalAngebot) {
    lines.push("");
    lines.push(`Auf Wunsch erstelle ich ${p.IhnenDir} gerne auch ein formelles Angebot.`);
  }

  if (data.anhang) {
    lines.push("");
    lines.push(`Gerne ${p.sendeZu} anbei unsere Alleinstellungsmerkmale zu.`);
  }

  if (data.followUp && (data.followUpDatum || data.followUpUhrzeit)) {
    const termin = [
      data.followUpDatum,
      data.followUpUhrzeit ? `um ${data.followUpUhrzeit} Uhr` : "",
    ]
      .filter(Boolean)
      .join(" ");
    lines.push("");
    lines.push(`Ich freue mich auf unser Follow-up am ${termin}.`);
  } else {
    lines.push("");
    lines.push(`Bei weiteren Fragen stehe ich ${p.IhnenDir} jederzeit gern zur Verfügung.`);
  }

  lines.push("");
  lines.push("Mit besten Grüßen");
  lines.push("");
  lines.push(data.unterschrift);

  return { betreff: "Die Angebote von DEIN ERSTER TAG", text: lines.join("\n") };
}
