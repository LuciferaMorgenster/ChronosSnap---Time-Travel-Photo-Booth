import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 shadow-sm hover:brightness-110 active:scale-95 transition-all"
        title="Installeer ChronosSnap als app op je apparaat"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installeer App</span>
        <span className="sm:hidden">App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 bg-slate-100 border-slate-300 text-slate-700 hover:border-amber-400 transition-colors"
          title="Installeer op iOS / iPhone"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Installeer op iOS</span>
          <span className="sm:hidden">iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl dark:bg-stone-900 dark:border-stone-700 dark:text-stone-100 bg-white border border-slate-200 text-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                    📱
                  </div>
                  <h3 className="font-serif font-bold text-base">
                    Installeer op iPhone of iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs space-y-2 text-stone-400 dark:text-stone-300">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-amber-500 shrink-0">1.</span>
                  <span>Tik op de <strong>Deel-knop (Share)</strong> onderaan in Safari.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-amber-500 shrink-0">2.</span>
                  <span>Scroll naar beneden en tik op <strong>Zet op beginscherm (Add to Home Screen)</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-amber-500 shrink-0">3.</span>
                  <span>Tik op <strong>Voeg toe (Add)</strong> om ChronosSnap direct offline te openen!</span>
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Begrepen
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser install button if user wants to trigger it or see instructions
  return (
    <button
      onClick={() => {
        alert("Om ChronosSnap te installeren: klik op het installatie-icoon rechts in de adresbalk van je browser, of kies 'App installeren' in het browsermenu.");
      }}
      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300 bg-slate-100 border-slate-200 text-slate-700 hover:border-amber-400/40 transition-colors"
      title="Installeer app als PWA"
    >
      <Download className="w-3.5 h-3.5 text-amber-400" />
      <span>PWA</span>
    </button>
  );
};
