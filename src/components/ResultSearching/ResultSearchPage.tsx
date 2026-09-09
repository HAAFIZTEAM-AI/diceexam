import React, { useState, useEffect } from 'react';
import {
  Search,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  FileText,
  AlertCircle,
  HeartHandshake,
} from 'lucide-react';
import { ExamSubmission, Language } from '../../types';
import { ComprehensiveResultCard } from './ComprehensiveResultCard';
import { translations } from '../../data/translations';

interface ResultSearchPageProps {
  submissions: ExamSubmission[];
  initialQuery?: string;
  onGoToAdmin: (submissionId?: string) => void;
  lang: Language;
}

export const ResultSearchPage: React.FC<ResultSearchPageProps> = ({
  submissions,
  initialQuery = '',
  onGoToAdmin,
  lang,
}) => {
  const t = translations[lang];
  const [query, setQuery] = useState(initialQuery);
  const [selectedSubmission, setSelectedSubmission] = useState<ExamSubmission | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      const exact = submissions.find(
        (s) => s.studentId.toLowerCase() === initialQuery.toLowerCase()
      );
      if (exact && exact.status === 'published') {
        setSelectedSubmission(exact);
      }
    }
  }, [initialQuery, submissions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const trimmed = query.trim().toLowerCase();
  const searchResults = trimmed
    ? submissions.filter(
        (s) =>
          s.studentId.toLowerCase().includes(trimmed) ||
          s.rollNo.toLowerCase().includes(trimmed) ||
          s.student.name.toLowerCase().includes(trimmed)
      )
    : [];

  const sampleCandidates = [
    { label: '🏆 OMNI-2026-001 (Ayesha Khan - 100% Platinum)', query: 'OMNI-2026-001' },
    { label: '🥈 OMNI-2026-003 (Zainab Fatima - 50% Silver)', query: 'OMNI-2026-003' },
    { label: '🥉 OMNI-2026-004 (Muhammad Usman - 25% Bronze)', query: 'OMNI-2026-004' },
  ];

  if (selectedSubmission) {
    return (
      <ComprehensiveResultCard
        submission={selectedSubmission}
        onBack={() => setSelectedSubmission(null)}
        lang={lang}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.searchTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{t.searchSubtitle}</p>
          </div>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute inset-y-0 left-3.5 my-auto text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full text-sm py-3.5 pl-11 pr-4 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder:text-slate-400 bg-slate-50/50"
            />
          </div>

          {/* Sample Candidate Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Quick test:</span>
            {sampleCandidates.map((c) => (
              <button
                key={c.query}
                type="button"
                onClick={() => setQuery(c.query)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
              >
                {c.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Search Results Display */}
      {trimmed && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Matching Submissions ({searchResults.length})
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No matching submission found for "{query}". Make sure you entered the correct Unique Student ID.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {searchResults.map((sub) => {
                const tier = sub.evaluationReport?.scholarshipRecommendation?.tier;
                const isPublished = sub.status === 'published';

                return (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 hover:shadow-sm transition-all flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{sub.student.name}</span>
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {sub.studentId}
                        </span>
                        {tier === 'Platinum' && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                            100% Full Scholarship
                          </span>
                        )}
                        {tier === 'Silver' && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-200">
                            50% Scholarship
                          </span>
                        )}
                        {tier === 'Bronze' && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                            25% Merit Scholarship
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Class: {sub.student.grade}</span>
                        <span>•</span>
                        <span>
                          Score: <strong className="text-slate-900">{sub.finalPercentage}%</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Need Index:{' '}
                          <strong className="text-rose-600">
                            {sub.mustahiqProfile?.needScore || 60}%
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div>
                      {isPublished ? (
                        <button
                          type="button"
                          onClick={() => setSelectedSubmission(sub)}
                          className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <span>{t.viewDetailedCard}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onGoToAdmin(sub.id)}
                          className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <span>Pending Checking — Grade Now</span>
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
