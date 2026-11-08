export type HistoricalCategory = 'ancient' | 'renaissance' | 'steampunk' | 'vintage20th' | 'futuristic';

export interface HistoricalEra {
  id: string;
  name: string;
  period: string;
  year: string;
  category: HistoricalCategory;
  shortDesc: string;
  fullPrompt: string;
  costumeDetails: string;
  lightingStyle: string;
  defaultFilter: VintageFilterType;
  primaryColor: string;
  badge: string;
  iconName: string;
  quote: string;
}

export type VintageFilterType =
  | 'none'
  | 'sepia1890'
  | 'daguerreotype'
  | 'noir1920'
  | 'kodachrome'
  | 'technicolor'
  | 'cyanotype';

export interface FilterSettings {
  filterType: VintageFilterType;
  sepiaIntensity: number; // 0 - 100
  grain: number; // 0 - 100
  vignette: number; // 0 - 100
  contrast: number; // -50 to 50
  brightness: number; // -50 to 50
  borderStyle: 'none' | 'cabinet' | 'polaroid' | 'gilded' | 'museum';
  showTimestamp: boolean;
  dateCaption: string;
}

export interface FaceAnalysisResult {
  facialExpression: string;
  lightingConditions: string;
  recommendedEras: string[];
  aestheticArchetype: string;
  eraCompatibilityScore: number;
  historicalStylingAdvice: string;
  suggestedAccessories: string[];
}

export interface Project {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  originalPhoto: string; // base64 or sample
  transformedPhoto: string; // base64 or generated
  selectedEraId: string;
  customPrompt: string;
  filterSettings: FilterSettings;
  analysis?: FaceAnalysisResult;
  resolution: '1K' | '2K' | '4K';
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:3';
  likesCount: number;
  sharesCount: number;
  downloadsCount: number;
  isSynced: boolean;
  isFavorite: boolean;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  favoriteEra: string;
  themePreference: 'dark' | 'light' | 'steampunk';
  hasCompletedOnboarding: boolean;
  totalTimeTravels: number;
  viralScore: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  eraId: string;
  eraName: string;
  eraYear: string;
  originalPhoto: string;
  transformedPhoto: string;
  customPrompt: string;
  filterApplied: VintageFilterType;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  shares: number;
  timeAgo: string;
  category: HistoricalCategory;
}

export interface EngagementMetrics {
  totalTravels: number;
  viralReach: number;
  totalShares: number;
  totalDownloads: number;
  trendingEra: string;
  temporalFluxLevel: number; // 0 - 100%
  completedErasCount: number;
}
