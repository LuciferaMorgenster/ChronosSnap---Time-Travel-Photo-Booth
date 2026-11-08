import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  ArrowRight,
  Compass,
  Filter,
  Check,
  Split,
  Eye,
} from 'lucide-react';
import { CommunityPost, HistoricalCategory, HistoricalEra } from '../types';
import { INITIAL_COMMUNITY_FEED } from '../data/communityFeed';
import { useI18n } from '../context/I18nContext';

interface PersonalizedFeedProps {
  eras: HistoricalEra[];
  onRemixPost: (eraId: string, prompt: string) => void;
}

export const PersonalizedFeed: React.FC<PersonalizedFeedProps> = ({
  eras,
  onRemixPost,
}) => {
  const { t } = useI18n();
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_FEED);
  const [selectedCategory, setSelectedCategory] = useState<HistoricalCategory | 'all'>('all');
  const [showingOriginalMap, setShowingOriginalMap] = useState<Record<string, boolean>>({});

  const categories: { id: HistoricalCategory | 'all'; label: string }[] = [
    { id: 'all', label: t('allEpochs') },
    { id: 'renaissance', label: t('renaissanceClassics') },
    { id: 'steampunk', label: t('steampunkIndustrial') },
    { id: 'ancient', label: t('ancientCivs') },
    { id: 'vintage20th', label: t('vintageNostalgia') },
  ];

  const filteredPosts = posts.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const toggleShowOriginal = (postId: string) => {
    setShowingOriginalMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Feed Header & Aesthetic Preference Filter */}
      <div className="p-6 rounded-2xl border dark:border-stone-800 dark:bg-stone-900/60 bg-white border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-black text-xl dark:text-stone-100 text-slate-800">
              {t('feedTitle')}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {t('feedSubtitle')}
            </p>
          </div>
          <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {t('tailoredBadge')}
          </span>
        </div>

        {/* Categories / Aesthetic Interests Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-sm shadow-amber-500/20'
                  : 'dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Community Feed Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => {
          const isShowingOriginal = showingOriginalMap[post.id] || false;

          return (
            <div
              key={post.id}
              className="rounded-2xl border overflow-hidden dark:border-stone-800 dark:bg-stone-900/50 bg-white border-slate-200 shadow-md flex flex-col justify-between group transition-all hover:border-stone-600"
            >
              {/* Post Author Bar */}
              <div className="p-4 flex items-center justify-between border-b dark:border-stone-800/80 border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
                  />
                  <div>
                    <h5 className="font-semibold text-xs dark:text-stone-100 text-slate-800">
                      {post.authorName}
                    </h5>
                    <p className="text-[10px] font-mono text-stone-400">
                      {post.authorHandle} • {post.timeAgo}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                  {post.eraName} ({post.eraYear})
                </div>
              </div>

              {/* Portrait Image with Before/After Toggle */}
              <div className="relative aspect-square bg-stone-950 overflow-hidden">
                <img
                  src={isShowingOriginal ? post.originalPhoto : post.transformedPhoto}
                  alt={post.eraName}
                  className="w-full h-full object-cover"
                />

                {/* Mode Indicator Tag */}
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-amber-300 border border-stone-800">
                  {isShowingOriginal ? 'ORIGINAL SUBJECT' : `${post.eraName.toUpperCase()}`}
                </div>

                {/* Before/After Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleShowOriginal(post.id)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-200 hover:border-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  {isShowingOriginal ? t('viewHistorical') : t('peekOriginal')}
                </button>
              </div>

              {/* Prompt Recipe & Details */}
              <div className="p-4 space-y-3">
                {post.customPrompt && (
                  <div className="p-2.5 rounded-xl dark:bg-stone-950/50 bg-slate-50 border dark:border-stone-800 border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block">
                      {t('customPromptRecipe')}
                    </span>
                    <p className="text-stone-300 italic text-[11px] leading-relaxed">
                      "{post.customPrompt}"
                    </p>
                  </div>
                )}

                {/* Social Counter & 1-Click Remix */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                        post.isLiked ? 'text-red-500' : 'text-stone-400 hover:text-red-400'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${post.isLiked ? 'fill-red-500' : ''}`}
                      />
                      <span>{post.likes}</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </div>
                  </div>

                  {/* 1-Click Remix / Try This Style Button */}
                  <button
                    type="button"
                    onClick={() => onRemixPost(post.eraId, post.customPrompt)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-stone-950 text-xs font-bold transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('tryWithMyFace')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
