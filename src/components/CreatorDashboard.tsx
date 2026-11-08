import React, { useState } from 'react';
import {
  FolderKanban,
  TrendingUp,
  Download,
  Share2,
  Clock,
  Zap,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  CheckCircle2,
  Cloud,
  Award,
  Sparkles,
  Heart,
  ExternalLink as ExternalLinkIcon,
} from 'lucide-react';
import { CreatorProfile, EngagementMetrics, HistoricalEra, Project } from '../types';

interface CreatorDashboardProps {
  metrics: EngagementMetrics;
  projects: Project[];
  eras: HistoricalEra[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  creatorProfile: CreatorProfile;
  onGoToDarkroom: () => void;
  isSyncing: boolean;
  onForceSync: () => void;
  onOpenDonation: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  metrics,
  projects,
  eras,
  currentProjectId,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onDuplicateProject,
  onToggleFavorite,
  creatorProfile,
  onGoToDarkroom,
  isSyncing,
  onForceSync,
  onOpenDonation,
}) => {
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState(false);

  const displayedProjects = filterFavoriteOnly
    ? projects.filter((p) => p.isFavorite)
    : projects;

  const handleStartRename = (proj: Project) => {
    setEditingTitleId(proj.id);
    setTempTitle(proj.title);
  };

  const handleSaveRename = (proj: Project) => {
    if (tempTitle.trim()) {
      proj.title = tempTitle.trim();
    }
    setEditingTitleId(null);
  };

  // Calculate unlocked eras count
  const unlockedEraIds = new Set(projects.map((p) => p.selectedEraId));
  const unlockedCount = unlockedEraIds.size;

  return (
    <div className="space-y-6">
      {/* Top Banner: Creator Profile & Real-Time Metrics */}
      <div className="p-6 rounded-2xl border dark:border-stone-800 dark:bg-stone-900/60 bg-white border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={creatorProfile.avatarUrl}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-xl dark:text-stone-100 text-slate-800">
                  {creatorProfile.name}
                </h3>
                <span className="text-xs font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {creatorProfile.handle}
                </span>
              </div>
              <p className="text-xs text-stone-400 max-w-md mt-0.5">
                {creatorProfile.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onForceSync}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 bg-slate-100 border-slate-200 text-slate-700 hover:border-amber-400 transition-colors"
            >
              <Cloud
                className={`w-3.5 h-3.5 ${
                  isSyncing ? 'text-amber-400 animate-spin' : 'text-emerald-400'
                }`}
              />
              <span>{isSyncing ? 'Syncing...' : 'All Changes Synced'}</span>
            </button>
            <button
              type="button"
              onClick={onNewProject}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" /> New Shoot
            </button>
          </div>
        </div>

        {/* Real-time Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Travels */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/40 bg-slate-50 border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-mono uppercase">Time Travels</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-xl font-bold font-mono text-amber-400">
              {projects.length}
            </p>
            <p className="text-[10px] text-stone-400">Portraits Generated</p>
          </div>

          {/* Viral Reach */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/40 bg-slate-50 border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-mono uppercase">Viral Reach</span>
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xl font-bold font-mono text-purple-400">
              {(metrics.viralReach / 1000).toFixed(1)}k
            </p>
            <p className="text-[10px] text-stone-400">Estimated Views</p>
          </div>

          {/* Social Shares */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/40 bg-slate-50 border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-mono uppercase">Shares</span>
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <p className="text-xl font-bold font-mono text-blue-400">
              {metrics.totalShares + projects.reduce((acc, p) => acc + (p.sharesCount || 0), 0)}
            </p>
            <p className="text-[10px] text-stone-400">Social Outlets</p>
          </div>

          {/* High-Res Downloads */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/40 bg-slate-50 border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-mono uppercase">Downloads</span>
              <Download className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold font-mono text-emerald-400">
              {metrics.totalDownloads +
                projects.reduce((acc, p) => acc + (p.downloadsCount || 0), 0)}
            </p>
            <p className="text-[10px] text-stone-400">1K / 2K / 4K Files</p>
          </div>

          {/* Temporal Core Flux */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/40 bg-slate-50 border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-mono uppercase">Chrono Flux</span>
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <p className="text-xl font-bold font-mono text-yellow-400">
              {metrics.temporalFluxLevel}%
            </p>
            <p className="text-[10px] text-stone-400">Core Power Active</p>
          </div>

          {/* Era Mastery */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/40 bg-slate-50 border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] font-mono uppercase">Timeline</span>
              <Award className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <p className="text-xl font-bold font-mono text-pink-400">
              {unlockedCount} / {eras.length}
            </p>
            <p className="text-[10px] text-stone-400">Epochs Unlocked</p>
          </div>
        </div>
      </div>

      {/* Creator Support & PayPal Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-stone-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-rose-400" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm dark:text-stone-100 text-slate-800">
              Vind je ChronosSnap geweldig? Steun het project!
            </h4>
            <p className="text-xs text-stone-400">
              Donaties helpen ons servercapaciteit voor Gemini 4 Argon en Nano Banana 2.1 te behouden. PayPal: <strong className="text-amber-400 font-mono">luciferamorgenster@gmail.com</strong>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenDonation}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs hover:brightness-110 shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Ondersteun via PayPal</span>
        </button>
      </div>

      {/* Active Projects Navigation & Manager */}
      <div className="p-6 rounded-2xl border dark:border-stone-800 dark:bg-stone-900/60 bg-white border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base dark:text-stone-100 text-slate-800">
                Active Projects & Gallery ({displayedProjects.length})
              </h4>
              <p className="text-[11px] text-stone-400">
                Switch between active shoots, manage resolutions, and resume editing in darkroom.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterFavoriteOnly(!filterFavoriteOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filterFavoriteOnly
                  ? 'bg-amber-500 text-stone-950 border-amber-500'
                  : 'dark:border-stone-800 dark:text-stone-300 bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Star className="w-3.5 h-3.5" /> Favorites Only
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProjects.map((proj) => {
            const era = eras.find((e) => e.id === proj.selectedEraId) || eras[0];
            const isCurrent = proj.id === currentProjectId;

            return (
              <div
                key={proj.id}
                className={`relative rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg dark:bg-stone-900 bg-white'
                    : 'dark:border-stone-800 dark:bg-stone-950/60 bg-slate-50 border-slate-200 hover:border-stone-600'
                }`}
              >
                {/* Thumbnail Preview */}
                <div
                  className="relative aspect-[4/3] bg-stone-950 overflow-hidden cursor-pointer group"
                  onClick={() => {
                    onSelectProject(proj.id);
                    onGoToDarkroom();
                  }}
                >
                  <img
                    src={proj.transformedPhoto || proj.originalPhoto}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold shadow-lg flex items-center gap-1">
                      Open in Darkroom <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Era pill */}
                  <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono text-amber-300 border border-amber-500/30">
                    {era.name} • {era.year}
                  </div>

                  {/* Favorite star */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(proj.id);
                    }}
                    className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                      proj.isFavorite
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-950/70 text-stone-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    {editingTitleId === proj.id ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onBlur={() => handleSaveRename(proj)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(proj)}
                          autoFocus
                          className="w-full px-2 py-1 rounded text-xs border dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100"
                        />
                        <button
                          onClick={() => handleSaveRename(proj)}
                          className="px-2 py-1 bg-amber-500 text-stone-950 text-xs font-bold rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h5
                        onDoubleClick={() => handleStartRename(proj)}
                        title="Double click to rename"
                        className="font-serif font-bold text-sm dark:text-stone-100 text-slate-800 truncate cursor-pointer hover:text-amber-400 transition-colors"
                      >
                        {proj.title}
                      </h5>
                    )}
                    <p className="text-[11px] text-stone-400 mt-0.5 font-mono">
                      {new Date(proj.updatedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t dark:border-stone-800 border-slate-200">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {proj.resolution || '2K'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProject(proj.id);
                          onGoToDarkroom();
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateProject(proj.id)}
                        title="Duplicate Shoot"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 dark:hover:bg-stone-800 hover:bg-slate-200 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteProject(proj.id)}
                          title="Delete Shoot"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 dark:hover:bg-stone-800 hover:bg-slate-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
