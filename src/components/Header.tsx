import React, { useState } from 'react';
import {
  Camera,
  Compass,
  FolderKanban,
  Globe,
  Sliders,
  Moon,
  Sun,
  Flame,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Check,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Heart,
} from 'lucide-react';
import { CreatorProfile, Project } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '../context/I18nContext';

interface HeaderProps {
  activeTab: 'booth' | 'darkroom' | 'dashboard' | 'feed';
  setActiveTab: (tab: 'booth' | 'darkroom' | 'dashboard' | 'feed') => void;
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  creatorProfile: CreatorProfile;
  onOpenProfile: () => void;
  theme: 'dark' | 'light' | 'steampunk';
  onChangeTheme: (theme: 'dark' | 'light' | 'steampunk') => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  isSyncing: boolean;
  onForceSync: () => void;
  onOpenDonation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  projects,
  currentProject,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onDuplicateProject,
  creatorProfile,
  onOpenProfile,
  theme,
  onChangeTheme,
  isOffline,
  onToggleOffline,
  isSyncing,
  onForceSync,
  onOpenDonation,
}) => {
  const { t } = useI18n();
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 bg-opacity-90 dark:bg-stone-950/90 dark:border-stone-800 bg-white/90 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Project Selector */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setActiveTab('booth')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <span className="font-serif font-black text-xl tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                CHRONOS
              </span>
              <span className="text-xs font-mono tracking-widest block uppercase text-amber-500/80 -mt-1">
                {t('appTagline')}
              </span>
            </div>
          </div>

          {/* Active Project Switcher Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all dark:bg-stone-900/80 dark:border-stone-700/80 dark:text-stone-300 dark:hover:bg-stone-800 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            >
              <FolderKanban className="w-3.5 h-3.5 text-amber-500" />
              <span className="max-w-[140px] truncate font-semibold">
                {currentProject?.title || t('selectProject')}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {projectDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-xl shadow-2xl border p-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-200 bg-white border-slate-200 text-slate-800"
                onMouseLeave={() => setProjectDropdownOpen(false)}
              >
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b mb-1 dark:border-stone-800 border-slate-100">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                    {t('activeProjects')} ({projects.length})
                  </span>
                  <button
                    onClick={() => {
                      onNewProject();
                      setProjectDropdownOpen(false);
                      setActiveTab('booth');
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 hover:text-amber-400"
                  >
                    <Plus className="w-3 h-3" /> {t('newShoot')}
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors group cursor-pointer ${
                        proj.id === currentProject?.id
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'hover:bg-stone-800/40 text-stone-300'
                      }`}
                      onClick={() => {
                        onSelectProject(proj.id);
                        setProjectDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {proj.transformedPhoto ? (
                          <img
                            src={proj.transformedPhoto}
                            alt=""
                            className="w-7 h-7 rounded object-cover border border-stone-700"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded bg-stone-800 flex items-center justify-center text-[10px]">
                            📷
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate">{proj.title}</p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {new Date(proj.updatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateProject(proj.id);
                          }}
                          title="Duplicate Project"
                          className="p-1 hover:text-amber-400 text-stone-400"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {projects.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(proj.id);
                            }}
                            title="Delete Project"
                            className="p-1 hover:text-red-400 text-stone-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('booth')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'booth'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                : 'dark:text-stone-300 dark:hover:bg-stone-800/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t('photoBooth')}</span>
          </button>

          <button
            onClick={() => setActiveTab('darkroom')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'darkroom'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                : 'dark:text-stone-300 dark:hover:bg-stone-800/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">{t('darkroom')}</span>
            <span className="sm:hidden">{t('darkroomShort')}</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                : 'dark:text-stone-300 dark:hover:bg-stone-800/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span className="hidden sm:inline">{t('dashboard')}</span>
            <span className="sm:hidden">{t('dashboardShort')}</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'feed'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                : 'dark:text-stone-300 dark:hover:bg-stone-800/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{t('communityFeed')}</span>
            <span className="sm:hidden">{t('feedShort')}</span>
          </button>
        </nav>

        {/* Right: Language Switcher, PWA Install, Donation, Cloud Sync, Offline Toggle, Theme & Creator Profile */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Dropdown */}
          <LanguageSwitcher />

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* PayPal Support / Donatie Button */}
          <button
            onClick={onOpenDonation}
            title="Support via PayPal (luciferamorgenster@gmail.com)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">{t('donate')}</span>
          </button>

          {/* Cloud Sync Status */}
          <button
            onClick={onForceSync}
            title={isSyncing ? t('syncing') : `${t('synced')}. Click to refresh.`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300 bg-slate-100 border-slate-200 text-slate-700 hover:border-amber-500/40 transition-colors"
          >
            <Cloud
              className={`w-3.5 h-3.5 ${
                isSyncing ? 'text-amber-400 animate-spin' : 'text-emerald-400'
              }`}
            />
            <span className="text-[11px]">
              {isSyncing ? t('syncing') : t('synced')}
            </span>
          </button>

          {/* Offline Mode Toggle Button */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? t('offlineMode') : t('online')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isOffline
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                : 'dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-400 bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{t('offlineMode')}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">{t('online')}</span>
              </>
            )}
          </button>

          {/* Theme Selector (Dark, Light, Steampunk) */}
          <div className="flex items-center border rounded-lg p-0.5 dark:border-stone-800 dark:bg-stone-900 bg-slate-100 border-slate-200">
            <button
              onClick={() => onChangeTheme('dark')}
              title={t('darkMode')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTheme('steampunk')}
              title={t('steampunkTheme')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'steampunk' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTheme('light')}
              title={t('lightMode')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'light' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Creator Profile Avatar */}
          <button
            onClick={onOpenProfile}
            title={`Creator Profile (${creatorProfile.name})`}
            className="flex items-center gap-2 p-1 rounded-xl border border-transparent hover:border-amber-500/40 transition-all"
          >
            <img
              src={creatorProfile.avatarUrl}
              alt={creatorProfile.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-500/50 shadow-sm"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
