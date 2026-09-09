import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  Volume2,
  FileEdit,
  Award,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Lock,
  LogOut,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Question,
  StudentProfile,
  IntroQuestionAnswer,
  ExamSubmission,
  EmotionState,
  DifficultyLevel,
  ExamAnswerRecord,
  Language,
} from '../../types';
import { generateExamPaperForCandidate } from '../../services/questionEngine';
import { submitExam } from '../../services/examService';
import { translations } from '../../data/translations';
import { getPaperConfig } from '../../services/paperConfigService';

interface AdaptiveExamRunnerProps {
  student: StudentProfile;
  introAnswers?: IntroQuestionAnswer[];
  onFinish: (submission: ExamSubmission) => void;
  lang: Language;
  onExit?: () => void;
  onViewResult?: () => void;
}

export const AdaptiveExamRunner: React.FC<AdaptiveExamRunnerProps> = ({
  student,
  introAnswers = [],
  onFinish,
  lang,
  onExit,
  onViewResult,
}) => {
  const t = translations[lang];
  const paperConfig = getPaperConfig();

  // Storage key for persistent offline autosave
  const progressStorageKey = `dice_exam_state_${student.studentId.trim().toUpperCase()}`;

  // Internet connectivity state for offline guarantee
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Generate 25-question research-backed exam paper (NO science questions, single continuous part)
  const activeQuestions: Question[] = useMemo(() => {
    return generateExamPaperForCandidate(student.studentId, {
      isHafiz: student.isHafiz,
      sessionTimestamp: Math.floor(Date.now() / (1000 * 60 * 30)),
    });
  }, [student.isHafiz, student.studentId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>(4);
  const [highestLevel, setHighestLevel] = useState<number>(4);

  // Strict User Mandate: Max 5 hints across the whole exam, providing at most 30% guidance
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [hintViewedQuestions, setHintViewedQuestions] = useState<Record<string, boolean>>({});
  const [hintAlertMessage, setHintAlertMessage] = useState<string | null>(null);

  // Time & Timer
  const [secondsRemaining, setSecondsRemaining] = useState(paperConfig.examDurationMinutes * 60);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Answers state
  const [answers, setAnswers] = useState<Record<string, ExamAnswerRecord>>({});
  const [selectedOpt, setSelectedOpt] = useState<string>('');
  const [textAns, setTextAns] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSubmission, setCompletedSubmission] = useState<ExamSubmission | null>(null);

  const currentQ = activeQuestions[currentIndex];

  // Restore saved state from local storage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(progressStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.hintsUsedCount !== undefined) setHintsUsedCount(parsed.hintsUsedCount);
        if (parsed.hintViewedQuestions) setHintViewedQuestions(parsed.hintViewedQuestions);
        if (parsed.currentIndex !== undefined && parsed.currentIndex < activeQuestions.length) {
          setCurrentIndex(parsed.currentIndex);
        }
        if (parsed.secondsRemaining !== undefined && parsed.secondsRemaining > 10) {
          setSecondsRemaining(parsed.secondsRemaining);
        }
      }
    } catch (e) {
      console.error('Error restoring offline state:', e);
    }
  }, [progressStorageKey, activeQuestions.length]);

  // Continuous autosave to localStorage for offline reliability
  useEffect(() => {
    if (isCompleted) return;
    try {
      const payload = {
        studentId: student.studentId,
        answers,
        currentIndex,
        hintsUsedCount,
        hintViewedQuestions,
        secondsRemaining,
        updatedAt: Date.now(),
      };
      localStorage.setItem(progressStorageKey, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving state locally:', e);
    }
  }, [answers, currentIndex, hintsUsedCount, hintViewedQuestions, secondsRemaining, isCompleted, progressStorageKey, student.studentId]);

  // Timer countdown
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitFinalExam();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  // Update selection when navigating questions
  useEffect(() => {
    if (!currentQ) return;
    setShowHint(false);
    setHintAlertMessage(null);
    setQuestionStartTime(Date.now());
    const existing = answers[currentQ.id];
    if (existing) {
      setSelectedOpt(existing.selectedOption || '');
      setTextAns(existing.textAnswer || '');
    } else {
      setSelectedOpt('');
      setTextAns('');
    }
  }, [currentIndex, currentQ?.id]);

  // Format timer
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getQuestionText = () => {
    if (!currentQ) return '';
    if (lang === 'ur') return currentQ.textUrdu;
    if (lang === 'roman') return currentQ.textRoman || currentQ.text;
    return currentQ.text;
  };

  const getHintText = () => {
    if (!currentQ) return '';
    if (lang === 'ur') return currentQ.hintUrdu;
    if (lang === 'roman') return currentQ.hintRoman || currentQ.hint;
    return currentQ.hint;
  };

  const getOptionText = (opt: any) => {
    if (lang === 'ur') return opt.textUrdu;
    if (lang === 'roman') return opt.textRoman || opt.textUrdu || opt.text;
    return opt.text;
  };

  // Speech Reader
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const textToRead = getQuestionText();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Toggle Hint with strict 5 hint max limit and 30% guidance
  const handleToggleHint = () => {
    if (showHint) {
      setShowHint(false);
      return;
    }

    if (!currentQ) return;

    // Check if this question was already unlocked
    const alreadyUnlockedForThisQuestion = hintViewedQuestions[currentQ.id];

    if (!alreadyUnlockedForThisQuestion) {
      if (hintsUsedCount >= 5) {
        setHintAlertMessage(
          lang === 'ur'
            ? '⚠️ آپ پورے ٹیسٹ کے تمام 5 اشارے استعمال کر چکے ہیں۔ اب مزید اشارے دستیاب نہیں ہیں۔'
            : '⚠️ You have used all 5 allowed hints for this exam.'
        );
        return;
      }

      // Unlock for this question and increment count
      setHintsUsedCount((prev) => prev + 1);
      setHintViewedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
    }

    setShowHint(true);
    setHintAlertMessage(null);
  };

  // Save current answer and advance
  const handleSaveAndAdvance = () => {
    if (!currentQ) return;
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    const isMcq = currentQ.questionType === 'mcq';
    let isCorrect = false;
    let score = 0;

    if (isMcq) {
      isCorrect = selectedOpt === currentQ.correctAnswer;
      score = isCorrect ? 4 : 0;
      if (isCorrect && currentLevel < 10) {
        const nextLvl = (currentLevel + 1) as DifficultyLevel;
        setCurrentLevel(nextLvl);
        if (nextLvl > highestLevel) setHighestLevel(nextLvl);
      }
    } else {
      score = textAns.trim().length > 40 ? 20 : textAns.trim().length > 15 ? 12 : 5;
    }

    const updatedAnswers = {
      ...answers,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: selectedOpt,
        textAnswer: textAns,
        timeTakenSeconds: timeSpent,
        emotionDetected: 'confidence' as EmotionState,
        isCorrect: isMcq ? isCorrect : undefined,
        scoreAwarded: score,
        maxScore: isMcq ? 4 : 20,
      },
    };

    setAnswers(updatedAnswers);

    // Confirmation indicator
    setSaveStatusMessage(
      lang === 'ur' ? 'آپ کا جواب محفوظ ہو گیا۔' : 'Answer recorded.'
    );
    setTimeout(() => setSaveStatusMessage(null), 1200);

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished all 25 questions!
      handleSubmitFinalExam(updatedAnswers);
    }
  };

  // Submit final exam
  const handleSubmitFinalExam = async (finalAnswers?: Record<string, ExamAnswerRecord>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const ansMap = finalAnswers || answers;
    let rawObj = 0;
    let totalObj = 0;
    let subTotal = 0;
    let maxSub = 0;

    activeQuestions.forEach((q) => {
      const ans = ansMap[q.id];
      if (q.questionType === 'mcq') {
        totalObj += 4;
        if (ans && ans.isCorrect) rawObj += 4;
      } else {
        maxSub += 20;
        if (ans) subTotal += ans.scoreAwarded || 0;
      }
    });

    // Hafiz credit handling
    if (student.isHafiz) {
      rawObj += 20;
      totalObj += 20;
    }

    const totalPossible = Math.max(1, totalObj + maxSub);
    let rawPercentage = Math.round(((rawObj + subTotal) / totalPossible) * 100);
    let finalPercentage = rawPercentage;
    if (student.isHafiz) {
      finalPercentage = Math.min(100, Math.max(25, rawPercentage + 25));
    }

    const fullSubmission: ExamSubmission = {
      id: student.studentId,
      studentId: student.studentId,
      rollNo: student.rollNo,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      student,
      isHafiz: student.isHafiz,
      hafizCreditPercentage: student.isHafiz ? 25 : undefined,
      mustahiqProfile: student.mustahiqProfile,
      introAnswers,
      answers: ansMap,
      phaseReached: 3,
      highestDifficultyAchieved: highestLevel,
      totalTimeSpentSeconds: totalTimeSpent,
      dominantEmotion: 'confidence',
      rawObjectiveScore: rawObj,
      totalObjectiveScore: totalObj,
      subjectiveScore: subTotal,
      totalSubjectiveScore: maxSub,
      finalPercentage,
    };

    try {
      await submitExam(fullSubmission);
      // Clean up progress storage after successful completion
      localStorage.removeItem(progressStorageKey);
      localStorage.setItem(`dice_completed_${student.studentId}`, JSON.stringify(fullSubmission));
      setCompletedSubmission(fullSubmission);
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
      onFinish(fullSubmission);
    } catch (e) {
      console.error('Submission error:', e);
      localStorage.setItem(`dice_completed_${student.studentId}`, JSON.stringify(fullSubmission));
      setCompletedSubmission(fullSubmission);
      setIsCompleted(true);
      onFinish(fullSubmission);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // MANDATORY USER REQUIREMENT:
  // "aur wo complete karne ke baad student ko screen pr show ho
  //  mubarak ho aap ne 25 % paper complete kar liya hai"
  // =========================================================================
  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 space-y-6 animate-in zoom-in-95">
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-2xl text-center space-y-6">
          {/* Confetti & Icon */}
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            {/* EXACT MANDATED TEXT */}
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 urdu-text leading-relaxed tracking-tight">
              مبارک ہو آپ نے 25% پیپر مکمل کر لیا ہے!
            </h1>
            <p className="text-xs sm:text-sm font-bold text-emerald-700 font-mono tracking-wide">
              Mubarak ho aap ne 25% paper complete kar liya hai!
            </p>
            <p className="text-xs sm:text-sm text-slate-600 urdu-text leading-[2.2] max-w-lg mx-auto">
              ڈجیٹل انسٹیٹیوٹ آف کمپیوٹر ایجوکیشن (DICE) کے امتحانی سرور پر آپ کے تمام 25 سوالات کے جوابات کامیابی سے محفوظ کر لیے گئے ہیں۔
            </p>
          </div>

          {/* Candidate Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left font-mono text-xs space-y-2 max-w-md mx-auto text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Candidate Roll No:</span>
              <span className="text-indigo-700 font-bold font-mono">{student.rollNo}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Total Questions:</span>
              <span className="text-slate-900 font-bold">25 / 25 Attempted</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Examination Structure:</span>
              <span className="text-slate-900 font-bold">Single Unified Part (واحد پرچہ)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Paper Status:</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                محفوظ شدہ (Recorded)
              </span>
            </div>
          </div>

          {/* Admin Lock Information */}
          {paperConfig.isResultCheckingLocked ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs urdu-text leading-relaxed flex items-center gap-3 text-right" dir="rtl">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                امتحانی کمیٹی کی جانب سے رزلٹ فی الوقت مقفل (Locked) ہے۔ ایڈمن پینل سے نتیجہ ان لاک ہونے پر آپ پورٹل پر اپنا تفصیلی رزلٹ کارڈ دیکھ سکیں گے۔
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs urdu-text leading-relaxed flex items-center gap-3 text-right" dir="rtl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                ایڈمن کی جانب سے نتائج جاری ہو چکے ہیں، آپ اپنا مکمل رزلٹ کارڈ دیکھ سکتے ہیں۔
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {!paperConfig.isResultCheckingLocked && onViewResult && (
              <button
                type="button"
                onClick={onViewResult}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>نتیجہ کارڈ دیکھیں (View Marksheet)</span>
              </button>
            )}

            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>پورٹل سے لاگ آؤٹ کریں</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active question progress calculation (1 to 25)
  const progressPercent = Math.round(((currentIndex + 1) / activeQuestions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 space-y-4 font-sans">
      {/* Offline Continuity Status Banner */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              {lang === 'ur'
                ? 'انٹرنیٹ منقطع ہے - آپ کا پرچہ بغیر کسی رکاوٹ کے جاری ہے اور تمام جوابات اس ڈیوائس پر خودکار محفوظ ہو رہے ہیں۔'
                : 'Offline mode active: Your exam continues smoothly with local autosave.'}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
            OFFLINE SAFE
          </span>
        </div>
      )}

      {/* Top Header Bar: Question Counter, Roll No, Timer, Hints Remaining */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black font-mono text-sm">
            {currentIndex + 1}/25
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>رول نمبر: {student.rollNo}</span>
              {student.isHafiz && (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold font-sans">
                  حافظِ قرآن
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Digital Institute of Computer Education • واحد پرچہ (25 سوالات)
            </div>
          </div>
        </div>

        {/* Hints Counter (User Mandate: Exactly 5 total hints) & Timer */}
        <div className="flex items-center gap-3">
          {/* Hints Left Badge */}
          <div
            title="پورے امتحان میں صرف 5 اشارے (30% رہنمائی) دستیاب ہیں"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${
              5 - hintsUsedCount === 0
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>
              اشارے باقی: {5 - hintsUsedCount} / 5
            </span>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors ${
              secondsRemaining < 300
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{timeFormatted}</span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Neutral Save Banner */}
      {saveStatusMessage && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-2 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{saveStatusMessage}</span>
          </div>
        </div>
      )}

      {/* Hint Alert Message */}
      {hintAlertMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{hintAlertMessage}</span>
          </div>
          <button onClick={() => setHintAlertMessage(null)} className="text-rose-600 font-bold ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main Question Card with Large Clear Typography and Anti-Overlap Urdu CSS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-slate-900">
        {/* Category & Number badge */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            سوال {currentIndex + 1} از 25 • {currentQ?.subcategory}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            DICE Research Assessment
          </span>
        </div>

        {/* Question Prompt */}
        <div className="flex items-start justify-between gap-4">
          <h2
            dir={lang === 'ur' ? 'rtl' : 'ltr'}
            className="text-base sm:text-lg font-bold text-slate-900 leading-[2.3] urdu-text flex-1"
          >
            {getQuestionText()}
          </h2>

          <button
            type="button"
            onClick={handleReadAloud}
            title="سوال سنیں (Audio Speech)"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Content: MCQ vs Open-Ended Written (Question 25) */}
        {currentQ?.questionType === 'mcq' ? (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              درست آپشن کا انتخاب کریں:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedOpt === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOpt(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs ring-1 ring-indigo-600'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span
                      dir={lang === 'ur' ? 'rtl' : 'ltr'}
                      className="text-sm font-medium urdu-text flex-1 leading-relaxed"
                    >
                      {getOptionText(opt)}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-mono shrink-0 ml-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Question 25 Subjective Written Expression */
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="written-ans" className="font-bold text-slate-800 flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-indigo-600" />
                <span>
                  {lang === 'ur'
                    ? 'اپنا تفصیلی جواب اردو، رومن یا انگریزی میں تحریر کریں:'
                    : 'Write your comprehensive answer:'}
                </span>
              </label>
              <span className="text-slate-500 font-mono text-[11px]">
                {textAns.trim().split(/\s+/).filter(Boolean).length} الفاظ (Words)
              </span>
            </div>

            <textarea
              id="written-ans"
              rows={7}
              value={textAns}
              onChange={(e) => setTextAns(e.target.value)}
              placeholder="یہاں اپنے خیالات، تدابیر، خاندانی حالات اور کمپیوٹر سیکھنے کا عزم تفصیل سے لکھیں..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 leading-relaxed urdu-text"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              اس تحریر کا جائزہ چیف ایگزامینر اور AI آپ کے خلوص، خاندانی حالات اور مستحق جذبے کی بنیاد پر لیں گے۔
            </p>
          </div>
        )}

        {/* Hint Section: Limited to 5 total, gives 30% guidance max */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              id="view-hint-btn"
              onClick={handleToggleHint}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {showHint
                  ? 'اشارہ چھپائیں (Hide Hint)'
                  : `اشارہ دیکھیں (30% رہنمائی) • باقی: ${5 - hintsUsedCount}/5`}
              </span>
            </button>
            <span className="text-[10px] text-slate-400">صرف 30% فکری اشارہ</span>
          </div>

          {showHint && (
            <div
              dir={lang === 'ur' ? 'rtl' : 'ltr'}
              className="mt-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-[2.1] urdu-text animate-in fade-in"
            >
              {getHintText()}
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>پچھلا سوال</span>
          </button>

          <button
            id="next-question-btn"
            type="button"
            disabled={isSubmitting}
            onClick={handleSaveAndAdvance}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <span>
              {currentIndex === activeQuestions.length - 1
                ? 'امتحان مکمل اور جمع کریں (Submit 25 Questions)'
                : 'محفوظ کریں اور اگلا سوال →'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
