import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Award,
  Lightbulb,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { FaceAnalysisResult, HistoricalEra } from '../types';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: FaceAnalysisResult | null;
  onSelectEra: (eraId: string) => void;
  eras: HistoricalEra[];
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  onSelectEra,
  eras,
}) => {
  if (!isOpen || !analysis) return null;

  // Find matching era object if possible
  const matchingEra = eras.find((e) =>
    analysis.recommendedEras.some((r) =>
      r.toLowerCase().includes(e.name.toLowerCase().split(' ')[0])
    )
  ) || eras[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden dark:bg-stone-900 dark:border-stone-700 bg-white border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-stone-800 border-slate-200 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base dark:text-stone-100 text-slate-800">
                Gemini 4 Argon Facial Analysis
              </h3>
              <p className="text-xs font-mono text-amber-500">
                Multimodal Image Understanding Report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Archetype & Score Banner */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Temporal Archetype
              </span>
              <h4 className="font-serif text-lg font-bold text-amber-200">
                {analysis.aestheticArchetype}
              </h4>
              <p className="text-xs text-stone-300 mt-0.5">
                Expression: {analysis.facialExpression}
              </p>
            </div>
            <div className="text-right">
              <div className="w-14 h-14 rounded-full border-2 border-amber-400 flex flex-col items-center justify-center bg-stone-950 shadow-inner">
                <span className="text-xs font-mono font-black text-amber-400 leading-none">
                  {analysis.eraCompatibilityScore}%
                </span>
                <span className="text-[8px] font-mono text-stone-400 uppercase">Match</span>
              </div>
            </div>
          </div>

          {/* Lighting & Environment */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/50 bg-slate-50 border-slate-200 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold dark:text-stone-300 text-slate-700">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Lighting & Geometry Evaluation</span>
            </div>
            <p className="text-xs text-stone-400 pl-6">
              {analysis.lightingConditions}
            </p>
          </div>

          {/* Recommended Eras */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Top Recommended Epochs
            </label>
            <div className="grid grid-cols-1 gap-2">
              {analysis.recommendedEras.map((eraString, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border dark:border-stone-800 dark:bg-stone-800/40 bg-slate-50 border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium dark:text-stone-200 text-slate-700">
                      {eraString}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Optimal
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Styling Advice */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/50 bg-slate-50 border-slate-200 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold dark:text-stone-300 text-slate-700">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Period Costume & Aesthetics Advice</span>
            </div>
            <p className="text-xs text-stone-300 pl-6 leading-relaxed">
              {analysis.historicalStylingAdvice}
            </p>
          </div>

          {/* Suggested Accessories */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Suggested Period Accessories
            </label>
            <div className="flex flex-wrap gap-1.5">
              {analysis.suggestedAccessories.map((acc, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono border dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 bg-amber-50 border-amber-200 text-amber-800"
                >
                  ✦ {acc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t dark:border-stone-800 border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold dark:text-stone-400 dark:hover:text-stone-200 text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSelectEra(matchingEra.id);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:brightness-110 shadow-md shadow-amber-500/25"
          >
            Travel to {matchingEra.name} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
