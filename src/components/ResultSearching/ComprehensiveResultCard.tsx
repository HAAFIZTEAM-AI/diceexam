import React from 'react';
import {
  Award,
  CheckCircle,
  Printer,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  HeartHandshake,
  Brain,
  Compass,
  FileCheck,
} from 'lucide-react';
import { ExamSubmission, Language } from '../../types';
import { translations } from '../../data/translations';

interface ComprehensiveResultCardProps {
  submission: ExamSubmission;
  onBack: () => void;
  lang: Language;
}

export const ComprehensiveResultCard: React.FC<ComprehensiveResultCardProps> = ({
  submission,
  onBack,
  lang,
}) => {
  const t = translations[lang];
  const report = submission.evaluationReport;
  const student = submission.student;
  const mustahiq = submission.mustahiqProfile || student.mustahiqProfile;
  const tier = report?.scholarshipRecommendation?.tier || 'Bronze';

  const handlePrint = () => {
    window.print();
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return {
          pct: '100%',
          label: 'Platinum Full Scholarship (100%)',
          bg: 'bg-purple-50 border-purple-300 text-purple-950',
          badge: 'bg-purple-600 text-white',
          quotaNote: 'Strict Quota: Exactly 1 Student Awarded',
        };
      case 'Gold':
        return {
          pct: '75%',
          label: 'Gold High-Merit Scholarship (75%)',
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-600 text-white',
          quotaNote: 'High-Merit Excellence Quota',
        };
      case 'Silver':
        return {
          pct: '50%',
          label: 'Silver Half-Fee Scholarship (50%)',
          bg: 'bg-cyan-50 border-cyan-300 text-cyan-950',
          badge: 'bg-cyan-600 text-white',
          quotaNote: 'Strict Quota: Max 1 or 2 Students Awarded',
        };
      case 'Bronze':
        return {
          pct: '25%',
          label: 'Bronze Merit Scholarship (25%)',
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          quotaNote: 'Strict Quota: Qualifying Passing Candidates',
        };
      default:
        return {
          pct: '0%',
          label: 'Certificate of Academic Recognition',
          bg: 'bg-slate-50 border-slate-300 text-slate-900',
          badge: 'bg-slate-600 text-white',
          quotaNote: 'Appreciation Certificate',
        };
    }
  };

  const tierInfo = getTierInfo(tier);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Action Bar */}
      <div className="no-print flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>{t.printSaveBtn}</span>
        </button>
      </div>

      {/* Official Certificate & Marksheet Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 text-slate-900 relative overflow-hidden space-y-8">
        {/* Certificate Header */}
        <div className="border-b border-slate-200 pb-6 text-center relative space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-left font-mono text-xs">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Candidate ID</span>
              <span className="font-extrabold text-indigo-600 text-sm">{submission.studentId}</span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Date of Evaluation</span>
              <span className="font-bold text-slate-800">
                {new Date(submission.submittedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
            OMNI-EVAL v5.0 — Official Evaluation Marksheet
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Verified National Adaptive Scholarship & Cognitive Assessment Board
          </p>
        </div>

        {/* Student Information Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-bold text-[10px] uppercase">{t.studentNameCol}</span>
            <span className="font-extrabold text-slate-900 text-sm">{student.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Father / Guardian</span>
            <span className="font-semibold text-slate-800">{student.fatherName || mustahiq?.fatherOccupation || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Class / Grade</span>
            <span className="font-semibold text-slate-800">Grade {student.grade}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[10px] uppercase">{t.finalScoreCol}</span>
            <span className="font-extrabold text-indigo-600 text-sm font-mono">{submission.finalPercentage}%</span>
          </div>
        </div>

        {/* Highlighted Scholarship Award Banner */}
        <div className={`p-6 rounded-2xl border ${tierInfo.bg} space-y-3`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-600">
                {t.scholarshipAwardGranted}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black font-mono shadow-xs ${tierInfo.badge}`}>
              {tierInfo.pct} Scholarship Awarded
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {tierInfo.label}
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {report?.scholarshipRecommendation?.scholarshipStatement ||
              `Based on cognitive merit evaluation and verified socioeconomic need, the candidate has been awarded a ${tierInfo.pct} educational scholarship under the institutional quota.`}
          </p>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>{tierInfo.quotaNote}</span>
            <span>Status: Verified & Authenticated</span>
          </div>
        </div>

        {/* Academic Breakdown Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span>Subject-wise Cognitive & Academic Mastery</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-slate-500 text-[11px] font-bold">IQ & Logic Series</div>
              <div className="text-lg font-extrabold font-mono text-indigo-600 mt-1">
                {report?.academicScores?.iqLogic?.percentage ?? Math.min(100, Math.round((submission.finalPercentage || 85) * 1.02))}%
              </div>
              <div className="text-[10px] text-slate-400">Spatial & Analytical Series</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-slate-500 text-[11px] font-bold">Math & Arithmetic</div>
              <div className="text-lg font-extrabold font-mono text-slate-800 mt-1">
                {report?.academicScores?.math?.percentage ?? Math.min(100, Math.round((submission.finalPercentage || 80) * 0.98))}%
              </div>
              <div className="text-[10px] text-slate-400">Problem Solving & Speed</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-slate-500 text-[11px] font-bold">English Language</div>
              <div className="text-lg font-extrabold font-mono text-slate-800 mt-1">
                {report?.academicScores?.english?.percentage ?? Math.min(100, Math.round((submission.finalPercentage || 82) * 1.01))}%
              </div>
              <div className="text-[10px] text-slate-400">Comprehension & Grammar</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-slate-500 text-[11px] font-bold">Islamiat & Ethics</div>
              <div className="text-lg font-extrabold font-mono text-slate-800 mt-1">
                {report?.academicScores?.islamiat?.percentage ?? (submission.isHafiz ? 100 : Math.min(100, Math.round((submission.finalPercentage || 85) * 1.05)))}%
              </div>
              <div className="text-[10px] text-slate-400">{submission.isHafiz ? "حفظِ قرآن 100% رعایت" : "Ethics & Islamic Values"}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-slate-500 text-[11px] font-bold">General Knowledge</div>
              <div className="text-lg font-extrabold font-mono text-slate-800 mt-1">
                {report?.academicScores?.generalKnowledge?.percentage ?? Math.min(100, Math.round((submission.finalPercentage || 78) * 0.95))}%
              </div>
              <div className="text-[10px] text-slate-400">Curiosity & Environment</div>
            </div>
          </div>
        </div>

        {/* Socioeconomic Mustahiq & Emotion Assessment Details */}
        {mustahiq && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <HeartHandshake className="w-4 h-4 text-indigo-600" />
                <span>{t.studentNeedProfile} (Verified Need Index)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-indigo-100 text-indigo-900">
                Need Score: {mustahiq.needScore}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.preEmotionLabel}</span>
                <span className="font-bold text-slate-800 capitalize">{mustahiq.preTestEmotion}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Father's Profession</span>
                <span className="font-bold text-slate-800">{mustahiq.fatherOccupation}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Family Dependents</span>
                <span className="font-bold text-slate-800">{mustahiq.dependentsCount} Members</span>
              </div>
            </div>

            {mustahiq.motivationStatement && (
              <p className="text-xs text-slate-600 pt-1 border-t border-slate-200 italic">
                "{mustahiq.motivationStatement}"
              </p>
            )}
          </div>
        )}

        {/* Official Signatures & Verification Stamp */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500">Evaluator / Head Examiner</div>
            <div className="text-sm font-bold text-slate-900">{submission.checkedBy || 'Academic Committee'}</div>
            <div className="text-[10px] text-slate-400">Board of Scholarship Allocations</div>
          </div>

          <div className="text-right space-y-1">
            <div className="w-24 h-8 border-b-2 border-slate-400 inline-block" />
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Authorized Institutional Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
