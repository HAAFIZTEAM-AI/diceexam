import React, { useState } from 'react';
import {
  Sparkles,
  KeyRound,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Smile,
  Compass,
} from 'lucide-react';
import { StudentProfile, Language, MustahiqProfile } from '../../types';
import { translations } from '../../data/translations';

interface StudentOnboardingProps {
  onStart: (student: StudentProfile, isExpressMode: boolean) => void;
  lang: Language;
}

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ onStart, lang }) => {
  const t = translations[lang];

  // Stage 1: ID Gate -> Stage 2: Mustahiq & Emotion Assessment
  const [stage, setStage] = useState<'id_entry' | 'mustahiq_assessment'>('id_entry');
  const [uniqueId, setUniqueId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isExpressMode, setIsExpressMode] = useState(true);
  const [idError, setIdError] = useState('');

  // Mustahiq Profile State
  const [incomeBracket, setIncomeBracket] = useState('under_25k');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [dependentsCount, setDependentsCount] = useState<number>(4);
  const [hardshipReason, setHardshipReason] = useState('');
  const [motivationStatement, setMotivationStatement] = useState('');
  const [preTestEmotion, setPreTestEmotion] = useState<'hopeful' | 'anxious' | 'determined' | 'pressured' | 'confident'>('hopeful');

  // Handle Unique ID verification / entry
  const handleVerifyId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniqueId.trim()) {
      setIdError(t.idRequiredError);
      return;
    }
    setIdError('');
    // Derive student display name if not set
    if (!studentName.trim()) {
      setStudentName(`Student (${uniqueId.trim().toUpperCase()})`);
    }
    setStage('mustahiq_assessment');
  };

  const handleQuickSampleId = (id: string, sampleName: string) => {
    setUniqueId(id);
    setStudentName(sampleName);
    setIdError('');
  };

  const handleGenerateNewId = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newId = `OMNI-${randomNum}`;
    setUniqueId(newId);
    setStudentName(`Candidate ${newId}`);
    setIdError('');
  };

  // Handle final submission of Mustahiq & Emotion assessment to start test
  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();

    // Compute algorithmic needScore (0 - 100)
    let score = 50;
    if (incomeBracket === 'under_25k') score += 35;
    else if (incomeBracket === '25k_50k') score += 25;
    else if (incomeBracket === '50k_80k') score += 10;

    if (dependentsCount >= 5) score += 10;
    else if (dependentsCount >= 3) score += 5;

    if (preTestEmotion === 'determined' || preTestEmotion === 'hopeful') score += 5;

    const needScore = Math.min(100, Math.max(0, score));

    const mustahiqProfile: MustahiqProfile = {
      monthlyIncomeBracket: incomeBracket,
      fatherOccupation: fatherOccupation.trim() || 'Not specified',
      dependentsCount,
      financialHardshipReason: hardshipReason.trim() || 'Household financial constraints',
      motivationStatement: motivationStatement.trim() || 'Determined to achieve academic success',
      preTestEmotion,
      needScore,
      isMustahiqEligible: needScore >= 60,
    };

    const student: StudentProfile = {
      studentId: uniqueId.trim().toUpperCase(),
      rollNo: uniqueId.trim().toUpperCase(),
      name: studentName.trim() || `Candidate ${uniqueId.trim().toUpperCase()}`,
      age: 12,
      grade: 'Adaptive Assessment',
      preferredLanguage: lang,
      createdAt: new Date().toISOString(),
      mustahiqProfile,
    };

    onStart(student, isExpressMode);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {stage === 'id_entry' ? (
        /* ========================================================
           STEP 1: UNIQUE ID ONLY ENTRY GATE
           ======================================================== */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in duration-200">
          {/* Top Accent Gradient Bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 w-full" />

          <div className="p-6 sm:p-10 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{t.enterUniqueIdTitle}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t.enterUniqueIdTitle}
                </h1>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {t.enterUniqueIdSubtitle}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <form onSubmit={handleVerifyId} className="space-y-6 pt-2">
              {/* Unique ID Input Field */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800">
                  {t.uniqueIdLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="student-unique-id-input"
                    type="text"
                    required
                    value={uniqueId}
                    onChange={(e) => {
                      setUniqueId(e.target.value);
                      setIdError('');
                    }}
                    placeholder={t.uniqueIdPlaceholder}
                    className="w-full text-lg font-mono tracking-wider py-3 px-4 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-slate-900 uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 placeholder:text-sm"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                </div>

                {idError && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{idError}</span>
                  </p>
                )}
              </div>

              {/* Optional Candidate Name (auto-derived if empty) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  طالب علم کا نام (Student Name - اختیاری)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="جیسے: عائشہ خان یا علی احمد"
                  className="w-full text-sm py-2.5 px-3.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-800"
                />
              </div>

              {/* Sample IDs for instant one-click testing */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{t.sampleIdsHelper}</span>
                  <button
                    type="button"
                    onClick={handleGenerateNewId}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{t.generateNewIdBtn}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickSampleId('OMNI-101', 'Ayesha Khan')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer shadow-xs"
                  >
                    OMNI-101 (Ayesha)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSampleId('OMNI-102', 'Muhammad Bilal')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer shadow-xs"
                  >
                    OMNI-102 (Bilal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSampleId('OMNI-105', 'Sara Daniyal')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer shadow-xs"
                  >
                    OMNI-105 (Sara)
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateNewId}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer shadow-xs"
                  >
                    + Naya Unique ID
                  </button>
                </div>
              </div>

              {/* Express Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t.expressModeLabel}</div>
                    <div className="text-[11px] text-slate-500">{t.expressModeDesc}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isExpressMode}
                  onChange={(e) => setIsExpressMode(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Action Button */}
              <button
                id="verify-id-next-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>{t.startExamBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ========================================================
           STEP 2: PRE-TEST EMOTION & MUSTAHIQ ASSESSMENT
           ======================================================== */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 w-full" />

          <div className="p-6 sm:p-10 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>{t.mustahiqTag}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {t.mustahiqAssessmentTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t.mustahiqAssessmentSubtitle} — <span className="font-bold text-indigo-600">{uniqueId}</span>
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleStartExam} className="space-y-6">
              {/* Pre-Test Emotion Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                  {t.preTestEmotionLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPreTestEmotion('hopeful')}
                    className={`p-3 rounded-xl border text-right text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      preTestEmotion === 'hopeful'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>🌟 {t.emotionHopeful}</span>
                    {preTestEmotion === 'hopeful' && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreTestEmotion('determined')}
                    className={`p-3 rounded-xl border text-right text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      preTestEmotion === 'determined'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>⚡ {t.emotionDetermined}</span>
                    {preTestEmotion === 'determined' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreTestEmotion('confident')}
                    className={`p-3 rounded-xl border text-right text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      preTestEmotion === 'confident'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs ring-2 ring-blue-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>🚀 {t.emotionConfident}</span>
                    {preTestEmotion === 'confident' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreTestEmotion('anxious')}
                    className={`p-3 rounded-xl border text-right text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      preTestEmotion === 'anxious'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs ring-2 ring-amber-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>😰 {t.emotionAnxious}</span>
                    {preTestEmotion === 'anxious' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreTestEmotion('pressured')}
                    className={`p-3 rounded-xl border text-right text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      preTestEmotion === 'pressured'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs ring-2 ring-rose-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>🛡️ {t.emotionPressured}</span>
                    {preTestEmotion === 'pressured' && <span className="w-2 h-2 rounded-full bg-rose-600" />}
                  </button>
                </div>
              </div>

              {/* Monthly Income Bracket */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  {t.incomeLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 cursor-pointer transition-all ${
                      incomeBracket === 'under_25k'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="income"
                      value="under_25k"
                      checked={incomeBracket === 'under_25k'}
                      onChange={() => setIncomeBracket('under_25k')}
                      className="text-indigo-600"
                    />
                    <span>{t.incomeUnder25k}</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 cursor-pointer transition-all ${
                      incomeBracket === '25k_50k'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="income"
                      value="25k_50k"
                      checked={incomeBracket === '25k_50k'}
                      onChange={() => setIncomeBracket('25k_50k')}
                      className="text-indigo-600"
                    />
                    <span>{t.income25kTo50k}</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 cursor-pointer transition-all ${
                      incomeBracket === '50k_80k'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="income"
                      value="50k_80k"
                      checked={incomeBracket === '50k_80k'}
                      onChange={() => setIncomeBracket('50k_80k')}
                      className="text-indigo-600"
                    />
                    <span>{t.income50kTo80k}</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 cursor-pointer transition-all ${
                      incomeBracket === 'above_80k'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="income"
                      value="above_80k"
                      checked={incomeBracket === 'above_80k'}
                      onChange={() => setIncomeBracket('above_80k')}
                      className="text-indigo-600"
                    />
                    <span>{t.incomeAbove80k}</span>
                  </label>
                </div>
              </div>

              {/* Father Occupation & Dependents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {t.fatherOccupationLabel}
                  </label>
                  <input
                    type="text"
                    value={fatherOccupation}
                    onChange={(e) => setFatherOccupation(e.target.value)}
                    placeholder={t.fatherOccupationPlaceholder}
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {t.dependentsLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={dependentsCount}
                    onChange={(e) => setDependentsCount(Number(e.target.value))}
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Hardship & Motivation Statement */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {t.hardshipLabel}
                </label>
                <textarea
                  rows={2}
                  value={hardshipReason}
                  onChange={(e) => setHardshipReason(e.target.value)}
                  placeholder={t.hardshipPlaceholder}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {t.motivationLabel}
                </label>
                <textarea
                  rows={2}
                  value={motivationStatement}
                  onChange={(e) => setMotivationStatement(e.target.value)}
                  placeholder={t.motivationPlaceholder}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Notice */}
              <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{t.mustahiqNotice}</span>
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStage('id_entry')}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.back}
                </button>
                <button
                  id="start-exam-final-btn"
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>{t.proceedToTestBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
