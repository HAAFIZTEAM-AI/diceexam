import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  HelpCircle,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  X,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { ExamSubmission, Language } from '../../types';

interface AdminAICoPilotProps {
  submissions: ExamSubmission[];
  selectedSubmission?: ExamSubmission | null;
  lang: Language;
  onApplyRemarks?: (remarks: string) => void;
  onClose: () => void;
}

export const AdminAICoPilot: React.FC<AdminAICoPilotProps> = ({
  submissions,
  selectedSubmission,
  lang,
  onApplyRemarks,
  onClose,
}) => {
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; time: string }>
  >([
    {
      sender: 'ai',
      text:
        lang === 'ur'
          ? 'خوش آمدید چیف ایگزامینر! میں آپ کا AI ایڈمن معاون ہوں۔ میں پرچوں کی جانچ، پارٹ 4 کے تحریری جوابات کی مارکنگ، اور کوٹہ قوانین (100%، 50%، 25%) کے اطلاق میں آپ کی مکمل رہنمائی کروں گا۔ آپ مجھ سے کیا پوچھنا چاہتے ہیں؟'
          : lang === 'roman'
          ? 'Khush amdeed Chief Examiner! Mein aap ka AI Admin Assistant hoon. Mein papers ki checking, Part 4 written essays ki marking, aur quota rules (100%, 50%, 25%) enforce karne mein aap ki mukammal madad karunga. Aap kya poochna chahtay hain?'
          : 'Welcome Chief Examiner! I am your AI Co-Pilot. I assist in grading subjective essays, enforcing scholarship quotas (100%, 50%, 25%), and formulating parent/teacher remarks.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    {
      label:
        lang === 'ur'
          ? 'کوٹہ اصول چیک کریں'
          : lang === 'roman'
          ? 'Quota Rules Check Karein'
          : 'Check Quota Rules',
      query:
        lang === 'ur'
          ? 'اسکالرشپ کے 100%، 50% اور 25% کوٹہ کے اصول اور موجودہ الاٹمنٹ کا خلاصہ بتائیں۔'
          : lang === 'roman'
          ? 'Scholarship quota (100%, 50%, 25%) ke rules aur current allocations ka status batayein.'
          : 'Explain the quota rules for 100%, 50%, and 25% scholarships and current distribution.',
    },
    {
      label:
        lang === 'ur'
          ? '100% سیٹ کے لیے ٹاپ امیدوار کا تجزیہ'
          : lang === 'roman'
          ? '100% Seat ke liye Top Candidate'
          : 'Top 100% Candidate',
      query:
        lang === 'ur'
          ? 'رینک 1 کے لیے کون سا طالب علم سب سے زیادہ حقدار ہے؟ میرٹ اور ضرورت انڈیکس دونوں دیکھ کر بتائیں۔'
          : lang === 'roman'
          ? 'Rank 1 ke liye konsa student sab se ziada haqdar hai? Merit aur Need Index dono dekh kar batayein.'
          : 'Analyze who is the top deserving candidate for the single 100% Platinum scholarship seat.',
    },
    {
      label:
        lang === 'ur'
          ? 'پارٹ 4 کی تحریر کا اخلاقی جائزہ'
          : lang === 'roman'
          ? 'Part 4 Essays Checking Tips'
          : 'Part 4 Essay Rubric',
      query:
        lang === 'ur'
          ? 'حصہ 4 کے اوپن اینڈڈ تحریری سوالات کی جانچ کے لیے AI کن بنیادوں پر مارکس تجویز کرتا ہے؟'
          : lang === 'roman'
          ? 'Hissa 4 ke open-ended written questions mein AI kin cheezon ko evaluate karta hai?'
          : 'What criteria does AI use to evaluate Part 4 written subjective responses?',
    },
  ];

  const handleSendQuery = async (queryText: string) => {
    const textToSend = queryText.trim();
    if (!textToSend || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            totalSubmissions: submissions.length,
            selectedStudent: selectedSubmission?.studentId,
            selectedName: selectedSubmission?.student.name,
            selectedScore: selectedSubmission?.finalPercentage,
            selectedNeedScore: selectedSubmission?.mustahiqProfile?.needScore,
            lang,
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'تجزیہ مکمل ہو گیا۔';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            lang === 'ur'
              ? 'معذرت، AI سرور سے رابطہ میں تاخیر ہوئی۔ کوٹہ اصول کے مطابق رینک 1 کو 100% اور رینک 2-3 کو 50% تفویض کریں۔'
              : 'Quota rule: Rank 1 receives 100%, Ranks 2-3 receive 50%, remaining qualifying receive 25%.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-slate-900/95 border-l border-slate-700 shadow-2xl z-50 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>
                {lang === 'ur'
                  ? 'AI چیف ایگزامینر اسسٹنٹ'
                  : lang === 'roman'
                  ? 'AI Chief Examiner Assistant'
                  : 'AI Chief Examiner Co-Pilot'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'ur'
                ? 'چیکنگ، کوٹہ گائیڈنس و خودکار جانچ'
                : lang === 'roman'
                ? 'Checking, Quota Guidance & AI Evaluation'
                : 'Smart Grading & Quota Supervisor'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 font-bold">
          Quick:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendQuery(p.query)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 text-[11px] whitespace-nowrap transition-all cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
              {m.time}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs p-3 bg-slate-800/50 rounded-xl border border-slate-700 w-max animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI تجزیہ کر رہا ہے...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(inputQuery);
        }}
        className="p-3.5 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            lang === 'ur'
              ? 'AI سے کچھ بھی پوچھیں (امیدوار، مارکس، کوٹہ)...'
              : lang === 'roman'
              ? 'AI se kuch bhi poochein (Candidate, marks, quota)...'
              : 'Ask AI Examiner assistant anything...'
          }
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white transition-all cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
