import React, { useState } from 'react';
import {
  KeyRound,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Globe,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Language } from '../../types';

interface UnifiedLoginGatewayProps {
  onLoginAsStudent: (studentId: string) => void;
  onLoginAsAdmin: () => void;
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
}

export const UnifiedLoginGateway: React.FC<UnifiedLoginGatewayProps> = ({
  onLoginAsStudent,
  onLoginAsAdmin,
  lang,
  onLanguageChange,
}) => {
  const [enteredId, setEnteredId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAdminField, setShowAdminField] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate student roll number rule:
  // A + Even digit + B + Odd digit (e.g. A2B3, A4B7)
  // Special allowed: A3B4
  const isValidRollNumber = (raw: string): boolean => {
    const r = raw.trim().toUpperCase();
    const isEvenOddMatch = /^A[02468]B[13579]$/.test(r);
    const isA3B4 = r === 'A3B4';
    return isEvenOddMatch || isA3B4;
  };

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = enteredId.trim();

    if (!cleanId) {
      setErrorMessage(
        lang === 'ur'
          ? 'براہ کرم اپنا درست رول نمبر درج کریں!'
          : lang === 'roman'
          ? 'Barah-e-karam apna durust Roll Number darj karein!'
          : 'Please enter your assigned Student Roll Number!'
      );
      return;
    }

    // Allow admin master key from main input (convenience)
    if (cleanId === '@#$%^&*') {
      onLoginAsAdmin();
      return;
    }

    if (!isValidRollNumber(cleanId)) {
      setErrorMessage(
        lang === 'ur'
          ? 'غلط رول نمبر! درست فارمیٹ: A کے ساتھ جفت عدد اور B کے ساتھ طاق عدد (مثلاً A2B3, A4B7, A0B1)'
          : lang === 'roman'
          ? 'Ghalat Roll Number! Sahi format: A + even number + B + odd number (jaise A2B3, A4B7, A0B1)'
          : 'Invalid Roll Number! Correct format: A + even digit + B + odd digit (e.g. A2B3, A4B7, A0B1)'
      );
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    // Small delay for better UX feel
    setTimeout(() => {
      onLoginAsStudent(cleanId.toUpperCase());
      setIsSubmitting(false);
    }, 280);
  };

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword.trim() === '@#$%^&*') {
      setIsSubmitting(true);
      setTimeout(() => {
        onLoginAsAdmin();
        setIsSubmitting(false);
      }, 280);
    } else {
      setErrorMessage(
        lang === 'ur'
          ? 'غلط ایڈمن سیکیورٹی پاس ورڈ! رسائی مسترد کر دی گئی۔'
          : lang === 'roman'
          ? 'Ghalat Admin Security Password! Access denied.'
          : 'Invalid Admin Security Password! Access denied.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex items-center justify-between z-10 gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white truncate">
              Digital Institute of Computer Education
            </h1>
            <p className="text-[11px] sm:text-xs text-indigo-300 font-medium truncate">
              {lang === 'ur'
                ? 'اسکالرشپ و قابلیت امتحانی پورٹل (DICE)'
                : lang === 'roman'
                ? 'Scholarship & Merit Assessment Portal'
                : 'Scholarship & Merit Assessment Portal'}
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 backdrop-blur-md shrink-0">
          <Globe className="w-3.5 h-3.5 text-slate-400 mx-1.5 hidden sm:inline" />
          <button
            type="button"
            onClick={() => onLanguageChange('ur')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
              lang === 'ur'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            اردو
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('roman')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
              lang === 'roman'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Roman
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto px-4 sm:px-6 my-auto py-6 sm:py-8 z-10">
        <div className="bg-slate-800/95 rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 mb-1">
              {showAdminField ? (
                <ShieldCheck className="w-7 h-7 text-amber-400" />
              ) : (
                <KeyRound className="w-7 h-7" />
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {showAdminField
                ? lang === 'ur'
                  ? 'ایڈمن / ایگزامینر لاگ ان'
                  : lang === 'roman'
                  ? 'Admin / Examiner Login'
                  : 'Chief Examiner / Admin Login'
                : lang === 'ur'
                ? 'طالب علم امتحانی لاگ ان'
                : lang === 'roman'
                ? 'Student Exam Login'
                : 'Candidate Portal Login'}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {showAdminField
                ? lang === 'ur'
                  ? 'پرچہ کنٹرول، رزلٹ اور چیکنگ کے لیے ایڈمن پاس ورڈ درج کریں۔'
                  : lang === 'roman'
                  ? 'Paper control, result aur checking ke liye Admin password darj karein.'
                  : 'Enter the master security password to access paper control & grading.'
                : lang === 'ur'
                ? 'اپنا تفویض کردہ رول نمبر درج کریں (فارمیٹ: A + جفت عدد + B + طاق عدد)'
                : lang === 'roman'
                ? 'Apna assigned Roll Number darj karein (Format: A + even + B + odd)'
                : 'Enter your assigned Roll Number (Format: A + even digit + B + odd digit)'}
            </p>
          </div>

          {/* Student Login Form */}
          {!showAdminField ? (
            <form onSubmit={handleSubmitStudent} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="roll-input"
                  className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
                >
                  {lang === 'ur'
                    ? 'طالب علم کا رول نمبر'
                    : lang === 'roman'
                    ? 'Student Roll Number'
                    : 'Student Roll Number'}
                </label>
                <div className="relative">
                  <input
                    id="roll-input"
                    type="text"
                    value={enteredId}
                    onChange={(e) => {
                      setEnteredId(e.target.value.toUpperCase());
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder={
                      lang === 'ur'
                        ? 'مثال: A2B3 یا A4B7'
                        : 'e.g. A2B3 or A4B7'
                    }
                    maxLength={8}
                    className="w-full px-4 py-3.5 bg-slate-900/90 border border-slate-700 rounded-2xl text-white font-mono text-center text-lg tracking-widest placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                    autoFocus
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  {lang === 'ur'
                    ? 'قاعدہ: A کے ساتھ جفت عدد (0,2,4,6,8) اور B کے ساتھ طاق عدد (1,3,5,7,9)'
                    : lang === 'roman'
                    ? 'Rule: A ke sath even number (0,2,4,6,8) aur B ke sath odd number (1,3,5,7,9)'
                    : 'Rule: Even digit with A and Odd digit with B'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              <button
                id="login-gateway-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-70 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {lang === 'ur' ? 'داخل ہو رہے ہیں...' : 'Entering...'}
                  </span>
                ) : (
                  <>
                    <span>
                      {lang === 'ur'
                        ? 'پورٹل میں داخل ہوں'
                        : lang === 'roman'
                        ? 'Portal Mein Dakhil Hon'
                        : 'Enter Exam Portal'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Admin Password Form */
            <form onSubmit={handleSubmitAdmin} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="admin-pass-input"
                  className="block text-xs font-bold text-amber-300 uppercase tracking-wider"
                >
                  {lang === 'ur'
                    ? 'ایڈمن سیکیورٹی کلید'
                    : lang === 'roman'
                    ? 'Admin Security Key'
                    : 'Admin Security Key'}
                </label>
                <div className="relative">
                  <input
                    id="admin-pass-input"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder={
                      lang === 'ur'
                        ? 'سیکیورٹی پاس ورڈ درج کریں...'
                        : 'Enter security password...'
                    }
                    className="w-full px-4 py-3.5 bg-slate-900/90 border border-amber-500/40 rounded-2xl text-white font-mono text-center text-lg tracking-widest placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-inner"
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-70 text-slate-950 font-black text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    {lang === 'ur' ? 'کھول رہے ہیں...' : 'Opening...'}
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {lang === 'ur'
                        ? 'ایڈمن پرچہ کنٹرولر کھولیں'
                        : lang === 'roman'
                        ? 'Admin Paper Controller Kholein'
                        : 'Open Admin Paper Controller'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Switch between Student and Admin */}
          <div className="pt-4 border-t border-slate-700/70 text-center">
            <button
              type="button"
              onClick={() => {
                setShowAdminField(!showAdminField);
                setErrorMessage(null);
                setAdminPassword('');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              {showAdminField ? (
                <span>
                  {lang === 'ur'
                    ? '← واپس طالب علم لاگ ان پر جائیں'
                    : lang === 'roman'
                    ? '← Wapas Student Login par jayein'
                    : '← Back to Student Login'}
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {lang === 'ur'
                      ? 'انتظامیہ / ایڈمن لاگ ان'
                      : lang === 'roman'
                      ? 'Admin / Examiner Access'
                      : 'Examiner / Admin Access'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-[11px] sm:text-xs text-slate-500 z-10">
        Digital Institute of Computer Education • Scholarship & Merit Examination Portal
      </footer>
    </div>
  );
};
