import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Shield,
  Palette,
  Clock,
  Crown,
  Zap,
} from 'lucide-react';
import { HistoricalCategory, HistoricalEra } from '../types';

interface EraSelectorProps {
  eras: HistoricalEra[];
  selectedEraId: string;
  onSelectEra: (eraId: string) => void;
  onInitiateTravel: () => void;
  isGenerating: boolean;
  recommendedEras?: string[];
}

export const EraSelector: React.FC<EraSelectorProps> = ({
  eras,
  selectedEraId,
  onSelectEra,
  onInitiateTravel,
  isGenerating,
  recommendedEras = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HistoricalCategory | 'all'>('all');

  const categories: { id: HistoricalCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Epochs' },
    { id: 'ancient', label: 'Ancient Civilizations' },
    { id: 'renaissance', label: 'Classical & Renaissance' },
    { id: 'steampunk', label: 'Victorian & Frontier' },
    { id: 'vintage20th', label: '20th Century Nostalgia' },
    { id: 'futuristic', label: 'Retro-Futurism' },
  ];

  const filteredEras = eras.filter((era) =>
    selectedCategory === 'all' ? true : era.category === selectedCategory
  );

  const activeEra = eras.find((e) => e.id === selectedEraId) || eras[0];

  return (
    <div className="space-y-4">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-stone-950 shadow-sm shadow-amber-500/20'
                : 'dark:bg-stone-900/80 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Eras Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredEras.map((era) => {
          const isSelected = era.id === selectedEraId;
          const isRecommended = recommendedEras.some((r) =>
            r.toLowerCase().includes(era.name.toLowerCase().split(' ')[0])
          );

          return (
            <div
              key={era.id}
              onClick={() => onSelectEra(era.id)}
              className={`relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-400 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/10'
                  : 'dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-stone-700 dark:hover:bg-stone-800/40 bg-white border-slate-200 hover:border-amber-400/50 hover:shadow-md'
              }`}
            >
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
                  {era.year}
                </span>

                <div className="flex items-center gap-1">
                  {isRecommended && (
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI Recommended
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full dark:bg-stone-800 dark:text-stone-300 bg-slate-100 text-slate-600 font-medium">
                    {era.badge}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 my-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: era.primaryColor }}
                  />
                  <h4 className="font-serif font-bold text-sm dark:text-stone-100 text-slate-800">
                    {era.name}
                  </h4>
                </div>
                <p className="text-xs dark:text-stone-400 text-slate-600 line-clamp-2">
                  {era.shortDesc}
                </p>
              </div>

              {/* Costume & Lighting footnote */}
              <div className="pt-3 border-t mt-3 dark:border-stone-800/80 border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-400 truncate max-w-[200px]">
                  👗 {era.costumeDetails.split(',')[0]}
                </span>
                <span
                  className={`font-semibold font-mono text-[11px] ${
                    isSelected ? 'text-amber-400' : 'text-stone-500'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Choose'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Era Sticky Initiation Banner */}
      <div className="p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-stone-900 to-stone-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-base shadow-md"
            style={{ backgroundColor: activeEra.primaryColor }}
          >
            ⏳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-black text-base text-amber-200">
                Ready for {activeEra.name} ({activeEra.year})
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                gemini-nano-banana-2.1
              </span>
            </div>
            <p className="text-xs text-stone-300 italic mt-0.5 max-w-xl">
              "{activeEra.quote}"
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onInitiateTravel}
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Initiating Temporal Portal...' : 'Time Travel Now'}
          {!isGenerating && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
