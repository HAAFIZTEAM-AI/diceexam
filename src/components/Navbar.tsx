import React from 'react';
import {
  Brain,
  ShieldAlert,
  Search,
  CheckCircle2,
  Sparkles,
  Award,
  Globe,
  GraduationCap,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  activeTab: 'exam' | 'search' | 'admin';
  setActiveTab: (tab: 'exam' | 'search' | 'admin') => void;
  lang: Language;
  setLang: (l: Language) => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  pendingCount,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveTab('exam')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  {t.appName}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  v6.0 Adaptive
                </span>
              </div>
              <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            <button
              id="nav-exam-btn"
              onClick={() => setActiveTab('exam')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'exam'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t.navTakeExam}</span>
            </button>

            <button
              id="nav-search-btn"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.navResults}</span>
            </button>

            <button
              id="nav-admin-btn"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{t.navAdmin}</span>
              {pendingCount > 0 ? (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                  {pendingCount}
                </span>
              ) : null}
            </button>
          </nav>

          {/* Right Utilities: Language Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
              <div className="px-2 text-slate-400 hidden sm:flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <button
                id="lang-ur-btn"
                onClick={() => setLang('ur')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'ur'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                اردو
              </button>
              <button
                id="lang-roman-btn"
                onClick={() => setLang('roman')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'roman'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Roman
              </button>
              <button
                id="lang-en-btn"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold ${
              activeTab === 'exam' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t.navTakeExam}</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold ${
              activeTab === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.navResults}</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold ${
              activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.navAdmin}</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
