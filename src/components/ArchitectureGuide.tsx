import { useState } from 'react';
import { BookOpen, Copy, Check, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { ARCHITECTURE_OPTIONS } from '../utils/decompDocs';

export function ArchitectureGuide() {
  const [selectedId, setSelectedId] = useState<string>(ARCHITECTURE_OPTIONS[0].id);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const selectedOption = ARCHITECTURE_OPTIONS.find((opt) => opt.id === selectedId) || ARCHITECTURE_OPTIONS[0];

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-5 space-y-6">
      <div className="pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-semibold text-zinc-900">
            Technical Implementation Guide & Options Overview
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1 max-w-3xl leading-relaxed">
          Comprehensive technical breakdown on how to implement 0-EXP gain and dynamic Gym Level Cap Candies for base ROMs dumped from real game cartridges.
        </p>
      </div>

      {/* Option Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ARCHITECTURE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelectedId(opt.id)}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
              selectedId === opt.id
                ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/40 hover:bg-zinc-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800">
                  {opt.badge}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-zinc-900 leading-snug line-clamp-2">
                {opt.title}
              </h4>
            </div>
            <div className="mt-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              {opt.recommendation}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Option Detail View */}
      <div className="p-5 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-5">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              {selectedOption.title}
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold w-fit">
              {selectedOption.recommendation}
            </span>
          </div>
          <p className="text-xs text-zinc-700 mt-2 leading-relaxed">
            {selectedOption.summary}
          </p>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3.5 rounded-lg border border-zinc-200">
            <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Advantages & Strengths
            </h5>
            <ul className="text-xs text-zinc-600 space-y-1.5 pl-4 list-disc">
              {selectedOption.pros.map((pro, i) => (
                <li key={i}>{pro}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-zinc-200">
            <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Limitations & Considerations
            </h5>
            <ul className="text-xs text-zinc-600 space-y-1.5 pl-4 list-disc">
              {selectedOption.cons.map((con, i) => (
                <li key={i}>{con}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-white p-4 rounded-lg border border-zinc-200 space-y-2">
          <h5 className="text-xs font-bold text-zinc-900">
            Implementation Breakdown & Methodology
          </h5>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {selectedOption.implementationGuide}
          </p>
        </div>

        {/* Code Snippet if applicable */}
        {selectedOption.codeSnippet && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-600 px-1 font-mono">
              <span>{selectedOption.codeSnippet.fileName}</span>
              <button
                type="button"
                onClick={() => copyCode(selectedOption.codeSnippet!.code, selectedOption.id)}
                className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-sans font-medium"
              >
                {copiedCodeId === selectedOption.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code Snippet
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-900 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
              <code>{selectedOption.codeSnippet.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
