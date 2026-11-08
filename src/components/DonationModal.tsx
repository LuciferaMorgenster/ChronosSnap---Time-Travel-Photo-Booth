import React, { useState } from 'react';
import {
  X,
  Heart,
  Coffee,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Check,
  Copy,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  paypalEmail?: string;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  paypalEmail = 'luciferamorgenster@gmail.com',
}) => {
  const { t } = useI18n();
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getPaypalDonateUrl = (amount: number) => {
    return `https://www.paypal.com/donate/?business=${encodeURIComponent(
      paypalEmail
    )}&no_recurring=0&amount=${amount}&currency_code=EUR&item_name=ChronosSnap+Time-Travel+Photo+Booth+Support`;
  };

  const paypalMeUrl = `https://www.paypal.me/luciferamorgenster/${selectedAmount}EUR`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(paypalEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden dark:bg-stone-900 dark:border-stone-700 bg-white border-slate-200">
        {/* Header with warm golden heart gradient */}
        <div className="relative p-6 bg-gradient-to-br from-amber-600 via-amber-700 to-stone-950 text-white space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-stone-950/70 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg">
            <Heart className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>

          <div>
            <h3 className="font-serif font-black text-xl text-amber-100">
              {t('supportChronosTitle')}
            </h3>
            <p className="text-xs text-amber-200/80">
              {t('supportChronosSubtitle')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Preset Donation Amounts */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
              {t('chooseAmount')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 10, 25].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-3 rounded-xl border text-center transition-all ${
                    selectedAmount === amt
                      ? 'border-amber-400 bg-amber-500/15 text-amber-400 font-bold ring-2 ring-amber-400/50 shadow-md'
                      : 'dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-300 bg-slate-50 border-slate-200 text-slate-700 hover:border-stone-600'
                  }`}
                >
                  <span className="font-mono text-base font-bold">€{amt}</span>
                  <span className="block text-[10px] text-stone-400">
                    {amt === 3
                      ? t('coffee')
                      : amt === 5
                      ? t('timeTravelTier')
                      : amt === 10
                      ? t('vipTier')
                      : t('patronTier')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PayPal Account Info Box */}
          <div className="p-3.5 rounded-xl border dark:border-stone-800 dark:bg-stone-950/50 bg-slate-50 border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-400">
                {t('verifiedPaypal')}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 font-mono"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? t('copied') : t('copy')}
              </button>
            </div>
            <p className="font-mono text-xs font-bold text-amber-400 select-all">
              {paypalEmail}
            </p>
          </div>

          {/* Primary Action Button (Direct PayPal Link) */}
          <div className="space-y-2 pt-1">
            <a
              href={getPaypalDonateUrl(selectedAmount)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/25 active:scale-95 transition-all text-center"
            >
              <Heart className="w-4 h-4 fill-stone-950" />
              <span>{t('donateAmountBtn')} (€{selectedAmount})</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </a>

            <a
              href={paypalMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
            >
              <span>{t('directPaypalMe')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Trust footnote */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t('securePaymentFootnote')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
