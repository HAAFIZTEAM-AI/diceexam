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

  // Validate student roll number rule:
  // "yaad rakho A3B4 ho ga A ke sath even aur B ke sath Odd num hoga agr is ke ilawa koi num aaye to wrong rollno show karna"
  const isValidRollNumber = (raw: string): boolean => {
    const r = raw.trim().toUpperCase();
    // Rule: A followed by even digit [0, 2, 4, 6, 8] and B followed by odd digit [1, 3, 5, 7, 9]
    const isEvenOddMatch = /^A[02468]B[13579]$/.test(r);
    // Explicit user match: A3B4
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

    // If candidate enters admin master key in main input
    if (cleanId === '@#$%^&*') {
      onLoginAsAdmin();
      return;
    }

    // Strict Roll Number validation
    if (!isValidRollNumber(cleanId)) {
      setErrorMessage(
        lang === 'ur'
          ? 'غلط رول نمبر! رول نمبر کا درست فارمیٹ A کے ساتھ جفت عدد اور B کے ساتھ طاق عدد ہے (مثلاً A2B3, A4B7)۔'
          : lang === 'roman'
          ? 'Ghalat Roll Number! Format A ke sath even aur B ke sath odd number hona chahiye (e.g. A2B3, A4B7).'
          : 'Wrong Roll Number! Format must have an even number with A and an odd number with B (e.g., A2B3, A4B7).'
      );
      return;
    }

    setErrorMessage(null);
    onLoginAsStudent(cleanId.toUpperCase());
  };

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword.trim() === '@#$%^&*') {
      onLoginAsAdmin();
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with Branding and Language Selector */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Digital Institute of Computer Education</span>
            </h1>
            <p className="text-xs text-indigo-300 font-medium">
              {lang === 'ur'
                ? 'اسکالرشپ و قابلیت امتحانی پورٹل (DICE Scholarship Exam)'
                : lang === 'roman'
                ? 'Scholarship & Merit Assessment Portal'
                : 'Scholarship & Merit Assessment Portal'}
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 backdrop-blur-md">
          <Globe className="w-4 h-4 text-slate-400 mx-2 hidden sm:inline" />
          <button
            type="button"
            onClick={() => onLanguageChange('ur')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              lang === 'ur'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            اردو
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('roman')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              lang === 'roman'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Roman
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Secure Login Gateway Card */}
      <main className="w-full max-w-md mx-auto px-4 sm:px-6 my-auto py-8 z-10">
        <div className="bg-slate-800/95 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 mb-1">
              {showAdminField ? <ShieldCheck className="w-7 h-7 text-amber-400" /> : <KeyRound className="w-7 h-7" />}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {showAdminField
                ? lang === 'ur'
                  ? 'ایڈمن و ایگزامینر لاگ ان'
                  : 'Chief Examiner / Admin Login'
                : lang === 'ur'
                ? 'طالب علم امتحانی لاگ ان'
                : 'Candidate Portal Login'}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {showAdminField
                ? lang === 'ur'
                  ? 'پرچہ کنٹرول، رزلٹ لاک/ان لاک اور چیکنگ کے لیے ایڈمن پاس ورڈ درج کریں۔'
                  : 'Enter the master security password to access paper control & grading.'
                : lang === 'ur'
                ? 'اپنا تفویض کردہ رول نمبر درج کریں (فارمیٹ: A کے ساتھ جفت اور B کے ساتھ طاق عدد، مثلاً A2B3)'
                : 'Enter your assigned Roll Number (Format: A<Even>B<Odd>, e.g. A2B3).'}
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
                  {lang === 'ur' ? 'طالب علم کا رول نمبر (Roll No)' : 'Student Roll Number'}
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
                    placeholder="مثال: A2B3 یا A4B7"
                    maxLength={10}
                    className="w-full px-4 py-3.5 bg-slate-900/90 border border-slate-700 rounded-2xl text-white font-mono text-center text-lg tracking-widest placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  {lang === 'ur'
                    ? 'قاعدہ: A کے ساتھ جفت عدد (0,2,4,6,8) اور B کے ساتھ طاق عدد (1,3,5,7,9)'
                    : 'Rule: Even number with A and Odd number with B'}
                </p>
              </div>

              {/* Error banner */}
              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="login-gateway-submit-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <span>
                  {lang === 'ur'
                    ? 'پورٹل میں داخل ہوں'
                    : lang === 'roman'
                    ? 'Portal Mein Dakhil Hon'
                    : 'Enter Exam Portal'}
                </span>
                <ArrowRight className="w-4 h-4" />
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
                  {lang === 'ur' ? 'ایڈمن سیکیورٹی کلید' : 'Admin Security Key'}
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
                    placeholder="سیکیورٹی پاس ورڈ درج کریں..."
                    className="w-full px-4 py-3.5 bg-slate-900/90 border border-amber-500/40 rounded-2xl text-white font-mono text-center text-lg tracking-widest placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-inner"
                    autoFocus
                  />
                </div>
              </div>

              {/* Error banner */}
              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Admin Submit */}
              <button
                id="admin-login-submit-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {lang === 'ur'
                    ? 'ایڈمن پرچہ کنٹرولر کھولیں'
                    : 'Open Admin Paper Controller'}
                </span>
              </button>
            </form>
          )}

          {/* Clean Switch between Student and Admin */}
          <div className="pt-4 border-t border-slate-700/70 text-center">
            <button
              type="button"
              onClick={() => {
                setShowAdminField(!showAdminField);
                setErrorMessage(null);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              {showAdminField ? (
                <span>
                  {lang === 'ur' ? '← واپس طالب علم لاگ ان پر جائیں' : '← Back to Student Login'}
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {lang === 'ur'
                      ? 'انتظامیہ / ایڈمن لاگ ان (Paper Controller)'
                      : 'Examiner / Admin Access'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500 z-10">
        Digital Institute of Computer Education • Scholarship & Merit Examination Portal
      </footer>
    </div>
  );
};
