import React, { useState, useEffect } from 'react';
import {
  X,
  Film,
  Download,
  Share2,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Video,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateTransformationVideo } from '../utils/videoRecorder';
import { playTimeWarpSound } from '../utils/audio';
import { useI18n } from '../context/I18nContext';

interface VideoExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalPhoto: string;
  transformedPhoto: string;
  eraName: string;
  eraYear: string;
  creatorHandle: string;
}

export const VideoExportModal: React.FC<VideoExportModalProps> = ({
  isOpen,
  onClose,
  originalPhoto,
  transformedPhoto,
  eraName,
  eraYear,
  creatorHandle,
}) => {
  const { t } = useI18n();
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !videoUrl && !isRendering) {
      startVideoGeneration();
    }
  }, [isOpen]);

  const startVideoGeneration = async () => {
    try {
      setIsRendering(true);
      setError(null);
      setProgress(0);
      playTimeWarpSound();

      const { blob, url } = await generateTransformationVideo({
        originalImgUrl: originalPhoto,
        transformedImgUrl: transformedPhoto,
        eraName,
        eraYear,
        creatorHandle,
        onProgress: (p) => setProgress(p),
      });

      setVideoBlob(blob);
      setVideoUrl(url);
      setIsRendering(false);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Video generation failed:', err);
      setError(err.message || 'Video rendering failed. Please try again.');
      setIsRendering(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `chronos-transformation-${eraName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.webm`;
    a.click();
  };

  const handleShareVideo = async () => {
    if (!videoBlob) return;
    try {
      const file = new File([videoBlob], 'chronos-timetravel.webm', { type: 'video/webm' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My Time Travel Transformation to ${eraName}!`,
          text: `Check out my historical transformation to ${eraName} (${eraYear}) with ChronosSnap!`,
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.log('Share error or cancelled', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden dark:bg-stone-900 dark:border-stone-700 bg-white border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-stone-800 border-slate-200 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm dark:text-stone-100 text-slate-800">
                {t('videoStudioTitle')}
              </h3>
              <p className="text-[11px] text-stone-400">
                {t('videoStudioSubtitle')}
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

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center">
          {isRendering ? (
            <div className="w-full py-12 flex flex-col items-center text-center space-y-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-b-amber-500 animate-spin-reverse" />
                <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-lg text-amber-400">
                  {progress}%
                </div>
              </div>

              <div className="space-y-2 max-w-xs">
                <h4 className="font-serif text-base font-bold dark:text-stone-200 text-slate-800">
                  {t('renderingWarp')}
                </h4>
                <p className="text-xs text-stone-400">
                  {progress < 30
                    ? '1/3 Calibrating temporal laser scanline...'
                    : progress < 70
                    ? '2/3 Accelerating time vortex & morphing face...'
                    : '3/3 Stamping historical credentials & master title...'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 via-amber-400 to-yellow-400 h-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : videoUrl ? (
            <div className="w-full space-y-4 flex flex-col items-center">
              {/* Video Player */}
              <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border shadow-2xl dark:border-stone-700 border-slate-300 bg-black">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> {t('videoReady')}
                </div>
                <p className="text-[11px] text-stone-400">
                  {t('videoOptimizedDesc')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-purple-600/25 transition-all"
                >
                  <Download className="w-4 h-4" /> {t('downloadVideo')}
                </button>

                <button
                  type="button"
                  onClick={handleShareVideo}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Share2 className="w-4 h-4 text-amber-400" /> {t('shareVideo')}
                </button>

                <button
                  type="button"
                  onClick={startVideoGeneration}
                  title="Re-render Video"
                  className="p-2.5 rounded-xl border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 bg-slate-100 border-slate-300 text-slate-700 hover:border-amber-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            error && (
              <div className="py-8 text-center space-y-4">
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={startVideoGeneration}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Retry Video Rendering
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
