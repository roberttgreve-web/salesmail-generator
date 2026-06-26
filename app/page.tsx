"use client";

import { useState, useEffect } from "react";
import EmailForm from "@/components/EmailForm";
import EmailPreview from "@/components/EmailPreview";
import { FormData, DEFAULT_FORM, UNTERSCHRIFTEN, Unterschrift } from "@/lib/types";
import { generateEmail } from "@/lib/emailTemplate";

export default function Home() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [emailText, setEmailText] = useState("");
  const [betreff, setBetreff] = useState("");
  const [manualOverride, setManualOverride] = useState<string | null>(null);

  useEffect(() => {
    if (manualOverride !== null) return;
    const { betreff: b, text } = generateEmail(formData);
    setBetreff(b);
    setEmailText(text);
  }, [formData, manualOverride]);

  function handleFormChange(newData: FormData) {
    setFormData(newData);
    setManualOverride(null);
  }

  function handleAdjusted(newText: string) {
    setManualOverride(newText);
    setEmailText(newText);
  }

  return (
    <div className="flex flex-col" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-5 flex-shrink-0"
        style={{ background: "#fff", height: 60, borderBottom: "1px solid #eaeaea" }}
      >
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="DEIN ERSTER TAG"
            style={{ height: 28, width: "auto" }}
          />
          <div style={{ width: 1, height: 20, background: "rgba(24,24,24,0.15)", margin: "0 4px" }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#181818" }}>Sales-Mail-Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ color: "#999", fontSize: 12 }}>Ich bin:</span>
          <select
            value={formData.unterschrift}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, unterschrift: e.target.value as Unterschrift }))
            }
            style={{
              background: "#fff",
              color: "#181818",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              width: "auto",
            }}
          >
            {UNTERSCHRIFTEN.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Split */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Form */}
        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ width: 380, borderRight: "1px solid #eaeaea", background: "#fafafa" }}
        >
          <EmailForm data={formData} onChange={handleFormChange} />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 overflow-hidden">
          <EmailPreview
            betreff={betreff}
            text={emailText}
            onAdjusted={handleAdjusted}
          />
        </div>
      </div>
    </div>
  );
}
