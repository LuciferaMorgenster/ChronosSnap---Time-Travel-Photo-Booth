import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Camera,
  CheckCircle2,
  ArrowRight,
  Shield,
  Palette,
  Clock,
  User,
  Zap,
} from 'lucide-react';
import { CreatorProfile } from '../types';
import { HISTORICAL_ERAS } from '../data/historicalEras';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CreatorProfile;
  onSaveProfile: (updated: CreatorProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio);
  const [favoriteEra, setFavoriteEra] = useState(profile.favoriteEra || 'renaissance_florence');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  if (!isOpen) return null;

  const handleFinish = () => {
    onSaveProfile({
      ...profile,
      name: name.trim() || 'Temporal Voyager',
      handle: handle.startsWith('@') ? handle.trim() : `@${handle.trim() || 'voyager'}`,
      bio,
      favoriteEra,
      avatarUrl,
      hasCompletedOnboarding: true,
    });
    onClose();
  };

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden dark:bg-stone-900 dark:border-stone-700 bg-white border-slate-200">
        {/* Top Gradient Banner */}
        <div className="relative h-28 bg-gradient-to-r from-amber-600 via-amber-700 to-stone-900 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-stone-950/80 border border-amber-400/40 flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-black text-amber-100 tracking-wide">
                CHRONOS-SNAP
              </h2>
              <p className="text-xs text-amber-200/80 font-mono">
                Creator Calibration Protocol • Step {step} of 3
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  s === step
                    ? 'w-6 bg-amber-400'
                    : s < step
                    ? 'bg-amber-300'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1 mb-6">
                <h3 className="font-serif text-lg font-bold dark:text-stone-100 text-slate-800">
                  Welcome, Temporal Creator
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Set up your time-traveler identity. Your creations will be stamped with your unique creator handle.
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-2">
                  Select Creator Avatar
                </label>
                <div className="flex items-center justify-center gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`relative rounded-full p-1 transition-all ${
                        avatarUrl === preset
                          ? 'ring-2 ring-amber-400 scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {avatarUrl === preset && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 rounded-full p-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Handle */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2 rounded-lg text-sm border dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 bg-slate-50 border-slate-300 text-slate-800 focus:outline-none focus:border-amber-500"
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
                    placeholder="@chrono_artist"
                    className="w-full px-3 py-2 rounded-lg text-sm border font-mono dark:bg-stone-800 dark:border-stone-700 dark:text-amber-400 bg-slate-50 border-slate-300 text-amber-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                  Creative Bio
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Exploring epochs and classical aesthetics..."
                  className="w-full px-3 py-2 rounded-lg text-sm border dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 bg-slate-50 border-slate-300 text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1 mb-4">
                <h3 className="font-serif text-lg font-bold dark:text-stone-100 text-slate-800">
                  Camera & Pose Alignment Guide
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  For museum-grade historical realism, follow these 3 quick tips when taking your photo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border dark:border-stone-800 dark:bg-stone-800/40 bg-slate-50 border-slate-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full mx-auto bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold dark:text-stone-200 text-slate-700">
                    Frontal Eye Level
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Align your eyes with the booth oval guide for natural facial geometry.
                  </p>
                </div>

                <div className="p-3 rounded-xl border dark:border-stone-800 dark:bg-stone-800/40 bg-slate-50 border-slate-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full mx-auto bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold dark:text-stone-200 text-slate-700">
                    Even Lighting
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Soft natural light or warm frontal light ensures authentic chiaroscuro blending.
                  </p>
                </div>

                <div className="p-3 rounded-xl border dark:border-stone-800 dark:bg-stone-800/40 bg-slate-50 border-slate-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full mx-auto bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold dark:text-stone-200 text-slate-700">
                    Gemini 4 Argon
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Our AI automatically analyzes your facial expression to recommend matching eras!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-300">
                  <strong className="font-semibold">Privacy First:</strong> Photos are processed securely and locally. You maintain full ownership of all creations.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1 mb-4">
                <h3 className="font-serif text-lg font-bold dark:text-stone-100 text-slate-800">
                  Choose Your Destination Era
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Where would you like to travel first? Powered by gemini-nano-banana-2.1 with custom prompt editing.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {HISTORICAL_ERAS.map((era) => (
                  <button
                    key={era.id}
                    type="button"
                    onClick={() => setFavoriteEra(era.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      favoriteEra === era.id
                        ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500'
                        : 'dark:border-stone-800 dark:bg-stone-800/50 bg-slate-50 border-slate-200 hover:border-stone-600'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs"
                      style={{ backgroundColor: era.primaryColor }}
                    >
                      ⏳
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate dark:text-stone-200 text-slate-800">
                        {era.name}
                      </p>
                      <p className="text-[10px] text-amber-400 font-mono">
                        {era.year}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {era.badge}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t mt-6 dark:border-stone-800 border-slate-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold dark:text-stone-400 dark:hover:text-stone-200 text-slate-600 hover:text-slate-900"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:brightness-110 shadow-lg shadow-amber-500/30"
              >
                <Sparkles className="w-4 h-4" /> Start Time-Traveling
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
