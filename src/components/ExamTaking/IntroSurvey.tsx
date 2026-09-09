import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, MessageSquare, Compass, Heart } from 'lucide-react';
import { INTRO_SURVEY_TEMPLATE } from '../../data/questionBank';
import { IntroQuestionAnswer, Language, StudentProfile } from '../../types';
import { translations } from '../../data/translations';

interface IntroSurveyProps {
  student: StudentProfile;
  lang: Language;
  onComplete: (answers: IntroQuestionAnswer[]) => void;
}

export const IntroSurvey: React.FC<IntroSurveyProps> = ({ student, lang, onComplete }) => {
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    intro_1: 'ریاضی اور سائنس میں دلچسپی ہے، پہیلیاں حل کرنا اچھا لگتا ہے۔',
    intro_7: 'پرعزم اور پُرجوش (Determined & Hopeful)',
    intro_8: 'سائنسدان یا استاد بن کر قوم اور غریب طلبہ کی خدمت کرنا چاہتا ہوں۔',
  });

  const currentQ = INTRO_SURVEY_TEMPLATE[currentIndex];

  const handleTextChange = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const handleQuickChip = (chip: string) => {
    setAnswers((prev) => {
      const existing = prev[currentQ.id] || '';
      return {
        ...prev,
        [currentQ.id]: existing ? `${existing}، ${chip}` : chip,
      };
    });
  };

  const handleNext = () => {
    if (currentIndex < INTRO_SURVEY_TEMPLATE.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishSurvey();
    }
  };

  const finishSurvey = () => {
    const formatted: IntroQuestionAnswer[] = INTRO_SURVEY_TEMPLATE.map((q) => ({
      id: q.id,
      questionUrdu: q.questionUrdu,
      questionEn: q.questionEn,
      answer: answers[q.id] || 'معیاری اخلاقی فہم۔',
    }));
    onComplete(formatted);
  };

  const getQuestionText = () => {
    if (lang === 'ur') return currentQ.questionUrdu;
    if (lang === 'roman') {
      const romanMap: Record<string, string> = {
        intro_1: 'Aap ko school mein sab se ziada konsa subject pasand hai aur kyun?',
        intro_2: 'Fariq waqt mein aap ko kya karna sab se acha lagta hai?',
        intro_3: 'Aap ki sab se bari quwwat ya hunar kya hai?',
        intro_4: 'Apni zindagi ka koi aisa waqia batayein jis par aap ko fakhr mehsoos ho?',
        intro_5: 'Aap ki zindagi mein aap ki sab se bari rehnuma shakhsiyat kon hain?',
        intro_6: 'Agar aap ko ikhtiyar miley to aap apne mulk ya muashray mein kya tabdeeli layenge?',
        intro_7: 'Aaj is test ke baray mein aap ka jazba kaisa hai?',
        intro_8: 'Bara ho kar aap kya banna chahte hain aur kyun?',
      };
      return romanMap[currentQ.id] || currentQ.questionEn;
    }
    return currentQ.questionEn;
  };

  const getSuggestions = (index: number) => {
    if (lang === 'roman') {
      switch (index) {
        case 0:
          return ['Maths', 'Science', 'English', 'Computer', 'Urdu'];
        case 1:
          return ['Kitabein parhna', 'Drawing karna', 'Cricket khelna', 'Ghar walon ki madad'];
        case 2:
          return ['Hisab kitab', 'Kahani likhna', 'Doston ki madad', 'Zehni puzzles'];
        case 6:
          return ['Pura azm (Confident)', 'Umeed war (Hopeful)', 'Purjosh (Excited)'];
        case 7:
          return ['Doctor', 'Software Engineer', 'Scientist', 'Teacher', 'Officer'];
        default:
          return ['Mehnat aur lagan', 'Walidain ki dua'];
      }
    }
    if (lang === 'en') {
      switch (index) {
        case 0:
          return ['Mathematics', 'Science', 'English', 'Computer', 'Literature'];
        case 1:
          return ['Reading books', 'Drawing', 'Sports', 'Helping siblings'];
        case 2:
          return ['Problem solving', 'Creative writing', 'Empathy', 'Puzzles'];
        case 6:
          return ['Confident', 'Hopeful', 'Calm & Focused', 'Eager to learn'];
        case 7:
          return ['Doctor', 'Software Engineer', 'Scientist', 'Teacher', 'Civil Servant'];
        default:
          return ['Hard work', 'Curiosity'];
      }
    }
    switch (index) {
      case 0:
        return ['ریاضی (Maths)', 'انگریزی (English)', 'سائنس (Science)', 'کمپیوٹر', 'اسلامیات'];
      case 1:
        return ['کتابیں پڑھنا', 'ڈرائنگ بنانا', 'کرکٹ کھیلنا', 'چھوٹے بہن بھائیوں کی مدد'];
      case 2:
        return ['نمبرز کا حساب', 'کہانیاں سنانا', 'ڈرائنگ', 'نئے دوست بنانا'];
      case 6:
        return ['بہت پُراعتماد (Confident)', 'پُرجوش (Excited)', 'پُرسکون (Calm)'];
      case 7:
        return ['ڈاکٹر (Doctor)', 'سافٹ ویئر انجینئر', 'سائنسدان (Scientist)', 'استاد (Teacher)'];
      default:
        return ['والدین کی دعائیں', 'کتب بینی کا شوق'];
    }
  };

  const currentAnswer = answers[currentQ.id] || '';

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {lang === 'ur' ? 'مرحلہ 2: فکری و اخلاقی سروے' : lang === 'roman' ? 'Marhala 2: Fikri & Ikhlaqi Survey' : 'Phase 2: Cognitive & Ethics Survey'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {lang === 'ur' ? 'طالب علم کا فکری اور جذباتی تعارف' : lang === 'roman' ? 'Student Ka Fikri & Jazbati Taaruf' : 'Student Cognitive & Mindset Survey'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Candidate: <strong className="text-slate-900">{student.name}</strong> • ID:{' '}
              <span className="font-mono text-indigo-600 font-bold">{student.studentId}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={finishSurvey}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
          >
            {lang === 'ur' ? 'امتحان پر جائیں' : lang === 'roman' ? 'Test shuru karein' : 'Skip to Exam'}
          </button>
        </div>

        {/* Progress */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / INTRO_SURVEY_TEMPLATE.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="text-xs font-bold text-indigo-600">
          Question {currentIndex + 1} of {INTRO_SURVEY_TEMPLATE.length}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
          {getQuestionText()}
        </h3>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500">
            {lang === 'ur' ? 'فوری منتخب کریں:' : lang === 'roman' ? 'Jaldi select karein:' : 'Quick Select:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {getSuggestions(currentIndex).map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickChip(chip)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <textarea
            rows={3}
            value={currentAnswer}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t.typeYourAnswer}
            className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-900 bg-white"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className={`py-2 px-4 rounded-xl border border-slate-200 text-xs font-bold ${
              currentIndex === 0 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            {t.back}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>{currentIndex === INTRO_SURVEY_TEMPLATE.length - 1 ? (lang === 'ur' ? 'امتحان شروع کریں' : lang === 'roman' ? 'Test shuru karein' : 'Start Adaptive Exam') : t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
