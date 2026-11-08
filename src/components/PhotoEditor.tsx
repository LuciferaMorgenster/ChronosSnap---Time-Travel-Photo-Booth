import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Share2,
  Film,
  Sliders,
  Sparkles,
  RefreshCw,
  Eye,
  Layers,
  ZoomIn,
  Check,
  Send,
  HelpCircle,
  Palette,
  Maximize2,
  Split,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FilterSettings, HistoricalEra, Project, VintageFilterType } from '../types';
import { applyFiltersToCanvas } from '../utils/canvasFilters';
import { useI18n } from '../context/I18nContext';

interface PhotoEditorProps {
  project: Project;
  activeEra: HistoricalEra;
  onUpdateProject: (updated: Partial<Project>) => void;
  onExportVideo: () => void;
  onOpenShareModal: () => void;
  onCustomPromptSubmit: (prompt: string, resolution: '1K' | '2K' | '4K') => Promise<void>;
  isEditingPrompt: boolean;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  project,
  activeEra,
  onUpdateProject,
  onExportVideo,
  onOpenShareModal,
  onCustomPromptSubmit,
  isEditingPrompt,
}) => {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<'split' | 'side' | 'transformed'>('split');
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const [customPromptText, setCustomPromptText] = useState(project.customPrompt || '');
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>(project.resolution || '2K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9' | '4:3'>(project.aspectRatio || '1:1');
  const [isDownloading, setIsDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filterSettings = project.filterSettings;

  // Filter presets
  const FILTER_PRESETS: { type: VintageFilterType; label: string; year: string }[] = [
    { type: 'none', label: 'Vivid Color', year: 'Modern' },
    { type: 'sepia1890', label: 'Victorian Sepia', year: '1890' },
    { type: 'daguerreotype', label: 'Daguerreotype', year: '1845' },
    { type: 'noir1920', label: 'Silver Noir', year: '1920' },
    { type: 'kodachrome', label: 'Kodachrome', year: '1970' },
    { type: 'technicolor', label: 'Technicolor', year: '1950' },
    { type: 'cyanotype', label: 'Cyanotype', year: '1880' },
  ];

  // Quick Prompt Alchemy Chips
  const PROMPT_INSPIRATIONS = [
    'Add golden laurel wreath and Roman marble arches',
    'Chiaroscuro oil craquelure with deep amber varnish',
    'Brass clockwork monocle and steam engine gears',
    '1920s Art Deco pearl necklace and champagne bokeh',
    'Royal emerald velvet doublet with ermine fur collar',
    'Reflective gold astronaut helmet visor with lunar stars',
  ];

  // Render canvas with filters whenever filter settings or transformed photo changes
  useEffect(() => {
    renderFilteredCanvas();
  }, [filterSettings, project.transformedPhoto]);

  const renderFilteredCanvas = () => {
    if (!canvasRef.current || !project.transformedPhoto) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width || 800;
      canvas.height = img.height || 800;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      applyFiltersToCanvas(ctx, canvas.width, canvas.height, filterSettings);
    };
    img.src = project.transformedPhoto;
  };

  const handleUpdateFilter = (updates: Partial<FilterSettings>) => {
    onUpdateProject({
      filterSettings: {
        ...filterSettings,
        ...updates,
      },
    });
  };

  const handleDownloadHighRes = async () => {
    try {
      setIsDownloading(true);
      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = `chronos-${activeEra.id}-${resolution.toLowerCase()}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      onUpdateProject({
        downloadsCount: (project.downloadsCount || 0) + 1,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: View Mode Switcher & Resolution */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border dark:border-stone-800 dark:bg-stone-900/60 bg-white border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
            {t('viewMode')}
          </span>
          <div className="flex items-center p-0.5 rounded-lg border dark:border-stone-800 dark:bg-stone-950 bg-slate-100 border-slate-200">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" /> {t('beforeAfterSlider')}
            </button>
            <button
              onClick={() => setViewMode('side')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'side'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> {t('sideBySide')}
            </button>
            <button
              onClick={() => setViewMode('transformed')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'transformed'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> {t('transformedOnly')}
            </button>
          </div>
        </div>

        {/* Resolution selector (1K, 2K, 4K for gemini-nano-banana-2.1) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
            {t('resolution')}
          </span>
          <div className="flex items-center p-0.5 rounded-lg border dark:border-stone-800 dark:bg-stone-950 bg-slate-100 border-slate-200">
            {(['1K', '2K', '4K'] as const).map((res) => (
              <button
                key={res}
                onClick={() => {
                  setResolution(res);
                  onUpdateProject({ resolution: res });
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                  resolution === res
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas / Image Comparison Display */}
      <div className="relative rounded-2xl border p-4 sm:p-6 dark:border-stone-800 dark:bg-stone-900/40 bg-slate-50 border-slate-200 flex flex-col items-center justify-center min-h-[460px]">
        {/* Hidden Canvas used for real-time filter processing & high-res PNG export */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Display modes */}
        {viewMode === 'split' && (
          <div className="relative w-full max-w-[560px] aspect-square rounded-2xl overflow-hidden border shadow-2xl select-none dark:border-stone-700 border-slate-300">
            {/* Background: Transformed Image with applied filters */}
            <div className="absolute inset-0">
              <img
                src={project.transformedPhoto}
                alt="Transformed"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Foreground: Original Photo clipped by slider position */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={project.originalPhoto}
                alt="Original"
                className="w-full h-full object-cover max-w-none"
                style={{ width: '560px' }}
              />
              <div className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-stone-300 border border-stone-700">
                ORIGINAL PHOTO
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-amber-500/90 text-stone-950 font-bold px-2.5 py-1 rounded-md text-[10px] font-mono shadow-md">
              {activeEra.name.toUpperCase()} ({activeEra.year})
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 cursor-ew-resize z-20 flex items-center justify-center shadow-lg"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-xl font-bold text-xs">
                ⇄
              </div>
            </div>

            {/* Invisible Range Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            />
          </div>
        )}

        {viewMode === 'side' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
            {/* Original Card */}
            <div className="rounded-xl border overflow-hidden dark:border-stone-800 border-slate-300 bg-black/40">
              <div className="p-2 border-b dark:border-stone-800 border-slate-200 text-xs font-mono text-stone-400 flex items-center justify-between">
                <span>Original Subject</span>
                <span>2026 CE</span>
              </div>
              <img
                src={project.originalPhoto}
                alt="Original"
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Transformed Card */}
            <div className="rounded-xl border overflow-hidden dark:border-amber-500/40 border-amber-400/60 bg-black/40 shadow-xl shadow-amber-500/5">
              <div className="p-2 border-b dark:border-stone-800 border-slate-200 text-xs font-mono text-amber-400 flex items-center justify-between">
                <span>{activeEra.name}</span>
                <span>{activeEra.year}</span>
              </div>
              <img
                src={project.transformedPhoto}
                alt="Transformed"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
        )}

        {viewMode === 'transformed' && (
          <div className="relative w-full max-w-[560px] aspect-square rounded-2xl overflow-hidden border shadow-2xl dark:border-stone-700 border-slate-300">
            <img
              src={project.transformedPhoto}
              alt="Transformed Historical Portrait"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-serif font-bold text-amber-200">{activeEra.name}</p>
                <p className="text-[11px] text-stone-400 font-mono">{activeEra.year} • {resolution} Masterpiece</p>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Filtered
              </span>
            </div>
          </div>
        )}

        {/* Primary Action Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleDownloadHighRes}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? t('renderingHighRes') : `${t('downloadImage')} (${resolution})`}
          </button>

          <button
            type="button"
            onClick={onExportVideo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-purple-600/25 active:scale-95 transition-all"
          >
            <Film className="w-4 h-4" />
            {t('exportVideo')}
          </button>

          <button
            type="button"
            onClick={onOpenShareModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            {t('shareToSocial')}
          </button>
        </div>
      </div>

      {/* Feature 1: Prompt Alchemy with gemini-nano-banana-2.1 */}
      <div className="p-5 rounded-2xl border dark:border-stone-800 dark:bg-stone-900/60 bg-white border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm dark:text-stone-100 text-slate-800">
                {t('promptAlchemyTitle')}
              </h4>
              <p className="text-[11px] text-stone-400">
                {t('promptAlchemySubtitle')}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            Nano Banana 2.1
          </span>
        </div>

        {/* Prompt Input & Submit */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customPromptText}
            onChange={(e) => setCustomPromptText(e.target.value)}
            placeholder={t('promptPlaceholder')}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border dark:bg-stone-950 dark:border-stone-700 dark:text-stone-100 bg-slate-50 border-slate-300 text-slate-800 focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => onCustomPromptSubmit(customPromptText, resolution)}
            disabled={isEditingPrompt}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm hover:bg-amber-400 flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all shrink-0"
          >
            <Send className={`w-3.5 h-3.5 ${isEditingPrompt ? 'animate-spin' : ''}`} />
            {isEditingPrompt ? t('synthesizing') : t('reSynthesize')}
          </button>
        </div>

        {/* Quick prompt inspiration tags */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-stone-400">
            {t('quickAdditions')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_INSPIRATIONS.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCustomPromptText(idea)}
                className="text-[11px] px-2.5 py-1 rounded-lg border dark:border-stone-800 dark:bg-stone-800/40 dark:text-stone-300 dark:hover:border-amber-400 bg-slate-100 border-slate-200 text-slate-700 hover:border-amber-500 transition-colors"
              >
                + {idea}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature 2: Vintage & Sepia Photographic Aesthetics Suite */}
      <div className="p-5 rounded-2xl border dark:border-stone-800 dark:bg-stone-900/60 bg-white border-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm dark:text-stone-100 text-slate-800">
                {t('darkroomFiltersTitle')}
              </h4>
              <p className="text-[11px] text-stone-400">
                {t('darkroomFiltersSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Type Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {FILTER_PRESETS.map((filter) => {
            const isSelected = filterSettings.filterType === filter.type;
            return (
              <button
                key={filter.type}
                type="button"
                onClick={() => handleUpdateFilter({ filterType: filter.type })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400'
                    : 'dark:border-stone-800 dark:bg-stone-950/40 bg-slate-50 border-slate-200 hover:border-stone-600'
                }`}
              >
                <p className="text-xs font-bold truncate dark:text-stone-200 text-slate-800">
                  {filter.label}
                </p>
                <p className="text-[10px] font-mono text-amber-500">{filter.year}</p>
              </button>
            );
          })}
        </div>

        {/* Sliders Grid: Sepia Intensity, Grain, Vignette, Contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Sepia Intensity Slider */}
          <div className="space-y-1.5 p-3 rounded-xl border dark:border-stone-800/80 dark:bg-stone-950/40 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-300">{t('sepiaWarmth')}</span>
              <span className="font-mono text-amber-400">{filterSettings.sepiaIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filterSettings.sepiaIntensity}
              onChange={(e) => handleUpdateFilter({ sepiaIntensity: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Film Grain Slider */}
          <div className="space-y-1.5 p-3 rounded-xl border dark:border-stone-800/80 dark:bg-stone-950/40 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-300">{t('filmGrain')}</span>
              <span className="font-mono text-amber-400">{filterSettings.grain}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filterSettings.grain}
              onChange={(e) => handleUpdateFilter({ grain: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Vignette Slider */}
          <div className="space-y-1.5 p-3 rounded-xl border dark:border-stone-800/80 dark:bg-stone-950/40 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-300">{t('edgeVignette')}</span>
              <span className="font-mono text-amber-400">{filterSettings.vignette}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filterSettings.vignette}
              onChange={(e) => handleUpdateFilter({ vignette: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Contrast Slider */}
          <div className="space-y-1.5 p-3 rounded-xl border dark:border-stone-800/80 dark:bg-stone-950/40 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-300">{t('contrast')}</span>
              <span className="font-mono text-amber-400">{filterSettings.contrast}</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              value={filterSettings.contrast}
              onChange={(e) => handleUpdateFilter({ contrast: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Border Style and Timestamp Caption */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t dark:border-stone-800 border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-stone-400">{t('frameBorder')}</span>
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'none', label: t('none') },
                  { id: 'cabinet', label: t('cabinetCard') },
                  { id: 'polaroid', label: t('instantPrint') },
                  { id: 'gilded', label: t('museumGold') },
                ] as const
              ).map((border) => (
                <button
                  key={border.id}
                  type="button"
                  onClick={() => handleUpdateFilter({ borderStyle: border.id })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterSettings.borderStyle === border.id
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'dark:bg-stone-800 dark:text-stone-300 bg-slate-100 text-slate-700'
                  }`}
                >
                  {border.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timestamp Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-medium dark:text-stone-300 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filterSettings.showTimestamp}
                onChange={(e) => handleUpdateFilter({ showTimestamp: e.target.checked })}
                className="rounded accent-amber-500"
              />
              {t('stampYear')} ({activeEra.year})
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
