"use client";

import { useState, useEffect } from "react";
import EmailForm from "@/components/EmailForm";
import EmailPreview from "@/components/EmailPreview";
import { FormData, DEFAULT_FORM } from "@/lib/types";
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
        className="flex items-center px-5 flex-shrink-0"
        style={{ background: "#111116", height: 48 }}
      >
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="DEIN ERSTER TAG"
            style={{ height: 28, width: "auto", filter: "brightness(0) invert(1)" }}
          />
          <div className="w-px bg-gray-600 self-stretch mx-1" />
          <span className="text-white font-semibold text-sm">E-Mail-Generator</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded ml-1"
            style={{ background: "#F5C400", color: "#000" }}
          >
            KI · AWS BEDROCK
          </span>
        </div>
      </header>

      {/* Main Split */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Form */}
        <div
          className="flex-shrink-0 border-r border-gray-300 bg-gray-50 overflow-hidden"
          style={{ width: 380 }}
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
