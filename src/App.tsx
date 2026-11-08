import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CameraBooth } from './components/CameraBooth';
import { EraSelector } from './components/EraSelector';
import { PhotoEditor } from './components/PhotoEditor';
import { CreatorDashboard } from './components/CreatorDashboard';
import { PersonalizedFeed } from './components/PersonalizedFeed';
import { OnboardingModal } from './components/OnboardingModal';
import { AnalysisModal } from './components/AnalysisModal';
import { VideoExportModal } from './components/VideoExportModal';
import { ShareModal } from './components/ShareModal';
import { ProfileModal } from './components/ProfileModal';
import { DonationModal } from './components/DonationModal';
import { HISTORICAL_ERAS } from './data/historicalEras';
import { SAMPLE_PORTRAITS } from './data/samplePortraits';
import {
  FaceAnalysisResult,
  HistoricalEra,
  Project,
  CreatorProfile,
  EngagementMetrics,
} from './types';
import {
  getInitialProjects,
  saveProjects,
  getProfile,
  saveProfile,
  getMetrics,
  saveMetrics,
  getCurrentProjectId,
  setCurrentProjectId,
} from './utils/storage';
import { synthesizeHistoricalFallback } from './utils/canvasFilters';
import { playTimeWarpSound } from './utils/audio';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => getInitialProjects());
  const [currentId, setCurrentId] = useState<string>(() => {
    const saved = getCurrentProjectId();
    return saved && getInitialProjects().some((p) => p.id === saved)
      ? saved
      : getInitialProjects()[0]?.id || 'proj_1';
  });
  const [activeTab, setActiveTab] = useState<'booth' | 'darkroom' | 'dashboard' | 'feed'>('booth');
  const [profile, setProfile] = useState<CreatorProfile>(() => getProfile());
  const [metrics, setMetrics] = useState<EngagementMetrics>(() => getMetrics());
  const [theme, setTheme] = useState<'dark' | 'light' | 'steampunk'>(profile.themePreference || 'dark');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [onboardingOpen, setOnboardingOpen] = useState(!profile.hasCompletedOnboarding);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [videoExportOpen, setVideoExportOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const currentProject = projects.find((p) => p.id === currentId) || projects[0];
  const activeEra =
    HISTORICAL_ERAS.find((e) => e.id === currentProject?.selectedEraId) ||
    HISTORICAL_ERAS[0];

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme application to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'theme-steampunk');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'steampunk') {
      root.classList.add('dark', 'theme-steampunk');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  // Persist projects and metrics whenever updated
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveMetrics(metrics);
  }, [metrics]);

  useEffect(() => {
    if (currentId) setCurrentProjectId(currentId);
  }, [currentId]);

  // Select project
  const handleSelectProject = (id: string) => {
    setCurrentId(id);
  };

  // Create new project
  const handleNewProject = () => {
    const newId = `proj_${Date.now()}`;
    const newProj: Project = {
      id: newId,
      title: `Time Travel #${projects.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      originalPhoto: SAMPLE_PORTRAITS[0].dataUrl,
      transformedPhoto: '',
      selectedEraId: profile.favoriteEra || 'renaissance_florence',
      customPrompt: '',
      filterSettings: {
        filterType: 'sepia1890',
        sepiaIntensity: 60,
        grain: 20,
        vignette: 35,
        contrast: 10,
        brightness: 0,
        borderStyle: 'cabinet',
        showTimestamp: true,
        dateCaption: '1504 CE',
      },
      resolution: '2K',
      aspectRatio: '1:1',
      likesCount: 0,
      sharesCount: 0,
      downloadsCount: 0,
      isSynced: true,
      isFavorite: false,
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    setCurrentId(newId);
    setActiveTab('booth');
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    if (currentId === id) {
      setCurrentId(filtered[0].id);
    }
  };

  const handleDuplicateProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const newId = `proj_${Date.now()}`;
    const duplicate: Project = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects([duplicate, ...projects]);
    setCurrentId(newId);
  };

  const handleToggleFavorite = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleUpdateCurrentProject = (updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentId
          ? {
              ...p,
              ...updates,
              updatedAt: Date.now(),
            }
          : p
      )
    );
  };

  // Cloud sync trigger
  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 900);
  };

  // Face Analysis using Gemini 4 Argon
  const handleAnalyzeFace = async (photoDataUrl: string): Promise<FaceAnalysisResult | null> => {
    try {
      setIsAnalyzing(true);
      if (isOffline) {
        // Offline heuristic analysis
        const offlineResult: FaceAnalysisResult = {
          facialExpression: 'Focused & poised',
          lightingConditions: 'Evenly balanced frontal portrait lighting',
          recommendedEras: ['Renaissance Florence (1504)', 'Victorian Steampunk (1888)', 'Ancient Egypt (1323 BCE)'],
          aestheticArchetype: 'Classical Scholar & Royal Diplomat',
          eraCompatibilityScore: 95,
          historicalStylingAdvice: 'Optimal for Renaissance chiaroscuro oil glazing and Victorian collodion portraits.',
          suggestedAccessories: ['Velvet scholar beret', 'Gilded pocket watch', 'Lapis lazuli pharaonic amulet'],
        };
        handleUpdateCurrentProject({ analysis: offlineResult });
        setAnalysisModalOpen(true);
        return offlineResult;
      }

      const res = await fetch('/api/analyze-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: photoDataUrl }),
      });

      const data = await res.json();
      const analysis: FaceAnalysisResult = data.analysis || data.fallback;
      handleUpdateCurrentProject({ analysis });
      setAnalysisModalOpen(true);
      return analysis;
    } catch (err) {
      console.warn('Face analysis error, using fallback:', err);
      const fallbackResult: FaceAnalysisResult = {
        facialExpression: 'Introspective & noble',
        lightingConditions: 'Soft ambient illumination',
        recommendedEras: ['Renaissance Florence (1504)', 'Imperial Rome (80 CE)', 'Victorian Steampunk (1888)'],
        aestheticArchetype: 'Historic Luminary',
        eraCompatibilityScore: 92,
        historicalStylingAdvice: 'Ideal for oil glaze and vintage sepia tone.',
        suggestedAccessories: ['Antique compass', 'Lace collar', 'Leather bound tome'],
      };
      handleUpdateCurrentProject({ analysis: fallbackResult });
      setAnalysisModalOpen(true);
      return fallbackResult;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Time Travel Transformation using gemini-nano-banana-2.1 with offline fallback
  const handleInitiateTravel = async () => {
    if (!currentProject.originalPhoto) return;
    try {
      setIsGenerating(true);
      playTimeWarpSound();

      let transformedDataUrl = '';

      if (!isOffline) {
        try {
          const res = await fetch('/api/generate-time-travel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: currentProject.originalPhoto,
              eraName: activeEra.name,
              eraPrompt: activeEra.fullPrompt,
              customEditPrompt: currentProject.customPrompt,
              imageSize: currentProject.resolution || '2K',
              aspectRatio: currentProject.aspectRatio || '1:1',
            }),
          });
          const data = await res.json();
          if (data.success && data.imageUrl) {
            transformedDataUrl = data.imageUrl;
          }
        } catch (apiErr) {
          console.warn('API generation notice, synthesizing locally:', apiErr);
        }
      }

      // If offline or if API key returned client fallback
      if (!transformedDataUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = currentProject.originalPhoto;
        });

        transformedDataUrl = await synthesizeHistoricalFallback(
          img,
          activeEra,
          currentProject.customPrompt
        );
      }

      handleUpdateCurrentProject({
        transformedPhoto: transformedDataUrl,
        filterSettings: {
          ...currentProject.filterSettings,
          filterType: activeEra.defaultFilter,
          dateCaption: `${activeEra.name} • ${activeEra.year}`,
        },
      });

      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        totalTravels: prev.totalTravels + 1,
        viralReach: prev.viralReach + 850,
      }));

      // Switch to Darkroom tab
      setActiveTab('darkroom');
    } catch (err) {
      console.error('Time travel generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Custom Prompt Alchemy with gemini-nano-banana-2.1
  const handleCustomPromptSubmit = async (prompt: string, res: '1K' | '2K' | '4K') => {
    try {
      setIsEditingPrompt(true);
      playTimeWarpSound();

      let editedUrl = '';

      if (!isOffline && currentProject.transformedPhoto) {
        try {
          const response = await fetch('/api/edit-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: currentProject.transformedPhoto,
              editPrompt: prompt,
              imageSize: res,
              aspectRatio: currentProject.aspectRatio || '1:1',
            }),
          });
          const data = await response.json();
          if (data.success && data.imageUrl) {
            editedUrl = data.imageUrl;
          }
        } catch (err) {
          console.warn('Edit API notice, applying client adjustment:', err);
        }
      }

      if (!editedUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = currentProject.originalPhoto;
        });
        editedUrl = await synthesizeHistoricalFallback(img, activeEra, prompt);
      }

      handleUpdateCurrentProject({
        transformedPhoto: editedUrl,
        customPrompt: prompt,
        resolution: res,
      });
    } finally {
      setIsEditingPrompt(false);
    }
  };

  // Remix from community feed
  const handleRemixPost = (eraId: string, prompt: string) => {
    handleUpdateCurrentProject({
      selectedEraId: eraId,
      customPrompt: prompt,
    });
    setActiveTab('booth');
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-200 dark:bg-stone-950 dark:text-stone-100 bg-stone-100 text-stone-900 flex flex-col">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        creatorProfile={profile}
        onOpenProfile={() => setProfileModalOpen(true)}
        theme={theme}
        onChangeTheme={(t) => {
          setTheme(t);
          setProfile((p) => ({ ...p, themePreference: t }));
        }}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        isSyncing={isSyncing}
        onForceSync={handleForceSync}
        onOpenDonation={() => setDonationModalOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'booth' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Step 1: Camera Capture Viewport */}
            <CameraBooth
              currentPhoto={currentProject.originalPhoto}
              onPhotoCaptured={(dataUrl) =>
                handleUpdateCurrentProject({ originalPhoto: dataUrl })
              }
              onAnalyzeFace={handleAnalyzeFace}
              isAnalyzing={isAnalyzing}
              analysisResult={currentProject.analysis}
              onOpenAnalysisModal={() => setAnalysisModalOpen(true)}
            />

            {/* Step 2: Historical Epoch Selection Carousel */}
            <EraSelector
              eras={HISTORICAL_ERAS}
              selectedEraId={currentProject.selectedEraId}
              onSelectEra={(eraId) => handleUpdateCurrentProject({ selectedEraId: eraId })}
              onInitiateTravel={handleInitiateTravel}
              isGenerating={isGenerating}
              recommendedEras={currentProject.analysis?.recommendedEras}
            />
          </div>
        )}

        {activeTab === 'darkroom' && (
          <div className="animate-in fade-in">
            <PhotoEditor
              project={currentProject}
              activeEra={activeEra}
              onUpdateProject={handleUpdateCurrentProject}
              onExportVideo={() => setVideoExportOpen(true)}
              onOpenShareModal={() => setShareModalOpen(true)}
              onCustomPromptSubmit={handleCustomPromptSubmit}
              isEditingPrompt={isEditingPrompt}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in">
            <CreatorDashboard
              metrics={metrics}
              projects={projects}
              eras={HISTORICAL_ERAS}
              currentProjectId={currentProject.id}
              onSelectProject={handleSelectProject}
              onNewProject={handleNewProject}
              onDeleteProject={handleDeleteProject}
              onDuplicateProject={handleDuplicateProject}
              onToggleFavorite={handleToggleFavorite}
              creatorProfile={profile}
              onGoToDarkroom={() => setActiveTab('darkroom')}
              isSyncing={isSyncing}
              onForceSync={handleForceSync}
              onOpenDonation={() => setDonationModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="animate-in fade-in">
            <PersonalizedFeed eras={HISTORICAL_ERAS} onRemixPost={handleRemixPost} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-4 px-4 text-center text-xs dark:border-stone-900 border-slate-200 dark:text-stone-500 text-slate-400 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <p className="font-mono">
          ChronosSnap v2.4 • Powered by Gemini 4 Argon & Gemini Nano Banana 2.1 • PWA & Offline Capable
        </p>
        <button
          onClick={() => setDonationModalOpen(true)}
          className="text-amber-500 hover:text-amber-400 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
        >
          ❤️ Doneer / Ondersteun via PayPal
        </button>
      </footer>

      {/* Modals */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => setProfile(updated)}
      />

      <AnalysisModal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        analysis={currentProject.analysis || null}
        onSelectEra={(eraId) => {
          handleUpdateCurrentProject({ selectedEraId: eraId });
          setActiveTab('booth');
        }}
        eras={HISTORICAL_ERAS}
      />

      <VideoExportModal
        isOpen={videoExportOpen}
        onClose={() => setVideoExportOpen(false)}
        originalPhoto={currentProject.originalPhoto}
        transformedPhoto={currentProject.transformedPhoto || currentProject.originalPhoto}
        eraName={activeEra.name}
        eraYear={activeEra.year}
        creatorHandle={profile.handle}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        imageUrl={currentProject.transformedPhoto || currentProject.originalPhoto}
        eraName={activeEra.name}
        eraYear={activeEra.year}
        onDownload={() => {}}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => setProfile(updated)}
        eras={HISTORICAL_ERAS}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onOpenDonation={() => setDonationModalOpen(true)}
      />

      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        paypalEmail="luciferamorgenster@gmail.com"
      />
    </div>
  );
}
