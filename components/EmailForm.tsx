"use client";

import { FormData, FormatData, FormatType, FORMAT_LABELS } from "@/lib/types";

const FORMAT_OPTIONS: FormatType[] = ["kurzerklart", "360grad", "insights", "sprachnachricht"];

interface Props {
  data: FormData;
  onChange: (data: FormData) => void;
}

function SectionHeader({ num, label }: { num: number; label: string }) {
  return (
    <div className="flex items-center mb-3">
      <span className="section-number">{num}</span>
      <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{label}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default function EmailForm({ data, onChange }: Props) {
  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    onChange({ ...data, [key]: value });
  }

  function setName(idx: number, value: string) {
    const namen = [...data.namen] as [string, string, string];
    namen[idx] = value;
    set("namen", namen);
  }

  function toggleFormat(type: FormatType) {
    const exists = data.formate.find((f) => f.type === type);
    if (exists) {
      set("formate", data.formate.filter((f) => f.type !== type));
    } else {
      const newFormat: FormatData = {
        type,
        beispielTitel: "",
        beispielLink: "",
        preisProduktion: "",
        preisProduktion2: "",
      };
      // maintain order
      const ordered = FORMAT_OPTIONS.map((t) =>
        data.formate.find((f) => f.type === t) || (t === type ? newFormat : null)
      ).filter(Boolean) as FormatData[];
      set("formate", ordered);
    }
  }

  function updateFormat(type: FormatType, key: keyof FormatData, value: string) {
    set(
      "formate",
      data.formate.map((f) => (f.type === type ? { ...f, [key]: value } : f))
    );
  }

  const activeNames = data.namen.filter((n) => n.trim()).length;

  return (
    <div className="h-full overflow-y-auto p-4" style={{ width: "100%" }}>
      {/* Sektion 1: Ansprache */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <SectionHeader num={1} label="Ansprache" />

        <Field label="Anrede">
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer" style={{ marginBottom: 0 }}>
              <input
                type="radio"
                name="anrede"
                checked={data.anredeSiezen}
                onChange={() => set("anredeSiezen", true)}
              />
              <span className="text-sm">Siezen</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer" style={{ marginBottom: 0 }}>
              <input
                type="radio"
                name="anrede"
                checked={!data.anredeSiezen}
                onChange={() => set("anredeSiezen", false)}
              />
              <span className="text-sm">Duzen</span>
            </label>
          </div>
        </Field>

        <Field label="Anredeform">
          <select
            value={data.anredePraefix}
            onChange={(e) => set("anredePraefix", e.target.value as FormData["anredePraefix"])}
          >
            <option value="Liebe">Liebe</option>
            <option value="Lieber">Lieber</option>
            <option value="Liebe/r">Liebe/r</option>
          </select>
        </Field>

        <Field label="Name(n) Ansprechpartner*in">
          <input
            type="text"
            placeholder="z.B. Frau Ritzinger-Roll"
            value={data.namen[0]}
            onChange={(e) => setName(0, e.target.value)}
            className="mb-1"
          />
          <input
            type="text"
            placeholder="2. Person (optional)"
            value={data.namen[1]}
            onChange={(e) => setName(1, e.target.value)}
            className="mb-1"
          />
          {(activeNames >= 2 || data.namen[1]) && (
            <input
              type="text"
              placeholder="3. Person (optional)"
              value={data.namen[2]}
              onChange={(e) => setName(2, e.target.value)}
            />
          )}
        </Field>

        <Field label="Unternehmen / Organisation">
          <input
            type="text"
            placeholder="z.B. JELBA GmbH"
            value={data.unternehmen}
            onChange={(e) => set("unternehmen", e.target.value)}
          />
        </Field>
      </div>

      {/* Sektion 2: Formate */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <SectionHeader num={2} label="Formate" />

        <div className="flex flex-wrap gap-2 mb-3">
          {FORMAT_OPTIONS.map((type) => {
            const active = data.formate.some((f) => f.type === type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleFormat(type)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? "bg-[#111116] text-white border-[#111116]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                }`}
              >
                {FORMAT_LABELS[type]}
              </button>
            );
          })}
        </div>

        {data.formate.map((format) => (
          <div key={format.type} className="border border-gray-200 rounded-md p-3 mb-2">
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
              {FORMAT_LABELS[format.type]}
            </div>

            <Field label="Beispielmedium – Berufsbezeichnung / Titel">
              <input
                type="text"
                placeholder="z.B. Fachkraft für Lagerlogistik (DSV)"
                value={format.beispielTitel}
                onChange={(e) => updateFormat(format.type, "beispielTitel", e.target.value)}
              />
            </Field>

            <Field label="Beispielmedium – Link (URL)">
              <input
                type="url"
                placeholder="https://..."
                value={format.beispielLink}
                onChange={(e) => updateFormat(format.type, "beispielLink", e.target.value)}
              />
            </Field>

            {format.type !== "sprachnachricht" && (
              <>
                <Field label="Preis Produktion (einmalig) €">
                  <input
                    type="text"
                    placeholder="z.B. 4.900"
                    value={format.preisProduktion}
                    onChange={(e) => updateFormat(format.type, "preisProduktion", e.target.value)}
                  />
                </Field>
                <Field label="2. Preisvariante (optional, z.B. ohne Schulprogramm) €">
                  <input
                    type="text"
                    placeholder="z.B. 6.900"
                    value={format.preisProduktion2}
                    onChange={(e) => updateFormat(format.type, "preisProduktion2", e.target.value)}
                  />
                </Field>
              </>
            )}
          </div>
        ))}

        {data.formate.length === 0 && (
          <p className="text-xs text-gray-400 italic">Bitte mindestens ein Format auswählen.</p>
        )}
      </div>

      {/* Sektion 3: Schulvermarktung */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <SectionHeader num={3} label="Schulvermarktung" />

        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => set("schulvermarktung", true)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              data.schulvermarktung
                ? "bg-[#111116] text-white border-[#111116]"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            Ja, inkl. Schulprogramm
          </button>
          <button
            type="button"
            onClick={() => set("schulvermarktung", false)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              !data.schulvermarktung
                ? "bg-[#111116] text-white border-[#111116]"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            Nein
          </button>
        </div>

        {data.schulvermarktung && (
          <>
            <Field label="Gebiet">
              <input
                type="text"
                placeholder="z.B. bundesweit / ganz NRW / 50-km-Radius um Berlin"
                value={data.svGebiet}
                onChange={(e) => set("svGebiet", e.target.value)}
              />
            </Field>

            <Field label="Preis Schulprogramm (jährlich) €">
              <input
                type="text"
                placeholder="z.B. 4.500"
                value={data.svPreis}
                onChange={(e) => set("svPreis", e.target.value)}
              />
            </Field>

            <Field label="Vertragslaufzeit (optional)">
              <input
                type="text"
                placeholder="z.B. 1 Jahr"
                value={data.svLaufzeit}
                onChange={(e) => set("svLaufzeit", e.target.value)}
              />
            </Field>

            <Field label="Instrumente erwähnen">
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer" style={{ marginBottom: 0 }}>
                  <input
                    type="checkbox"
                    checked={data.svMedienbox}
                    onChange={(e) => set("svMedienbox", e.target.checked)}
                  />
                  <span className="text-sm">Medienbox</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer" style={{ marginBottom: 0 }}>
                  <input
                    type="checkbox"
                    checked={data.svVideostunde}
                    onChange={(e) => set("svVideostunde", e.target.checked)}
                  />
                  <span className="text-sm">Videostunde</span>
                </label>
              </div>
            </Field>

            <Field label="Schulen / Arbeitsagenturen (optional, z.B. ‚XXX Schulen + 43 Arbeitsagenturen')">
              <input
                type="text"
                placeholder="z.B. XXX Schulen + 43 Arbeitsagenturen in NRW"
                value={data.svSchulenInfo}
                onChange={(e) => set("svSchulenInfo", e.target.value)}
              />
            </Field>
          </>
        )}
      </div>

      {/* Sektion 4: Zusätze */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <SectionHeader num={4} label="Zusätze" />

        <div className="mb-3">
          <label className="flex items-center gap-2 cursor-pointer" style={{ marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={data.anhang}
              onChange={(e) => set("anhang", e.target.checked)}
            />
            <span className="text-sm font-medium">Anhang erwähnen</span>
          </label>
          {data.anhang && (
            <input
              type="text"
              className="mt-1.5"
              placeholder="z.B. Alleinstellungsmerkmale"
              value={data.anhangText}
              onChange={(e) => set("anhangText", e.target.value)}
            />
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer" style={{ marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={data.formalAngebot}
              onChange={(e) => set("formalAngebot", e.target.checked)}
            />
            <span className="text-sm font-medium">Formelles Angebot anbieten</span>
          </label>
        </div>
      </div>

      {/* Sektion 5: Abschluss */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <SectionHeader num={5} label="Abschluss" />

        <Field label="Follow-up Termin (optional — ersetzt 'Bei weiteren Fragen...')">
          <input
            type="text"
            placeholder="z.B. 6.7. um 10:00 Uhr"
            value={data.followUpText}
            onChange={(e) => set("followUpText", e.target.value)}
          />
        </Field>

        <Field label="Grußzeile">
          <select
            value={data.grusszeile}
            onChange={(e) => set("grusszeile", e.target.value as FormData["grusszeile"])}
          >
            <option value="standard">Viele Grüße</option>
            <option value="berlin">Viele Grüße aus Berlin</option>
          </select>
        </Field>

        <Field label="Unterschrift">
          <input
            type="text"
            value={data.unterschrift}
            onChange={(e) => set("unterschrift", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}
