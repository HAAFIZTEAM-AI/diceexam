import React, { useState } from 'react';
import { CheckCircle, Search, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';
import { ExamSubmission, Language } from '../../types';
import { translations } from '../../data/translations';

interface ExamCompletionModalProps {
  submission: ExamSubmission;
  onGoToSearch: (studentId: string) => void;
  onGoToAdmin: (submissionId: string) => void;
  onReset: () => void;
  lang: Language;
}

export const ExamCompletionModal: React.FC<ExamCompletionModalProps> = ({
  submission,
  onGoToSearch,
  onGoToAdmin,
  onReset,
  lang,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const copyStudentId = () => {
    navigator.clipboard.writeText(submission.studentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 text-center space-y-6">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">
            {lang === 'ur'
              ? `مبارک ہو، ${submission.student.name}!`
              : lang === 'roman'
              ? `Mubarak ho, ${submission.student.name}!`
              : `Congratulations, ${submission.student.name}!`}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ur'
              ? 'آپ کا پرچہ کامیابی سے رجسٹر ہو گیا ہے۔ آپ کی طالب علم آئی ڈی محفوظ کر لی گئی ہے۔'
              : lang === 'roman'
              ? 'Aap ka test kamyabi se submit ho gaya hai. Apni unique Student ID sambhal kar rakhein.'
              : 'Your exam and emotional need assessment have been registered successfully. Keep your Unique Student ID safe.'}
          </p>
        </div>

        {/* Student ID Card Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            {lang === 'ur' ? 'امتحانی شناختی کارڈ' : lang === 'roman' ? 'Imtehani Shinakht' : 'Exam Identity Card'}
          </div>

          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">{t.studentIdLabel}</div>
              <div className="text-base font-mono font-extrabold text-indigo-600">
                {submission.studentId}
              </div>
            </div>
            <button
              type="button"
              onClick={copyStudentId}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Roll No:</span>
              <span className="font-bold text-slate-800">{submission.rollNo}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Status:</span>
              <span className="font-bold text-amber-700">Pending Review</span>
            </div>
          </div>
        </div>

        {/* Action Pathways */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => onGoToAdmin(submission.id)}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'ur'
                ? 'ایڈمن پورٹل پر پرچہ چیک اور اسکالرشپ ایوارڈ کریں'
                : lang === 'roman'
                ? 'Admin portal par check aur scholarship dein'
                : 'Review & Grade in Admin Studio'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onGoToSearch(submission.studentId)}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>
              {lang === 'ur'
                ? 'رزلٹ سرچ پورٹل پر جائیں'
                : lang === 'roman'
                ? 'Result search portal par jayein'
                : 'Search on Result Verification Portal'}
            </span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>
              {lang === 'ur'
                ? 'نیا امتحان شروع کریں'
                : lang === 'roman'
                ? 'Naya test shuru karein'
                : 'Start Another Candidate Exam'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
