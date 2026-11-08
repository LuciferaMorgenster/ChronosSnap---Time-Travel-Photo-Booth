import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { SupportedLanguage } from '../i18n/translations';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, languages } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300 dark:hover:bg-stone-800 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
        title="Change Language / Taal wijzigen"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="font-mono uppercase text-[11px] font-bold">
          {currentLang.code}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-xl shadow-2xl border p-1.5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-200 bg-white border-slate-200 text-slate-800"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-stone-400 border-b dark:border-stone-800 border-slate-100 mb-1">
            Language / Taal
          </div>

          <div className="space-y-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code as SupportedLanguage);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  language === lang.code
                    ? 'bg-amber-500/15 text-amber-500 font-bold'
                    : 'dark:hover:bg-stone-800 hover:bg-slate-100 text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {language === lang.code && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
