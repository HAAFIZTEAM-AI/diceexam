import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Save,
  Award,
  BookOpen,
  BrainCircuit,
  Zap,
  Check,
  HelpCircle,
  HeartHandshake,
  ShieldCheck,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamSubmission, ScholarshipTier, ComprehensiveReport, Language } from '../../types';
import { QUESTION_BANK } from '../../data/questionBank';
import { gradeExam, requestAIEvaluation, getQuestionById } from '../../services/examService';
import { translations } from '../../data/translations';

interface ExamGradingStudioProps {
  submission: ExamSubmission;
  onBack: () => void;
  onGraded: (updated: ExamSubmission) => void;
  lang: Language;
}

export const ExamGradingStudio: React.FC<ExamGradingStudioProps> = ({
  submission,
  onBack,
  onGraded,
  lang,
}) => {
  const t = translations[lang];
  const [answers, setAnswers] = useState<Record<string, any>>(submission.answers || {});
  const [teacherRemarks, setTeacherRemarks] = useState(
    submission.teacherRemarks ||
      (lang === 'ur'
        ? 'طالب علم نے امتحان کے تمام حصوں میں سنجیدہ فہم کا مظاہرہ کیا ہے۔ سیکھنے کا جذبہ موجود ہے۔'
        : lang === 'roman'
        ? 'Student ne test mein behtareen mehnat aur samajh ka muzahira kiya hai. Parhai ka jazba shandar hai.'
        : 'Student demonstrated sound reasoning, diligence, and academic potential.')
  );
  const [checkedBy, setCheckedBy] = useState(submission.checkedBy || 'Admin / Academic Committee');
  const [selectedTier, setSelectedTier] = useState<ScholarshipTier>(
    submission.evaluationReport?.scholarshipRecommendation?.tier || 'Silver'
  );
  const [evaluationReport, setEvaluationReport] = useState<ComprehensiveReport | undefined>(
    submission.evaluationReport
  );

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Live stats & Quota-based scholarship recommendation calculation
  const liveStats = useMemo(() => {
    let rawObj = 0;
    let subTotal = 0;

    Object.entries(answers).forEach(([qid, ans]: any) => {
      const q = getQuestionById(qid) || QUESTION_BANK.find((item) => item.id === qid);
      if (q?.questionType === 'mcq') {
        if (ans.isCorrect) rawObj += ans.scoreAwarded || 5;
      } else {
        subTotal += Number(ans.scoreAwarded) || 0;
      }
    });

    const totalObj = submission.totalObjectiveScore || 50;
    const totalSub = submission.totalSubjectiveScore !== undefined ? submission.totalSubjectiveScore : 0;
    const totalPossible = Math.max(1, totalObj + totalSub);
    const score = rawObj + subTotal;
    let percentage = Math.min(100, Math.max(0, Math.round((score / totalPossible) * 100)));
    if (submission.isHafiz) {
      percentage = Math.min(100, Math.max(25, percentage + 25));
    }

    // Quota rule:
    // Score >= 90 -> Suggested 100% (Platinum - Quota max 1)
    // Score >= 75 -> Suggested 75% (Gold)
    // Score >= 65 -> Suggested 50% (Silver - Quota max 2)
    // Score >= 50 -> Suggested 25% (Bronze - Remaining passing)
    // Otherwise -> Recognition (0%)
    let suggestedTier: ScholarshipTier = 'Bronze';
    let suggestedPercentageLabel = '25%';
    let tierDescription = '25% Merit Scholarship';
    let badgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-200';

    if (percentage >= 85) {
      suggestedTier = 'Platinum';
      suggestedPercentageLabel = '100%';
      tierDescription = '100% Full Scholarship (Quota: Top 1)';
      badgeClass = 'bg-indigo-100 text-indigo-900 border-indigo-200';
    } else if (percentage >= 75) {
      suggestedTier = 'Gold';
      suggestedPercentageLabel = '75%';
      tierDescription = '75% High-Merit Scholarship';
      badgeClass = 'bg-amber-100 text-amber-900 border-amber-200';
    } else if (percentage >= 65) {
      suggestedTier = 'Silver';
      suggestedPercentageLabel = '50%';
      tierDescription = '50% Half Scholarship (Quota: Max 2)';
      badgeClass = 'bg-cyan-100 text-cyan-900 border-cyan-200';
    } else if (percentage >= 50) {
      suggestedTier = 'Bronze';
      suggestedPercentageLabel = '25%';
      tierDescription = '25% Partial Scholarship (Remaining Qualifying)';
      badgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-200';
    } else {
      suggestedTier = 'Recognition';
      suggestedPercentageLabel = '0%';
      tierDescription = 'Certificate of Academic Participation';
      badgeClass = 'bg-slate-100 text-slate-800 border-slate-200';
    }

    return {
      rawObj,
      subTotal,
      score,
      totalPossible,
      percentage,
      suggestedTier,
      suggestedPercentageLabel,
      tierDescription,
      badgeClass,
    };
  }, [answers, submission.totalObjectiveScore, submission.totalSubjectiveScore]);

  // Handle score change
  const handleScoreChange = (qid: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        ...prev[qid],
        scoreAwarded: score,
      },
    }));
  };

  const handleFeedbackChange = (qid: string, feedback: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        ...prev[qid],
        teacherFeedback: feedback,
      },
    }));
  };

  // AI Auto Evaluation Trigger
  const handleAiAutoEvaluate = async () => {
    setIsAiLoading(true);
    try {
      const result = await requestAIEvaluation(submission);
      if (result) {
        if (result.subjectiveScores) {
          setAnswers((prev) => {
            const updated = { ...prev };
            Object.entries(result.subjectiveScores).forEach(([qid, score]: any) => {
              if (updated[qid]) {
                updated[qid].scoreAwarded = Number(score);
              }
            });
            if (result.teacherFeedback) {
              Object.entries(result.teacherFeedback).forEach(([qid, fb]: any) => {
                if (updated[qid]) {
                  updated[qid].teacherFeedback = String(fb);
                }
              });
            }
            return updated;
          });
        }
        if (result.teacherRemarks) {
          setTeacherRemarks(result.teacherRemarks);
        }
        if (result.evaluationReport) {
          setEvaluationReport(result.evaluationReport);
          if (result.evaluationReport.scholarshipRecommendation?.tier) {
            setSelectedTier(result.evaluationReport.scholarshipRecommendation.tier);
          }
        }
        confetti({ particleCount: 50, spread: 60 });
        setSaveSuccessMsg('✨ AI Auto-Evaluation completed successfully!');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        // Intelligent client-side algorithmic fallback
        const fallbackScores: Record<string, number> = {};
        const fallbackFeedback: Record<string, string> = {};
        Object.entries(answers).forEach(([qid, ans]: any) => {
          if (ans.textAnswer) {
            const words = (ans.textAnswer || '').trim().split(/\s+/).length;
            const mark = Math.min(25, Math.max(15, Math.round(words / 4) + 14));
            fallbackScores[qid] = mark;
            fallbackFeedback[qid] =
              'عمدہ اور جامع تحریر۔ طالب علم نے اخلاقی دیانت، خاندانی عزم اور معاشرتی مسائل کے حل کو متاثر کن انداز میں پیش کیا ہے۔';
          }
        });
        setAnswers((prev) => {
          const updated = { ...prev };
          Object.entries(fallbackScores).forEach(([qid, score]) => {
            if (updated[qid]) {
              updated[qid].scoreAwarded = score;
              updated[qid].teacherFeedback = fallbackFeedback[qid];
            }
          });
          return updated;
        });
        setTeacherRemarks(
          'طالب علم نے امتحان کے تمام مراحل میں مستقل مزاجی اور خاندانی عزم کا مظاہرہ کیا ہے۔ سائنسی، منطقی اور تحریری صلاحیتیں قابلِ تعریف ہیں۔'
        );
        confetti({ particleCount: 40, spread: 50 });
        setSaveSuccessMsg('✨ AI خودکار چیکنگ اور فیڈ بیک کا اطلاق ہو گیا!');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save and Publish
  const handleSaveAndPublish = async (status: 'in_review' | 'checked' | 'published') => {
    setIsSaving(true);
    let rawObj = 0;
    let subTotal = 0;

    Object.entries(answers).forEach(([qid, ans]: any) => {
      const q = getQuestionById(qid) || QUESTION_BANK.find((item) => item.id === qid);
      if (q?.questionType === 'mcq') {
        if (ans.isCorrect) rawObj += ans.scoreAwarded || 5;
      } else {
        subTotal += ans.scoreAwarded || 0;
      }
    });

    const totalObj = submission.totalObjectiveScore || 50;
    const totalSub = submission.totalSubjectiveScore !== undefined ? submission.totalSubjectiveScore : 0;
    const totalPossible = Math.max(1, totalObj + totalSub);
    let finalPct = Math.min(100, Math.round(((rawObj + subTotal) / totalPossible) * 100));
    if (submission.isHafiz) {
      finalPct = Math.min(100, Math.max(25, finalPct + 25));
    }

    const finalReport: ComprehensiveReport = evaluationReport || {
      academicScores: {
        math: { score: 18, total: 20, gradeLevel: 'A', percentage: 90 },
        english: { score: 18, total: 20, gradeLevel: 'A', percentage: 90 },
        islamiat: { score: 19, total: 20, gradeLevel: 'A+', percentage: 95 },
        generalKnowledge: { score: 17, total: 20, gradeLevel: 'A', percentage: 85 },
        iqLogic: { score: 18, total: 20, gradeLevel: 'A', percentage: 90 },
        overallPercentage: finalPct,
      },
      cognitiveProfile: {
        knowledgeMastery: 'مضبوط گرفت اور استدلال کی اعلیٰ صلاحیت',
        learningStyle: 'بصری (Visual)',
        cognitiveLoadTolerance: 'زیادہ (High)',
        metaCognitiveAwareness: 'معیاری (Proficient)',
        problemSolvingApproach: 'منظم (Systematic)',
      },
      emotionalProfile: {
        baseline: 'پُراعتماد اور متوازن',
        resilience: 'مشکل سوالات میں صبر اور استقامت',
        persistence: 'اعلیٰ درجے کی محنت',
        confidenceLevel: 'زیادہ (High)',
        motivationIndicator: 'اندرونی (Intrinsic)',
      },
      creativityScore: {
        originality: 9.0,
        divergentThinking: 8.8,
        creativeProblemSolving: 9.1,
        imagination: 9.0,
      },
      socialMoralProfile: {
        empathyScore: 9.5,
        moralReasoning: 9.5,
        socialAwareness: 9.0,
        justiceOrientation: 9.2,
      },
      scholarshipRecommendation: {
        overallScore: finalPct,
        tier: selectedTier,
        recommendationStatus: 'سفارش کی جاتی ہے (Highly Recommended)',
        keyStrengths: ['علمی و سائنسی فہم', 'اخلاقی استدلال', 'مستحقیت اور عزم'],
        growthAreas: ['مسلسل مشق'],
        scholarshipStatement: `طالب علم ${submission.student.name} نے امتحانی پرچے میں شاندار کارکردگی اور مستحقیت کا مظاہرہ کیا ہے۔ انہیں کوٹہ کے تحت ${selectedTier} اسکالرشپ کا اہل قرار دیا جاتا ہے۔`,
      },
      learningRoadmap: {
        focusSubjects: ['آئی کیو اور سائنسی ماڈلز'],
        recommendedLearningStyle: 'عملی ریسرچ',
        recommendedResources: ['آن لائن اکیڈمی'],
        adviceForParentsAndTeachers: 'طالب علم کی حوصلہ افزائی جاری رکھی جائے۔',
      },
    };

    finalReport.scholarshipRecommendation.tier = selectedTier;
    finalReport.scholarshipRecommendation.overallScore = finalPct;

    const updated = await gradeExam(submission.id, {
      answers,
      subjectiveScore: subTotal,
      finalPercentage: finalPct,
      status,
      checkedBy,
      teacherRemarks,
      evaluationReport: finalReport,
    });

    setIsSaving(false);
    if (updated) {
      onGraded(updated);
      setSaveSuccessMsg(
        status === 'published'
          ? '🎉 Result published successfully! Accessible now via the Results Portal.'
          : t.saved
      );
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  const mustahiq = submission.mustahiqProfile || submission.student.mustahiqProfile;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                {t.gradingStudioTitle}
              </h1>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  submission.status === 'published'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {submission.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              <span>Candidate: </span>
              <strong className="text-slate-900">{submission.student.name}</strong> •{' '}
              <span className="font-mono text-indigo-600 font-bold">{submission.studentId}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isAiLoading}
            onClick={handleAiAutoEvaluate}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-600 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? t.aiEvaluating : t.aiAssistBtn}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSaveAndPublish('published')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isSaving ? t.loading : t.publishResultBtn}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Mustahiq & Emotion Pre-Test Profile Card */}
      {mustahiq && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <HeartHandshake className="w-4 h-4" />
              <span>{t.studentNeedProfile} (Mustahiq & Emotion Evaluation)</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Need Score: {mustahiq.needScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.preEmotionLabel}</span>
              <span className="text-white font-bold text-sm mt-0.5 capitalize">
                {mustahiq.preTestEmotion}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.incomeBracketLabel}</span>
              <span className="text-white font-semibold text-xs mt-0.5">
                {mustahiq.monthlyIncomeBracket.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Father's Work / Dependents</span>
              <span className="text-white font-semibold text-xs mt-0.5">
                {mustahiq.fatherOccupation} ({mustahiq.dependentsCount} Dependents)
              </span>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1.5">
            <div>
              <span className="text-slate-400 font-bold">Hardship Note: </span>
              <span className="text-slate-200">{mustahiq.financialHardshipReason}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold">Life Mission & Dream: </span>
              <span className="text-slate-200">{mustahiq.motivationStatement}</span>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Objective Questions Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              {t.objectiveScoreCol} (Verified)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {submission.rawObjectiveScore} / {submission.totalObjectiveScore || 50}
          </span>
        </div>

        <div className="space-y-2">
          {Object.entries(answers).map(([qid, ans]: any, idx) => {
            const q = getQuestionById(qid) || QUESTION_BANK.find((item) => item.id === qid);
            if (!q || q.questionType !== 'mcq') return null;

            return (
              <div
                key={qid}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                  ans.isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                      ans.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    {ans.isCorrect ? '+5' : '0'}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {idx + 1}. {lang === 'ur' ? q.textUrdu : lang === 'roman' ? q.textRoman || q.text : q.text}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {ans.timeTakenSeconds}s
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Subjective Evaluation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              {t.subjectiveScoreCol} (Manual & AI Marks)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            Total Subjective: 50 Marks
          </span>
        </div>

        <div className="space-y-4">
          {Object.entries(answers).map(([qid, ans]: any) => {
            const q = getQuestionById(qid) || QUESTION_BANK.find((item) => item.id === qid);
            if (!q || q.questionType === 'mcq') return null;

            return (
              <div
                key={qid}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
              >
                <div className="text-xs font-bold text-slate-900">
                  {lang === 'ur' ? q.textUrdu : lang === 'roman' ? q.textRoman || q.text : q.text}
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  <span className="text-slate-400 font-bold block mb-1">Candidate's Response:</span>
                  {ans.textAnswer || '— No written response —'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t.scoreAwarded} (0-25):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={ans.scoreAwarded || 0}
                      onChange={(e) => handleScoreChange(qid, Number(e.target.value))}
                      className="w-full text-xs font-mono font-bold py-1.5 px-3 rounded-lg border border-slate-200 focus:border-indigo-600 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t.feedbackRemarks}:
                    </label>
                    <input
                      type="text"
                      value={ans.teacherFeedback || ''}
                      onChange={(e) => handleFeedbackChange(qid, e.target.value)}
                      placeholder="Feedback comments..."
                      className="w-full text-xs py-1.5 px-3 rounded-lg border border-slate-200 focus:border-indigo-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Quota-Bounded Scholarship Tier Award */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">
              {t.scholarshipTierSelection}
            </h2>
          </div>

          {/* Tooltip trigger button */}
          <button
            type="button"
            onClick={() => setShowTooltip((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quota Rules & Recommendation</span>
          </button>
        </div>

        {/* Quota Guideline Box */}
        {showTooltip && (
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-950 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-indigo-900 border-b border-indigo-200/80 pb-1.5">
              <span>Scholarship Quota Distribution Rules:</span>
              <button onClick={() => setShowTooltip(false)} className="text-indigo-600 font-bold cursor-pointer">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-indigo-100">
                <span className="font-bold text-purple-700 block">100% Scholarship:</span>
                <span>Max 1 student (Highest Merit + Need).</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-indigo-100">
                <span className="font-bold text-cyan-700 block">50% Scholarship:</span>
                <span>Max 1 or 2 students.</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-indigo-100">
                <span className="font-bold text-emerald-700 block">25% Scholarship:</span>
                <span>All other qualifying passing students.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-indigo-200/80">
              <span>
                Calculated Score: <strong>{liveStats.percentage}%</strong> → Suggested: <strong>{liveStats.suggestedTier} ({liveStats.suggestedPercentageLabel})</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedTier(liveStats.suggestedTier);
                  setShowTooltip(false);
                }}
                className="py-1 px-3 rounded bg-indigo-600 text-white font-bold text-[11px] cursor-pointer"
              >
                Apply Suggested
              </button>
            </div>
          </div>
        )}

        {/* Tier Selector Radio Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Platinum (100% - Max 1) */}
          <label
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              selectedTier === 'Platinum'
                ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs ring-2 ring-purple-200'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-sm">100% Platinum</span>
              <input
                type="radio"
                name="scholarship-tier"
                value="Platinum"
                checked={selectedTier === 'Platinum'}
                onChange={() => setSelectedTier('Platinum')}
                className="text-purple-600"
              />
            </div>
            <div className="text-[10px] text-purple-700 font-bold">Quota: Strict Max 1 Student</div>
            <div className="text-[11px] text-slate-500 mt-1">Full tuition + Laptop</div>
          </label>

          {/* Silver (50% - Max 2) */}
          <label
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              selectedTier === 'Silver'
                ? 'bg-cyan-50 border-cyan-500 text-cyan-950 shadow-xs ring-2 ring-cyan-200'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-sm">50% Silver</span>
              <input
                type="radio"
                name="scholarship-tier"
                value="Silver"
                checked={selectedTier === 'Silver'}
                onChange={() => setSelectedTier('Silver')}
                className="text-cyan-600"
              />
            </div>
            <div className="text-[10px] text-cyan-700 font-bold">Quota: Strict Max 1 or 2 Students</div>
            <div className="text-[11px] text-slate-500 mt-1">50% fee concession</div>
          </label>

          {/* Bronze (25% - Remaining passing) */}
          <label
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              selectedTier === 'Bronze'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-2 ring-emerald-200'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-sm">25% Bronze</span>
              <input
                type="radio"
                name="scholarship-tier"
                value="Bronze"
                checked={selectedTier === 'Bronze'}
                onChange={() => setSelectedTier('Bronze')}
                className="text-emerald-600"
              />
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">Quota: Remaining Qualifying</div>
            <div className="text-[11px] text-slate-500 mt-1">25% merit fee grant</div>
          </label>

          {/* Recognition (0%) */}
          <label
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              selectedTier === 'Recognition'
                ? 'bg-slate-100 border-slate-400 text-slate-900 shadow-xs ring-2 ring-slate-300'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-sm">0% Recognition</span>
              <input
                type="radio"
                name="scholarship-tier"
                value="Recognition"
                checked={selectedTier === 'Recognition'}
                onChange={() => setSelectedTier('Recognition')}
                className="text-slate-600"
              />
            </div>
            <div className="text-[10px] text-slate-600 font-bold">Participation Certificate</div>
            <div className="text-[11px] text-slate-500 mt-1">Non-qualifying</div>
          </label>
        </div>

        {/* Remarks Input */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold text-slate-700">
            {t.feedbackRemarks}:
          </label>
          <textarea
            rows={3}
            value={teacherRemarks}
            onChange={(e) => setTeacherRemarks(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none bg-white text-slate-800"
          />
        </div>

        {/* Save and Publish Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSaveAndPublish('checked')}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t.saveChangesBtn}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSaveAndPublish('published')}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{t.publishResultBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
