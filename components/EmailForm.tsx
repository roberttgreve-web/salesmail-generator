"use client";

import {
  FormData,
  FormatData,
  FormatType,
  FORMAT_LABELS,
  Person,
  SV_GEBIET_LABELS,
  SvGebiet,
  UNTERSCHRIFTEN,
  Unterschrift,
} from "@/lib/types";


const FORMAT_OPTIONS: FormatType[] = ["sprachnachricht", "kurzerklart", "360grad"];

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

  // Personen
  function addPerson() {
    if (data.personen.length >= 5) return;
    set("personen", [
      ...data.personen,
      { vorname: "", nachname: "", geschlecht: "weiblich" },
    ]);
  }

  function removePerson(idx: number) {
    set("personen", data.personen.filter((_, i) => i !== idx));
  }

  function updatePerson(idx: number, key: keyof Person, value: string) {
    set(
      "personen",
      data.personen.map((p, i) => (i === idx ? { ...p, [key]: value } : p))
    );
  }

  // Formate
  function toggleFormat(type: FormatType) {
    const exists = data.formate.find((f) => f.type === type);
    if (exists) {
      set("formate", data.formate.filter((f) => f.type !== type));
    } else {
      const newFormat: FormatData = { type, beispielTitel: "", beispielLink: "" };
      const ordered = FORMAT_OPTIONS.map(
        (t) => data.formate.find((f) => f.type === t) || (t === type ? newFormat : null)
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

  return (
    <div className="h-full overflow-y-auto p-4">

      {/* Sektion 1: Ansprache */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <SectionHeader num={1} label="Ansprache" />

        <Field label="Anrede">
          <div className="flex gap-2">
            {(["Siezen", "Duzen"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer" style={{ marginBottom: 0 }}>
                <input
                  type="radio"
                  name="anrede"
                  checked={opt === "Siezen" ? data.anredeSiezen : !data.anredeSiezen}
                  onChange={() => set("anredeSiezen", opt === "Siezen")}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </Field>

        <div className="space-y-3">
          {data.personen.map((person, idx) => (
            <div key={idx} className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Person {idx + 1}
                </span>
                {data.personen.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePerson(idx)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Entfernen
                  </button>
                )}
              </div>

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Vorname"
                  value={person.vorname}
                  onChange={(e) => updatePerson(idx, "vorname", e.target.value)}
                  style={{ width: "50%" }}
                />
                <input
                  type="text"
                  placeholder="Nachname"
                  value={person.nachname}
                  onChange={(e) => updatePerson(idx, "nachname", e.target.value)}
                  style={{ width: "50%" }}
                />
              </div>

              <div className="flex gap-3">
                {(["weiblich", "maennlich"] as const).map((g) => (
                  <label key={g} className="flex items-center gap-1.5 cursor-pointer" style={{ marginBottom: 0 }}>
                    <input
                      type="radio"
                      name={`geschlecht-${idx}`}
                      checked={person.geschlecht === g}
                      onChange={() => updatePerson(idx, "geschlecht", g)}
                    />
                    <span className="text-sm">{g === "weiblich" ? "Weiblich" : "Männlich"}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {data.personen.length < 5 && (
          <button
            type="button"
            onClick={addPerson}
            className="mt-2 text-xs px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
          >
            + Person hinzufügen
          </button>
        )}
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

            {format.type !== "sprachnachricht" && (
              <>
                <Field label="Beispielmedium – Berufsbezeichnung / Titel">
                  <input
                    type="text"
                    placeholder="z.B. Fachkraft für Lagerlogistik (DSV)"
                    value={format.beispielTitel}
                    onChange={(e) => updateFormat(format.type, "beispielTitel", e.target.value)}
                  />
                </Field>
                <Field label="Link (URL) von DET einfügen">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={format.beispielLink}
                    onChange={(e) => updateFormat(format.type, "beispielLink", e.target.value)}
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

        <Field label="Gebiet">
          <div className="space-y-1.5 mt-1">
            {(Object.keys(SV_GEBIET_LABELS) as SvGebiet[]).map((gebiet) => (
              <label key={gebiet} className="flex items-center gap-2 cursor-pointer" style={{ marginBottom: 0 }}>
                <input
                  type="radio"
                  name="svGebiet"
                  checked={data.svGebiet === gebiet}
                  onChange={() => set("svGebiet", gebiet)}
                />
                <span className="text-sm">{SV_GEBIET_LABELS[gebiet]}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>

      {/* Sektion 4: Zusätze */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <SectionHeader num={4} label="Zusätze" />

        <div className="mb-3">
          <label className="flex items-center gap-2 cursor-pointer" style={{ marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={data.anhang}
              onChange={(e) =>
                onChange({ ...data, anhang: e.target.checked, formalAngebot: e.target.checked ? false : data.formalAngebot })
              }
            />
            <span className="text-sm font-medium">Angebot im Anhang</span>
          </label>
        </div>

        <div className="mb-3">
          <label className="flex items-center gap-2 cursor-pointer" style={{ marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={data.formalAngebot}
              onChange={(e) =>
                onChange({ ...data, formalAngebot: e.target.checked, anhang: e.target.checked ? false : data.anhang })
              }
            />
            <span className="text-sm font-medium">Kein Angebot im Anhang. Anbieten.</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer" style={{ marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={data.followUp}
              onChange={(e) => set("followUp", e.target.checked)}
            />
            <span className="text-sm font-medium">Follow-up Termin nennen</span>
          </label>
          {data.followUp && (
            <div className="flex gap-2 mt-1.5">
              <input
                type="text"
                placeholder="Datum (z.B. 6.7.)"
                value={data.followUpDatum}
                onChange={(e) => set("followUpDatum", e.target.value)}
                style={{ width: "50%" }}
              />
              <input
                type="text"
                placeholder="Uhrzeit (z.B. 10:00)"
                value={data.followUpUhrzeit}
                onChange={(e) => set("followUpUhrzeit", e.target.value)}
                style={{ width: "50%" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sektion 5: Abschluss */}
      <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
        <SectionHeader num={5} label="Abschluss" />

        <Field label="Unterschrift">
          <select
            value={data.unterschrift}
            onChange={(e) => set("unterschrift", e.target.value as Unterschrift)}
          >
            {UNTERSCHRIFTEN.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Field>
      </div>

    </div>
  );
}
