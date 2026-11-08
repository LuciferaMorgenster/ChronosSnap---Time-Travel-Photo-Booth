import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
  Eye,
  Sliders,
  Compass,
} from 'lucide-react';
import { playCameraShutterSound } from '../utils/audio';
import { SAMPLE_PORTRAITS, SamplePortrait } from '../data/samplePortraits';
import { FaceAnalysisResult } from '../types';
import { useI18n } from '../context/I18nContext';

interface CameraBoothProps {
  currentPhoto: string | null;
  onPhotoCaptured: (photoDataUrl: string) => void;
  onAnalyzeFace: (photoDataUrl: string) => Promise<FaceAnalysisResult | null>;
  isAnalyzing: boolean;
  analysisResult?: FaceAnalysisResult;
  onOpenAnalysisModal: () => void;
}

export const CameraBooth: React.FC<CameraBoothProps> = ({
  currentPhoto,
  onPhotoCaptured,
  onAnalyzeFace,
  isAnalyzing,
  analysisResult,
  onOpenAnalysisModal,
}) => {
  const { t } = useI18n();
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(t('cameraUnavailable'));
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCapture = () => {
    if (countdown !== null) return;
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        snapPhoto();
      }
    }, 800);
  };

  const snapPhoto = () => {
    if (!videoRef.current) return;
    playCameraShutterSound();
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 800;
    const ctx = canvas.getContext('2d')!;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onPhotoCaptured(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onPhotoCaptured(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SamplePortrait) => {
    onPhotoCaptured(sample.dataUrl);
  };

  return (
    <div className="rounded-2xl border p-4 sm:p-6 backdrop-blur-xl transition-all shadow-xl dark:bg-stone-900/70 dark:border-stone-800 bg-white/80 border-slate-200">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Viewfinder / Photo Display Area */}
        <div className="w-full md:w-3/5 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] sm:aspect-square max-w-[420px] rounded-2xl overflow-hidden border shadow-inner dark:bg-stone-950 dark:border-stone-800 bg-slate-900 border-slate-700 flex items-center justify-center">
            {/* Flash Effect Overlay */}
            {flash && (
              <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-300 pointer-events-none" />
            )}

            {/* Countdown Display */}
            {countdown !== null && (
              <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center pointer-events-none">
                <span className="font-serif font-black text-8xl text-amber-400 animate-ping">
                  {countdown}
                </span>
              </div>
            )}

            {/* 1. Live Camera Stream */}
            {cameraActive ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    facingMode === 'user' ? '-scale-x-100' : ''
                  }`}
                />

                {/* Face Alignment Reticle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-60 sm:w-56 sm:h-72 border-2 border-dashed border-amber-400/60 rounded-[50%] flex flex-col items-center justify-between py-6">
                    <span className="text-[10px] font-mono tracking-widest text-amber-300 bg-stone-900/80 px-2 py-0.5 rounded-full uppercase">
                      {t('alignFaceHere')}
                    </span>
                    <div className="w-8 h-0.5 bg-amber-400/40 rounded-full" />
                    <span className="text-[9px] font-mono text-amber-300/80 bg-stone-900/80 px-2 py-0.5 rounded-full">
                      {t('chinLevel')}
                    </span>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
              </div>
            ) : currentPhoto ? (
              /* 2. Captured / Selected Photo */
              <div className="relative w-full h-full group">
                <img
                  src={currentPhoto}
                  alt="Captured Portrait"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> {t('subjectCalibrated')}
                    </span>
                    <button
                      onClick={startCamera}
                      className="text-xs font-semibold px-3 py-1 rounded-lg bg-stone-900/90 text-stone-200 border border-stone-700 hover:border-amber-400 transition-colors"
                    >
                      {t('retake')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* 3. Empty Placeholder */
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl mx-auto bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold dark:text-stone-200 text-stone-100">
                    {t('temporalViewport')}
                  </h4>
                  <p className="text-xs text-stone-400 max-w-xs mt-1">
                    {t('temporalViewportDesc')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls Bar */}
          <div className="flex items-center gap-2 mt-4 w-full max-w-[420px]">
            {cameraActive ? (
              <>
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={countdown !== null}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  {countdown !== null ? `${t('snappingIn')} ${countdown}...` : t('capturePhoto')}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
                  }
                  title="Switch Camera"
                  className="p-3 rounded-xl border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 bg-slate-100 border-slate-300 text-slate-700 hover:border-amber-400 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3 py-3 rounded-xl border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 bg-slate-100 border-slate-300 text-slate-600 hover:text-stone-200 text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm hover:bg-amber-400 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  {t('launchPhotoBooth')}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                >
                  <Upload className="w-4 h-4" />
                  {t('upload')}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            )}
          </div>

          {cameraError && (
            <p className="text-[11px] text-amber-500/90 mt-2 flex items-center gap-1 text-center">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {cameraError}
            </p>
          )}
        </div>

        {/* Right: AI Understanding (Gemini 4 Argon) & Quick Sample Presets */}
        <div className="w-full md:w-2/5 flex flex-col justify-between space-y-4">
          {/* Gemini 4 Argon Analysis Card */}
          <div className="p-4 rounded-xl border dark:border-stone-800 dark:bg-stone-950/60 bg-slate-50 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wide dark:text-stone-200 text-slate-800 uppercase">
                    {t('geminiVisionTitle')}
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    {t('geminiVisionSubtitle')}
                  </p>
                </div>
              </div>

              {analysisResult && (
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {analysisResult.eraCompatibilityScore}% {t('matchScore')}
                </span>
              )}
            </div>

            {currentPhoto ? (
              <div className="space-y-2.5">
                {analysisResult ? (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg dark:bg-stone-900/90 bg-white border dark:border-stone-800 border-slate-200">
                      <p className="text-[11px] text-stone-400">{t('aestheticArchetype')}</p>
                      <p className="font-semibold text-amber-400 font-serif">
                        {analysisResult.aestheticArchetype}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg dark:bg-stone-900/90 bg-white border dark:border-stone-800 border-slate-200">
                      <p className="text-[11px] text-stone-400">{t('topRecommendedEras')}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysisResult.recommendedEras.map((era, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
                          >
                            {era}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onOpenAnalysisModal}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-amber-500 dark:hover:bg-amber-500/10 hover:bg-amber-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> {t('viewFullReport')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-stone-400">
                      {t('analysisPrompt')}
                    </p>
                    <button
                      type="button"
                      onClick={() => onAnalyzeFace(currentPhoto)}
                      disabled={isAnalyzing}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      {isAnalyzing ? t('analyzingFace') : t('analyzeFaceBtn')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-stone-400">
                {t('analysisPrompt')}
              </p>
            )}
          </div>

          {/* Preset Sample Faces */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                {t('orTrySample')}
              </span>
              <span className="text-[10px] text-stone-500">{t('oneClickTest')}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_PORTRAITS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="group relative rounded-xl overflow-hidden border dark:border-stone-800 dark:hover:border-amber-400 border-slate-300 hover:border-amber-500 transition-all text-left"
                >
                  <img
                    src={sample.dataUrl}
                    alt={sample.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-black/70 backdrop-blur-xs">
                    <p className="text-[9px] font-semibold text-stone-200 truncate leading-tight">
                      {sample.name.split(' ')[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
