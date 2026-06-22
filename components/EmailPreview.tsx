"use client";

import { useState, useRef } from "react";

interface Props {
  betreff: string;
  text: string;
  onAdjusted: (newText: string) => void;
}

export default function EmailPreview({ betreff, text, onAdjusted }: Props) {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedBetreff, setCopiedBetreff] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty = !text.trim();

  async function handleAdjust() {
    if (!instruction.trim() || !text) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailText: text, instruction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler");
      onAdjusted(data.text);
      setInstruction("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  function copyText() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function copyBetreff() {
    navigator.clipboard.writeText(betreff).then(() => {
      setCopiedBetreff(true);
      setTimeout(() => setCopiedBetreff(false), 2000);
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Vorschau Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
          <span className="text-xs font-bold tracking-widest text-gray-500 ml-2">VORSCHAU</span>
        </div>
        {!isEmpty && (
          <button
            onClick={copyText}
            className="text-xs px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          >
            {copied ? "✓ Kopiert!" : "Text kopieren"}
          </button>
        )}
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-5 bg-gray-100">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Hier erscheint deine E-Mail</p>
            <p className="text-xs mt-1 opacity-70">Formular ausfüllen und E-Mail wird live generiert</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm max-w-2xl mx-auto overflow-hidden">
            {/* Betreff */}
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium block mb-0.5">Betreff</span>
                <span className="text-sm text-gray-800 font-medium">{betreff}</span>
              </div>
              <button
                onClick={copyBetreff}
                className="text-xs px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {copiedBetreff ? "✓" : "Kopieren"}
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <pre
                className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed"
                style={{ fontFamily: "inherit" }}
              >
                {text}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* KI-Korrektur */}
      <div className="border-t border-gray-300 bg-white p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-gray-500">KI-Anpassung</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#F5C400] text-black font-semibold">AWS Bedrock</span>
        </div>
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            rows={2}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 resize-none outline-none focus:border-gray-500"
            placeholder='z.B. "Ändere den Ton zu informeller" oder "Füge einen Satz über unser Jubliäum hinzu"'
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdjust();
            }}
            disabled={isEmpty || loading}
          />
          <button
            onClick={handleAdjust}
            disabled={!instruction.trim() || isEmpty || loading}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "#111116",
              color: "#fff",
            }}
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Lädt…
              </span>
            ) : (
              "Anpassen"
            )}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {!isEmpty && (
          <p className="text-xs text-gray-400 mt-1">Tipp: Strg+Enter zum Absenden</p>
        )}
      </div>
    </div>
  );
}
