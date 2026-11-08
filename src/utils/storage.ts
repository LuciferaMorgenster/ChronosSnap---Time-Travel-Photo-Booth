import { CreatorProfile, EngagementMetrics, Project } from '../types';
import { SAMPLE_PORTRAITS } from '../data/samplePortraits';
import { HISTORICAL_ERAS } from '../data/historicalEras';

const STORAGE_KEYS = {
  PROJECTS: 'chronos_projects_v2',
  PROFILE: 'chronos_profile_v2',
  METRICS: 'chronos_metrics_v2',
  THEME: 'chronos_theme_v2',
  CURRENT_PROJECT_ID: 'chronos_curr_proj_id_v2',
};

export const DEFAULT_PROFILE: CreatorProfile = {
  name: 'Alex Sterling',
  handle: '@alex_timetraveler',
  bio: 'Exploring history one portrait at a time ⏳ Renaissance & Victorian enthusiast.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  favoriteEra: 'renaissance_florence',
  themePreference: 'dark',
  hasCompletedOnboarding: false,
  totalTimeTravels: 4,
  viralScore: 840,
};

export const DEFAULT_METRICS: EngagementMetrics = {
  totalTravels: 4,
  viralReach: 14200,
  totalShares: 340,
  totalDownloads: 185,
  trendingEra: 'Renaissance Florence (1504)',
  temporalFluxLevel: 94,
  completedErasCount: 3,
};

export function getInitialProjects(): Project[] {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }

  // Create an initial sample project ready to view
  const defaultProj: Project = {
    id: 'proj_default_1',
    title: 'Renaissance High Noble',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
    originalPhoto: SAMPLE_PORTRAITS[0].dataUrl,
    transformedPhoto: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    selectedEraId: 'renaissance_florence',
    customPrompt: 'Rich emerald velvet cloak with Florence Arno river in background',
    filterSettings: {
      filterType: 'sepia1890',
      sepiaIntensity: 65,
      grain: 25,
      vignette: 40,
      contrast: 15,
      brightness: 5,
      borderStyle: 'cabinet',
      showTimestamp: true,
      dateCaption: 'Florence • 1504 CE',
    },
    analysis: {
      facialExpression: 'Introspective & poised',
      lightingConditions: 'Soft ambient illumination',
      recommendedEras: ['Renaissance Florence (1504)', 'Victorian Steampunk (1888)', 'Ancient Egypt (1323 BCE)'],
      aestheticArchetype: 'Classical Scholar & Artisan',
      eraCompatibilityScore: 97,
      historicalStylingAdvice: 'High cheekbones and calm gaze pair perfectly with da Vinci sfumato and warm amber glaze.',
      suggestedAccessories: ['Velvet scholar beret', 'Gilded signet ring', 'Hand-bound manuscript'],
    },
    resolution: '2K',
    aspectRatio: '1:1',
    likesCount: 142,
    sharesCount: 38,
    downloadsCount: 19,
    isSynced: true,
    isFavorite: true,
  };

  const initialList = [defaultProj];
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialList));
  return initialList;
}

export function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.warn('Storage quota exceeded, keeping in-memory', err);
  }
}

export function getProfile(): CreatorProfile {
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: CreatorProfile) {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getMetrics(): EngagementMetrics {
  const stored = localStorage.getItem(STORAGE_KEYS.METRICS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return DEFAULT_METRICS;
}

export function saveMetrics(metrics: EngagementMetrics) {
  localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
}

export function getCurrentProjectId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT_ID);
}

export function setCurrentProjectId(id: string) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT_ID, id);
}
