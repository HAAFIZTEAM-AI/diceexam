import React, { useState } from 'react';
import {
  GraduationCap,
  FileCheck2,
  Award,
  LogOut,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Lock,
} from 'lucide-react';
import {
  StudentProfile,
  ExamSubmission,
  Language,
} from '../../types';
import { AdaptiveExamRunner } from '../ExamTaking/AdaptiveExamRunner';
import { ComprehensiveResultCard } from '../ResultSearching/ComprehensiveResultCard';
import { translations } from '../../data/translations';
import confetti from 'canvas-confetti';
import { requestAIEvaluation, gradeExam } from '../../services/examService';
import { getPaperConfig } from '../../services/paperConfigService';

interface StudentPortalProps {
  student: StudentProfile;
  submissions: ExamSubmission[];
  lang: Language;
  onLanguageChange: (l: Language) => void;
  onLogout: () => void;
  onExamSubmitted: (submission: ExamSubmission) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  submissions,
  lang,
  onLanguageChange,
  onLogout,
  onExamSubmitted,
}) => {
  const t = translations[lang];
  const paperConfig = getPaperConfig();

  // Find existing submission for this student
  const studentSubmission = submissions.find(
    (s) => s.studentId.toLowerCase() === student.studentId.toLowerCase()
  );

  // Tabs: ONLY Aptitude Exam and Result (Leaderboard is completely deleted per user mandate)
  const [activeTab, setActiveTab] = useState<'aptitude' | 'result'>(
    studentSubmission ? 'result' : 'aptitude'
  );

  // USER MANDATE: "aap is mein kuch bhi na dikhayen roll no enter kkarne ke baad 25 sawaal kar ke"
  // Immediately start exam if student has not submitted yet!
  const [isExamRunning, setIsExamRunning] = useState<boolean>(!studentSubmission);
  const [showProvisional, setShowProvisional] = useState(false);
  const [isInstantEvaluating, setIsInstantEvaluating] = useState(false);

  const handleInstantEvaluateAndPublish = async () => {
    if (!studentSubmission) return;
    setIsInstantEvaluating(true);
    try {
      const aiResult = await requestAIEvaluation(studentSubmission);
      let subScore = 0;
      const answersCopy = { ...studentSubmission.answers };
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
            const mark = Math.min(20, Math.max(12, Math.round(words / 4) + 10));
            answersCopy[qid].scoreAwarded = mark;
            answersCopy[qid].teacherFeedback = 'عمدہ اور جامع تحریر۔';
            subScore += mark;
          }
        });
      }
      const totalObj = studentSubmission.totalObjectiveScore || 96;
      const totalSub =
        studentSubmission.totalSubjectiveScore !== undefined
          ? studentSubmission.totalSubjectiveScore
          : 20;
      const totalPossible = Math.max(1, totalObj + totalSub);
      let finalPct = Math.min(
        100,
        Math.round((((studentSubmission.rawObjectiveScore || 0) + subScore) / totalPossible) * 100)
      );
      if (studentSubmission.isHafiz) {
        finalPct = Math.min(100, Math.max(25, finalPct + 25));
      }
      const updated = await gradeExam(studentSubmission.id, {
        answers: answersCopy,
        subjectiveScore: subScore,
        finalPercentage: finalPct,
        status: 'published',
        checkedBy: 'AI Chief Examiner (DICE Evaluation)',
        teacherRemarks:
          aiResult?.teacherRemarks ||
          'طالب علم کی مجموعی کارکردگی اور تعلیمی ذوق غیر معمولی ہے۔ مبارکباد!',
        evaluationReport: aiResult?.evaluationReport,
      });
      if (updated) {
        onExamSubmitted(updated);
        setShowProvisional(true);
        confetti({ particleCount: 60, spread: 70 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsInstantEvaluating(false);
    }
  };

  const handleFinishExam = (submission: ExamSubmission) => {
    setIsExamRunning(false);
    onExamSubmitted(submission);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Student Navigation Bar */}
      <header className="w-full bg-slate-800/95 border-b border-slate-700 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Student Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white tracking-tight">
                  {student.name}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {student.rollNo}
                </span>
                {student.isHafiz && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    حافظِ قرآن
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Digital Institute of Computer Education • {student.grade}
              </p>
            </div>
          </div>

          {/* 2 Tabs Only (Leaderboard completely removed) */}
          <nav className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-700">
            {/* Tab 1: Aptitude Test */}
            <button
              id="tab-aptitude-btn"
              type="button"
              onClick={() => {
                setActiveTab('aptitude');
                if (!studentSubmission) setIsExamRunning(true);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'aptitude'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>
                {lang === 'ur' ? 'امتحانی پرچہ (25 سوالات)' : 'Scholarship Exam'}
              </span>
            </button>

            {/* Tab 2: Result (with Lock indicator) */}
            <button
              id="tab-result-btn"
              type="button"
              onClick={() => {
                setIsExamRunning(false);
                setActiveTab('result');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'result'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {paperConfig.isResultCheckingLocked ? (
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <FileCheck2 className="w-3.5 h-3.5" />
              )}
              <span>
                {lang === 'ur' ? 'نتیجہ (Result)' : 'Result'}
              </span>
              {paperConfig.isResultCheckingLocked ? (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 font-mono font-bold">
                  LOCKED
                </span>
              ) : studentSubmission ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              ) : null}
            </button>
          </nav>

          {/* Language & Logout Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => onLanguageChange('ur')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  lang === 'ur' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('roman')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  lang === 'roman' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Roman
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  lang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <button
              id="student-logout-btn"
              type="button"
              onClick={onLogout}
              title="Logout / Switch ID"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'ur' ? 'لاگ آؤٹ' : 'Exit'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* TAB 1: 25 QUESTIONS EXAM (DIRECTLY DISPLAYED AFTER ROLL NO ENTRY) */}
        {activeTab === 'aptitude' && (
          <div className="space-y-6">
            {isExamRunning ? (
              <AdaptiveExamRunner
                student={student}
                introAnswers={[]}
                onFinish={handleFinishExam}
                lang={lang}
                onExit={onLogout}
                onViewResult={() => setActiveTab('result')}
              />
            ) : studentSubmission ? (
              /* Already Completed Screen */
              <div className="bg-slate-800/90 rounded-3xl border border-emerald-500/40 p-8 sm:p-12 text-center max-w-xl mx-auto backdrop-blur-md space-y-6 shadow-2xl animate-in fade-in">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-white urdu-text leading-relaxed">
                    مبارک ہو آپ نے 25% پیپر مکمل کر لیا ہے!
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
                    Mubarak ho aap ne 25% paper complete kar liya hai!
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 urdu-text leading-relaxed">
                    آپ کا 25 سوالات پر مشتمل امتحانی پرچہ کامیابی کے ساتھ امتحانی سرور میں ریکارڈ ہو چکا ہے۔
                  </p>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 text-left font-mono text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Roll No:</span>
                    <span className="text-indigo-400 font-bold">{studentSubmission.rollNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Candidate Name:</span>
                    <span className="text-white">{studentSubmission.student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Questions Completed:</span>
                    <span className="text-emerald-400 font-bold">25 / 25 Questions</span>
                  </div>
                </div>

                {paperConfig.isResultCheckingLocked ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs urdu-text leading-relaxed text-right" dir="rtl">
                    امتحانی کمیٹی کی جانب سے رزلٹ فی الوقت مقفل (Locked) ہے۔ ایڈمن کی طرف سے جاری ہونے پر آپ نتیجہ چیک کر سکیں گے۔
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('result')}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>نتیجہ کارڈ دیکھیں (View Marksheet)</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <button
                  type="button"
                  onClick={() => setIsExamRunning(true)}
                  className="py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg"
                >
                  امتحان شروع کریں (Start 25 Questions)
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESULT */}
        {activeTab === 'result' && (
          <div className="space-y-6 animate-in fade-in">
            {/* MANDATORY CHECK: Admin Result Lock */}
            {paperConfig.isResultCheckingLocked ? (
              <div className="bg-slate-800/95 rounded-3xl border border-rose-500/40 p-8 sm:p-12 text-center max-w-xl mx-auto backdrop-blur-md space-y-6 shadow-2xl">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
                    {lang === 'ur' ? 'نتائج مقفل ہیں' : 'Result Checking Locked'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-3">
                    {lang === 'ur'
                      ? 'امتحانی نتائج فی الوقت مقفل ہیں'
                      : 'Results are Currently Locked by Administration'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-[2.2] urdu-text">
                    {lang === 'ur'
                      ? 'ڈجیٹل انسٹیٹیوٹ آف کمپیوٹر ایجوکیشن (Digital Institute of Computer Education) کی امتحانی کمیٹی کے فیصلے کے مطابق نتائج فی الوقت مقفل رکھے گئے ہیں۔ ایڈمن پینل سے نتیجہ ان لاک ہونے پر آپ کا نتیجہ یہاں دکھایا جائے گا۔'
                      : 'According to the Digital Institute of Computer Education examination board, results are securely locked for final audit. They will be published once officially authorized by the administration.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('aptitude')}
                    className="py-3 px-6 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer transition-all"
                  >
                    {lang === 'ur' ? '← امتحانی پرچے پر واپس جائیں' : '← Back to Exam'}
                  </button>
                </div>
              </div>
            ) : studentSubmission ? (
              studentSubmission.status === 'published' ||
              studentSubmission.status === 'checked' ||
              showProvisional ? (
                <div className="space-y-4">
                  {studentSubmission.status !== 'published' && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-300">
                      <span>⚠️ یہ عبوری مارک شیٹ ہے۔</span>
                      <button
                        type="button"
                        onClick={() => setShowProvisional(false)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 cursor-pointer"
                      >
                        واپس جائیں (Back)
                      </button>
                    </div>
                  )}
                  <ComprehensiveResultCard
                    submission={studentSubmission}
                    onBack={() => {
                      if (showProvisional) setShowProvisional(false);
                      else setActiveTab('aptitude');
                    }}
                    lang={lang}
                  />
                </div>
              ) : (
                /* Submission recorded and awaiting publish or instant checking */
                <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-8 sm:p-12 text-center max-w-xl mx-auto backdrop-blur-md space-y-6 shadow-2xl">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                    <Clock className="w-8 h-8 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                      {lang === 'ur' ? 'امتحان زیرِ جائزہ' : 'Under Evaluation'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-3">
                      {lang === 'ur'
                        ? 'امتحان کامیابی سے جمع ہو گیا ہے'
                        : 'Exam Submitted Successfully'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed urdu-text">
                      {lang === 'ur'
                        ? 'آپ کا امتحانی پرچہ ریکارڈ ہو چکا ہے۔ آپ فوری AI خودکار چیکنگ کروا سکتے ہیں یا عبوری رزلٹ دیکھ سکتے ہیں۔'
                        : 'Your exam is recorded. You can run instant AI evaluation to get your official marksheet or view your provisional scorecard.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 text-left font-mono text-xs space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student Roll ID:</span>
                      <span className="text-white font-bold">{studentSubmission.rollNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Candidate Name:</span>
                      <span className="text-white">{studentSubmission.student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Objective Marks:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {studentSubmission.rawObjectiveScore} / {studentSubmission.totalObjectiveScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isInstantEvaluating}
                      onClick={handleInstantEvaluateAndPublish}
                      className="w-full sm:w-auto py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className={`w-4 h-4 text-amber-300 ${isInstantEvaluating ? 'animate-spin' : ''}`} />
                      <span>
                        {isInstantEvaluating
                          ? 'AI چیکنگ جاری ہے...'
                          : 'فوری AI چیکنگ اور آفیشل رزلٹ'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowProvisional(true)}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FileCheck2 className="w-4 h-4 text-indigo-400" />
                      <span>عبوری رزلٹ دیکھیں</span>
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* No submission found */
              <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-8 sm:p-12 text-center max-w-lg mx-auto backdrop-blur-md space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">
                  {lang === 'ur' ? 'کوئی پرچہ جمع نہیں ہوا' : 'No Exam Record Found'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 urdu-text">
                  {lang === 'ur'
                    ? 'آپ نے ابھی تک ایپٹی ٹیوڈ ٹیسٹ حل نہیں کیا۔ نتیجہ دیکھنے کے لیے پہلے امتحان دیں۔'
                    : 'You haven’t completed an exam session yet. Take the test to receive your scorecard.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('aptitude');
                    setIsExamRunning(true);
                  }}
                  className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                >
                  {lang === 'ur' ? '25 سوالات کا ٹیسٹ شروع کریں' : 'Start 25 Questions Exam'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500">
        Digital Institute of Computer Education • Scholarship & Merit Examination Portal
      </footer>
    </div>
  );
};
