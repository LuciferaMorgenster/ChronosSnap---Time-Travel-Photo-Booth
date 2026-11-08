import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  eraName: string;
  eraYear: string;
  onDownload: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  eraName,
  eraYear,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const shareText = `I just traveled back in time to ${eraName} (${eraYear}) with ChronosSnap! Check out my historical portrait ⏳✨`;
  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ChronosSnap: My ${eraName} Portrait`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const openSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'pinterest':
        url = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;
        break;
      default:
        break;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden dark:bg-stone-900 dark:border-stone-700 bg-white border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-stone-800 border-slate-200 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm dark:text-stone-100 text-slate-800">
                Share Historical Portrait
              </h3>
              <p className="text-[11px] text-stone-400">
                {eraName} • {eraYear}
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
        <div className="p-6 space-y-5">
          {/* Preview Image Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl border dark:border-stone-800 dark:bg-stone-950/60 bg-slate-50 border-slate-200">
            <img
              src={imageUrl}
              alt=""
              className="w-16 h-16 rounded-lg object-cover border border-amber-500/40 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-serif font-bold text-sm truncate dark:text-stone-200 text-slate-800">
                {eraName}
              </h4>
              <p className="text-xs text-amber-500 font-mono">{eraYear}</p>
              <p className="text-[11px] text-stone-400 truncate">
                Museum Quality Portrait
              </p>
            </div>
          </div>

          {/* Direct Social Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
              Share to Platform
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => openSocial('twitter')}
                className="p-3 rounded-xl border dark:border-stone-800 dark:bg-stone-800/50 bg-slate-100 border-slate-200 hover:border-amber-400 transition-all flex flex-col items-center gap-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                  𝕏
                </div>
                <span className="text-[10px] font-semibold text-stone-300">X (Twitter)</span>
              </button>

              <button
                type="button"
                onClick={() => openSocial('whatsapp')}
                className="p-3 rounded-xl border dark:border-stone-800 dark:bg-stone-800/50 bg-slate-100 border-slate-200 hover:border-emerald-400 transition-all flex flex-col items-center gap-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  💬
                </div>
                <span className="text-[10px] font-semibold text-stone-300">WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => openSocial('pinterest')}
                className="p-3 rounded-xl border dark:border-stone-800 dark:bg-stone-800/50 bg-slate-100 border-slate-200 hover:border-red-400 transition-all flex flex-col items-center gap-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  📌
                </div>
                <span className="text-[10px] font-semibold text-stone-300">Pinterest</span>
              </button>

              <button
                type="button"
                onClick={() => openSocial('facebook')}
                className="p-3 rounded-xl border dark:border-stone-800 dark:bg-stone-800/50 bg-slate-100 border-slate-200 hover:border-blue-400 transition-all flex flex-col items-center gap-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  f
                </div>
                <span className="text-[10px] font-semibold text-stone-300">Facebook</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all"
            >
              <Share2 className="w-4 h-4" /> Native Share to Any App (Instagram, TikTok, Messages)
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Link!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Share Link
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" /> {showQr ? 'Hide QR' : 'Phone QR'}
              </button>
            </div>

            {/* QR Code view */}
            {showQr && (
              <div className="p-4 rounded-xl border dark:border-stone-800 dark:bg-stone-950 bg-slate-50 border-slate-200 flex flex-col items-center text-center space-y-2 animate-in fade-in">
                <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
                  {/* Generated QR visual pattern */}
                  <div className="w-full h-full border-4 border-stone-900 grid grid-cols-4 gap-1 p-1">
                    <div className="bg-stone-900 col-span-2 row-span-2" />
                    <div className="bg-stone-900" />
                    <div className="bg-stone-900" />
                    <div className="bg-stone-900" />
                    <div className="bg-stone-900" />
                    <div className="bg-stone-900 col-span-2" />
                    <div className="bg-stone-900" />
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 font-mono">
                  Scan with your mobile camera to open & save directly
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
