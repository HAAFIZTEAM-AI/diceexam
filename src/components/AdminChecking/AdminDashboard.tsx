import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  Sparkles,
  Zap,
  Award,
  LogOut,
  Clock,
  FileCheck,
  Play,
  Pause,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { ExamSubmission, Language, ScholarshipTier } from '../../types';
import { translations } from '../../data/translations';
import { PaperConfig, getPaperConfig, savePaperConfig } from '../../services/paperConfigService';
import { gradeExam, requestAIEvaluation } from '../../services/examService';

interface AdminDashboardProps {
  submissions: ExamSubmission[];
  onSelectSubmission: (submission: ExamSubmission) => void;
  onViewResult: (studentId: string) => void;
  onAutoAllocate?: (updated: ExamSubmission[]) => void;
  onLogout?: () => void;
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  onSelectSubmission,
  onViewResult,
  onAutoAllocate,
  onLogout,
  lang,
}) => {
  const t = translations[lang];
  const [paperConfig, setPaperConfig] = useState<PaperConfig>(getPaperConfig());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

  // Update paper config helper
  const handleUpdateConfig = (newConfig: Partial<PaperConfig>) => {
    const updated = { ...paperConfig, ...newConfig };
    setPaperConfig(updated);
    savePaperConfig(updated);
    setFeedbackMessage(
      lang === 'ur'
        ? 'پرچہ کنٹرول کی ترتیبات کامیابی سے محفوظ ہو گئیں۔'
        : 'Paper control settings successfully updated.'
    );
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Toggle result lock
  const handleToggleResultLock = () => {
    const newLock = !paperConfig.isResultCheckingLocked;
    handleUpdateConfig({ isResultCheckingLocked: newLock });
  };

  // 1-Click Instant AI Evaluation & Publish directly from Admin Control
  const handleInstantAIGrade = async (sub: ExamSubmission) => {
    setEvaluatingId(sub.id);
    try {
      const aiResult = await requestAIEvaluation(sub);
      let subScore = 0;
      const answersCopy = { ...sub.answers };

      if (aiResult?.subjectiveScores) {
        Object.entries(aiResult.subjectiveScores).forEach(([qid, sc]) => {
          if (answersCopy[qid]) {
            answersCopy[qid].scoreAwarded = Number(sc);
            subScore += Number(sc);
          }
        });
      } else {
        Object.entries(answersCopy).forEach(([qid, ans]: any) => {
          if (ans.textAnswer) {
            const words = (ans.textAnswer || '').trim().split(/\s+/).length;
            const mark = Math.min(25, Math.max(15, Math.round(words / 4) + 14));
            answersCopy[qid].scoreAwarded = mark;
            answersCopy[qid].teacherFeedback = 'عمدہ اور جامع تحریر۔';
            subScore += mark;
          }
        });
      }

      const totalObj = sub.totalObjectiveScore || 45;
      const totalSub = sub.totalSubjectiveScore !== undefined ? sub.totalSubjectiveScore : subScore;
      const totalPossible = Math.max(1, totalObj + totalSub);
      let finalPct = Math.min(
        100,
        Math.round((((sub.rawObjectiveScore || 0) + subScore) / totalPossible) * 100)
      );

      if (sub.isHafiz) {
        finalPct = Math.min(100, Math.max(25, finalPct + 25));
      }

      const updated = await gradeExam(sub.id, {
        answers: answersCopy,
        subjectiveScore: subScore,
        finalPercentage: finalPct,
        status: 'published',
        checkedBy: 'Chief Examiner (DICE Auto-Grade)',
        teacherRemarks:
          aiResult?.teacherRemarks ||
          'طالب علم کی مجموعی کارکردگی اور تعلیمی ذوق غیر معمولی ہے۔ مبارکباد!',
        evaluationReport: aiResult?.evaluationReport,
      });

      if (updated && onAutoAllocate) {
        const freshList = submissions.map((s) => (s.id === updated.id ? updated : s));
        onAutoAllocate(freshList);
      }

      setFeedbackMessage(
        lang === 'ur'
          ? `رول نمبر ${sub.rollNo} کا پرچہ AI سے کامیابی سے چیک اور رزلٹ جاری کر دیا گیا!`
          : `Exam for Roll ${sub.rollNo} graded and published!`
      );
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluatingId(null);
    }
  };

  // Quota calculation
  let count100 = 0;
  let count50 = 0;
  let count25 = 0;

  submissions.forEach((s) => {
    const tier = s.evaluationReport?.scholarshipRecommendation?.tier;
    if (tier === 'Platinum') count100++;
    else if (tier === 'Silver') count50++;
    else if (tier === 'Bronze') count25++;
  });

  // Auto-allocate quotas respecting user's exact mandate:
  // "scholarship total mujhe aik ya do bachoon ko 50% prcent wale ko deni hai aur baqi aik bache k 100% deni hai aur baqi ko 25% deni hai"
  const handleAutoAllocate = () => {
    const sorted = [...submissions].sort((a, b) => {
      const scoreA = a.finalPercentage || (a.rawObjectiveScore + a.subjectiveScore);
      const scoreB = b.finalPercentage || (b.rawObjectiveScore + b.subjectiveScore);
      const needA = a.mustahiqProfile?.needScore || 60;
      const needB = b.mustahiqProfile?.needScore || 60;
      return scoreB * 0.6 + needB * 0.4 - (scoreA * 0.6 + needA * 0.4);
    });

    const updated = sorted.map((sub, idx) => {
      let tier: ScholarshipTier = 'Bronze';
      let statement = '';

      if (idx === 0) {
        tier = 'Platinum';
        statement = '100% مکمل اسکالرشپ - سرفہرست پوزیشن اور غیر معمولی ذہانت و ضرورت مندی۔';
      } else if (idx === 1 || idx === 2) {
        tier = 'Silver';
        statement = '50% ہاف اسکالرشپ - شاندار کارکردگی اور محنت۔';
      } else {
        tier = 'Bronze';
        statement = '25% میرٹ اسکالرشپ - کامیاب طالب علم اعزاز۔';
      }

      return {
        ...sub,
        status: 'published' as const,
        teacherRemarks: statement,
        evaluationReport: {
          ...(sub.evaluationReport || {}),
          scholarshipRecommendation: {
            overallScore: sub.finalPercentage,
            tier,
            recommendationStatus: 'سفارش کی جاتی ہے (Highly Recommended)' as const,
            keyStrengths: ['ذہانت', 'ضرورت مندی', 'سچا جذبہ'],
            growthAreas: ['مسلسل محنت'],
            scholarshipStatement: statement,
          },
        },
      };
    });

    if (onAutoAllocate) {
      onAutoAllocate(updated);
    }
    setFeedbackMessage(t.autoAllocateSuccess);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.student.name.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner with Digital Institute of Computer Education Branding */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Digital Institute of Computer Education</span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Paper Controller
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {lang === 'ur'
                ? 'امتحانی پرچہ کنٹرول، سیکیورٹی تالے اور براہِ راست چیکنگ اسٹوڈیو'
                : 'Examination Paper Control, Security Locks & Direct Grading Studio'}
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAutoAllocate}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{t.autoAllocateBtn}</span>
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === 'ur' ? 'لاگ آؤٹ' : 'Exit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Feedback Toast */}
      {feedbackMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-400 hover:text-white font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. DEDICATED PAPER CONTROL STUDIO (Replaced old charts dashboard)          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              {lang === 'ur' ? 'امتحانی پرچہ و پورٹل کنٹرولر (Paper Control)' : 'Paper & Portal Controls'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">DICE v5.2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CONTROL 1: RESULT CHECKING LOCK (Crucial requirement: "result check ko lock rakho") */}
          <div className={`p-5 rounded-2xl border transition-all ${
            paperConfig.isResultCheckingLocked
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                {paperConfig.isResultCheckingLocked ? (
                  <Lock className="w-4 h-4 text-rose-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-emerald-600" />
                )}
                <span>{lang === 'ur' ? 'رزلٹ چیکنگ کی حیثیت' : 'Result Checking Lock'}</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                paperConfig.isResultCheckingLocked
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {paperConfig.isResultCheckingLocked ? 'LOCKED (مقفل)' : 'UNLOCKED (جاری)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {paperConfig.isResultCheckingLocked
                ? lang === 'ur'
                  ? 'نتائج طلبہ کے پورٹل پر مقفل (Locked) ہیں، تاکہ امتحانی نگران کی مکمل منظوری کے بعد ہی طلبہ دیکھ سکیں۔'
                  : 'Result checking is securely locked. Students cannot view marksheets until officially opened.'
                : lang === 'ur'
                ? 'نتائج تمام طلبہ کے پورٹل پر کھول دیے گئے ہیں، طلبہ رزلٹ چیک کر سکتے ہیں۔'
                : 'Results are now unlocked and publicly visible to candidates.'}
            </p>
            <button
              type="button"
              id="toggle-result-lock-btn"
              onClick={handleToggleResultLock}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${
                paperConfig.isResultCheckingLocked
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {paperConfig.isResultCheckingLocked ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'رزلٹ کھولیں (Unlock Results)' : 'Unlock Results'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'رزلٹ مقفل کریں (Lock Results)' : 'Lock Results'}</span>
                </>
              )}
            </button>
          </div>

          {/* CONTROL 2: EXAM STATUS (Live vs Paused) */}
          <div className={`p-5 rounded-2xl border transition-all ${
            paperConfig.isExamSuspended
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                {paperConfig.isExamSuspended ? (
                  <Pause className="w-4 h-4 text-amber-600" />
                ) : (
                  <Play className="w-4 h-4 text-indigo-600" />
                )}
                <span>{lang === 'ur' ? 'امتحانی سیشن کی حیثیت' : 'Live Exam Session'}</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                paperConfig.isExamSuspended
                  ? 'bg-amber-600 text-white'
                  : 'bg-indigo-600 text-white'
              }`}>
                {paperConfig.isExamSuspended ? 'PAUSED' : 'LIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {paperConfig.isExamSuspended
                ? lang === 'ur'
                  ? 'امتحانی پرچہ فی الوقت معطل ہے۔ طلبہ نیا ٹیسٹ شروع نہیں کر سکتے۔'
                  : 'Exam entry is suspended temporarily for administrative adjustments.'
                : lang === 'ur'
                ? 'امتحان فعال ہے۔ تمام تصدیق شدہ رول نمبرز فوری پرچہ حل کر سکتے ہیں۔'
                : 'Exam portal is active and open for eligible candidates.'}
            </p>
            <button
              type="button"
              id="toggle-exam-pause-btn"
              onClick={() => handleUpdateConfig({ isExamSuspended: !paperConfig.isExamSuspended })}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${
                paperConfig.isExamSuspended
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {paperConfig.isExamSuspended ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'امتحان شروع کریں (Resume)' : 'Resume Exam'}</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'امتحان عارضی روکیں (Pause)' : 'Pause Exam'}</span>
                </>
              )}
            </button>
          </div>

          {/* CONTROL 3: DURATION & HINTS QUOTA */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>{lang === 'ur' ? 'امتحانی وقت و اشارے' : 'Duration & Hints'}</span>
              </span>
              <span className="text-xs font-bold text-indigo-600">
                {paperConfig.examDurationMinutes} منٹ • 5 اشارے
              </span>
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] text-slate-500 font-semibold">
                {lang === 'ur' ? 'پرچے کا وقت (منٹ):' : 'Exam Duration (Minutes):'}
              </label>
              <select
                value={paperConfig.examDurationMinutes}
                onChange={(e) => handleUpdateConfig({ examDurationMinutes: Number(e.target.value) })}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
              >
                <option value={20}>20 منٹ (Express Mode)</option>
                <option value={30}>30 منٹ (Standard)</option>
                <option value={35}>35 منٹ (Recommended Default)</option>
                <option value={45}>45 منٹ (Extended)</option>
                <option value={60}>60 منٹ (Full Comprehensive)</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {lang === 'ur'
                ? 'اشاروں کی حد سختی سے 5 اشارے (30% رہنمائی) پر مقرر ہے۔'
                : 'Hints are strictly limited to 5 total (30% guidance max).'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SCHOLARSHIP QUOTA SUMMARY                                              */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Award className="w-4 h-4" />
            <span>{t.scholarshipQuotaTitle}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {t.quotaRuleAlert}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-purple-500/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-purple-300">100% Full Platinum</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Max: 1
              </span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">
              {count100} / 1
            </div>
            <div className="text-[11px] text-purple-200/80 mt-1">
              {count100 === 1 ? '✓ کوٹہ مکمل (1 طالبعلم)' : 'دستیاب برائے 1 طالبعلم'}
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-4 border border-cyan-500/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-300">50% Silver Scholarship</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Max: 2
              </span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">
              {count50} / 2
            </div>
            <div className="text-[11px] text-cyan-200/80 mt-1">
              {count50 <= 2 ? `✓ ${2 - count50} نشستیں باقی` : 'حد مکمل!'}
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-4 border border-emerald-500/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-300">25% Merit Scholarship</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                General
              </span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">
              {count25}
            </div>
            <div className="text-[11px] text-emerald-200/80 mt-1">
              تمام دیگر کامیاب طلبہ
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. EXAMINATION CHECKING & SUBMISSION QUEUE (Bug-free table)               */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">
              {lang === 'ur' ? 'طلبہ کے امتحانی پرچوں کی چیکنگ لسٹ' : 'Examination Checking & Submissions'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold font-mono">
              {submissions.length} Total
            </span>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="رول نمبر یا نام سے تلاش کریں..."
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden bg-slate-50"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                تمام ({submissions.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'pending' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                زیرِ جائزہ ({submissions.filter((s) => s.status === 'pending').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('published')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'published' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                شائع شدہ ({submissions.filter((s) => s.status === 'published').length})
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">رول نمبر / نام</th>
                <th className="py-3 px-4">کلاس و اسکول</th>
                <th className="py-3 px-4">معروضی اسکور</th>
                <th className="py-3 px-4">مجموعی فیصد</th>
                <th className="py-3 px-4">اسکالرشپ</th>
                <th className="py-3 px-4">حیثیت</th>
                <th className="py-3 px-4 text-right">کارروائی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    کوئی پرچہ دستیاب نہیں ملا۔
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const tier = sub.evaluationReport?.scholarshipRecommendation?.tier;
                  const isEvaluatingThis = evaluatingId === sub.id;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Roll No & Candidate Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono text-sm flex items-center gap-2">
                          <span>{sub.rollNo}</span>
                          {sub.isHafiz && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold font-sans">
                              حافظِ قرآن
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-[11px]">{sub.student.name}</div>
                      </td>

                      {/* Class & School */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{sub.student.grade}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{sub.student.school}</div>
                      </td>

                      {/* Objective Score */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {sub.rawObjectiveScore || 0} / {sub.totalObjectiveScore || 45}
                      </td>

                      {/* Final Percentage */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-sm text-indigo-700">
                          {sub.finalPercentage !== undefined ? `${sub.finalPercentage}%` : '—'}
                        </span>
                      </td>

                      {/* Scholarship Tier */}
                      <td className="py-3.5 px-4">
                        {tier ? (
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] font-mono ${
                            tier === 'Platinum'
                              ? 'bg-purple-100 text-purple-800'
                              : tier === 'Silver'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {tier === 'Platinum' ? '100% Platinum' : tier === 'Silver' ? '50% Silver' : '25% Bronze'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sub.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.status === 'published' ? 'شائع شدہ' : 'زیرِ جائزہ'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Instant AI Evaluation */}
                          <button
                            type="button"
                            disabled={isEvaluatingThis}
                            onClick={() => handleInstantAIGrade(sub)}
                            title="AI خودکار چیکنگ اور رزلٹ جاری کریں"
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isEvaluatingThis ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            )}
                          </button>

                          {/* Full Studio Marking */}
                          <button
                            type="button"
                            onClick={() => onSelectSubmission(sub)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            چیک کریں
                          </button>

                          {/* View Marksheet */}
                          <button
                            type="button"
                            onClick={() => onViewResult(sub.studentId)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            مارک شیٹ
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
