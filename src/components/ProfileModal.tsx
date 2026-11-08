import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Cloud,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { CreatorProfile, HistoricalEra } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CreatorProfile;
  onSaveProfile: (profile: CreatorProfile) => void;
  eras: HistoricalEra[];
  onOpenOnboarding: () => void;
  onOpenDonation: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  eras,
  onOpenOnboarding,
  onOpenDonation,
}) => {
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);
  const [favoriteEra, setFavoriteEra] = useState(profile.favoriteEra);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      ...profile,
      name: name.trim() || profile.name,
      handle: handle.startsWith('@') ? handle.trim() : `@${handle.trim() || 'voyager'}`,
      bio,
      favoriteEra,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden dark:bg-stone-900 dark:border-stone-700 bg-white border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-stone-800 border-slate-200 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm dark:text-stone-100 text-slate-800">
                Creator Profile Settings
              </h3>
              <p className="text-[11px] text-stone-400">
                Manage your identity and synchronization
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
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatarUrl}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-serif font-bold text-base dark:text-stone-100 text-slate-800 truncate">
                {profile.name}
              </h4>
              <p className="text-xs font-mono text-amber-500">{profile.handle}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-mono">
                <Cloud className="w-3.5 h-3.5" />
                <span>Cloud Sync Active</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 bg-slate-50 border-slate-300 text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                Creator Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border font-mono dark:bg-stone-800 dark:border-stone-700 dark:text-amber-400 bg-slate-50 border-slate-300 text-amber-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                Creative Bio
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 bg-slate-50 border-slate-300 text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                Favorite Historical Era
              </label>
              <select
                value={favoriteEra}
                onChange={(e) => setFavoriteEra(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 bg-slate-50 border-slate-300 text-slate-800 focus:outline-none focus:border-amber-500"
              >
                {eras.map((era) => (
                  <option key={era.id} value={era.id}>
                    {era.name} ({era.year})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDonation();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all"
            >
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>Ondersteun ChronosSnap via PayPal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOnboarding();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Re-open Creator Onboarding Tour
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t dark:border-stone-800 border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
