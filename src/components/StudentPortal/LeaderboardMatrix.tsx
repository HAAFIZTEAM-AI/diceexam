import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Calculator,
  Percent,
  CheckCircle2,
  TrendingUp,
  Users,
  ShieldCheck,
  Star,
  Info,
} from 'lucide-react';
import { ExamSubmission, Language } from '../../types';

interface LeaderboardMatrixProps {
  submissions: ExamSubmission[];
  currentStudentId: string;
  lang: Language;
}

export const LeaderboardMatrix: React.FC<LeaderboardMatrixProps> = ({
  submissions,
  currentStudentId,
  lang,
}) => {
  const [simulatedMarks, setSimulatedMarks] = useState<number>(85);

  // Calculate simulated percentage and expected scholarship tier
  const simulatedPercentage = Math.min(100, Math.max(0, Math.round(simulatedMarks)));

  const getSimulatedTier = (pct: number) => {
    if (pct >= 90) {
      return {
        name: lang === 'ur' ? '100% مکمل اسکالرشپ' : lang === 'roman' ? '100% Mukammal Scholarship' : '100% Full Scholarship',
        badge: 'Platinum (100%)',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        quota: lang === 'ur' ? 'صرف میرٹ لسٹ کے پہلے طالب علم (رینک 1) کے لیے' : lang === 'roman' ? 'Sirf Merit List ke Rank 1 student ke liye' : 'Strictly Rank 1 Top Student',
        benefits: lang === 'ur' ? '100% مکمل ٹیوشن فیس معافی + کتب و اعزازی لیپ ٹاپ' : lang === 'roman' ? '100% Full Tuition Fee Maafi + Books & Laptop' : '100% Full Tuition Waiver + Books & Honorary Laptop',
      };
    }
    if (pct >= 80) {
      return {
        name: lang === 'ur' ? '50% نصف اسکالرشپ' : lang === 'roman' ? '50% Half Scholarship' : '50% Half Scholarship',
        badge: 'Gold / Silver (50%)',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        quota: lang === 'ur' ? 'زیادہ سے زیادہ 1 تا 2 باہمت طلبہ کے لیے' : lang === 'roman' ? 'Ziyada se ziyada 1-2 students ke liye' : 'Maximum 1 to 2 Students',
        benefits: lang === 'ur' ? '50% تعلیمی فیس معافی اسکالرشپ' : lang === 'roman' ? '50% Educational Fee Concession' : '50% Tuition Fee Concession',
      };
    }
    if (pct >= 60) {
      return {
        name: lang === 'ur' ? '25% چوتھائی اسکالرشپ' : lang === 'roman' ? '25% Quarter Scholarship' : '25% Quarter Scholarship',
        badge: 'Bronze (25%)',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        quota: lang === 'ur' ? 'بقیہ تمام پاس ہونے والے اہل طلبہ کے لیے' : lang === 'roman' ? 'Baqi tamam pass hone walay eligible students' : 'All Remaining Qualifying Pass Students',
        benefits: lang === 'ur' ? '25% فیس رعایت + گائیڈنس سرٹیفکیٹ' : lang === 'roman' ? '25% Fee Discount + Guidance Certificate' : '25% Fee Concession + Guidance Certificate',
      };
    }
    if (pct >= 40) {
      return {
        name: lang === 'ur' ? 'پاس / تعلیمی سرٹیفکیٹ' : lang === 'roman' ? 'Pass / Certificate of Merit' : 'Pass / Merit Certificate',
        badge: 'Merit Pass',
        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        quota: lang === 'ur' ? 'کامیاب شرکت' : lang === 'roman' ? 'Kamiyab Shirkat' : 'Successful Participation',
        benefits: lang === 'ur' ? 'ایڈمشن سرٹیفکیٹ و تعلیمی رہنمائی' : lang === 'roman' ? 'Admission Certificate & Educational Guidance' : 'Admission Certificate & Academic Guidance',
      };
    }
    return {
      name: lang === 'ur' ? 'مزید محنت کی ضرورت' : lang === 'roman' ? 'Mazeed Mehnat Ki Zaroorat' : 'Needs Preparation',
      badge: 'Improvement Required',
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
      quota: '-',
      benefits: lang === 'ur' ? 'دوبارہ ٹیسٹ کی تیاری کے لیے مفت تدریسی رہنمائی' : lang === 'roman' ? 'Free Mentorship & Re-test Guidance' : 'Free Mentorship & Re-test Preparation',
    };
  };

  const currentSimTier = getSimulatedTier(simulatedPercentage);

  // Sort submissions by percentage descending
  const sortedSubmissions = [...submissions].sort((a, b) => {
    return (b.finalPercentage || 0) - (a.finalPercentage || 0);
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>
                {lang === 'ur'
                  ? 'مارکس بمقابلہ پرسنٹیج اور اسکالرشپ میٹرکس'
                  : lang === 'roman'
                  ? 'Marks vs Percentage & Scholarship Matrix'
                  : 'Marks vs Percentage & Scholarship Slabs'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'ur'
                ? 'کتنے نمبروں پر کتنی فیصد (% ) اور اسکالرشپ ملے گی؟'
                : lang === 'roman'
                ? 'Kitnay numbers par kitni percentage aur scholarship milegi?'
                : 'How Many Marks Yield What Percentage & Scholarship?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {lang === 'ur'
                ? 'اپنے متوقع نمبر لکھیں یا سلائیڈر گھمائیں تاکہ جان سکیں کہ آپ کو کس درجے کی اسکالرشپ حاصل ہو سکتی ہے۔'
                : lang === 'roman'
                ? 'Apnay expected marks likhein ya slider move karein taake jaan sakein aap ko konsi scholarship mil sakti hai.'
                : 'Simulate your target marks to instantly see calculated percentage, tier, and scholarship entitlement.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-300 font-semibold">
              Live Merit Engine
            </span>
          </div>
        </div>

        {/* Interactive Simulator Slider */}
        <div className="mt-8 p-6 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <label htmlFor="marks-slider" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {lang === 'ur'
                  ? 'آپ کے متوقع نمبر (100 میں سے)'
                  : lang === 'roman'
                  ? 'Aap ke expected numbers (100 mein se)'
                  : 'Enter / Select Target Marks (out of 100):'}
              </label>
              <div className="text-xs text-slate-500">
                {lang === 'ur' ? 'سلائیڈر آگے پیچھے کریں' : lang === 'roman' ? 'Slider aagay peeche karein' : 'Drag slider or type value'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={simulatedMarks}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) setSimulatedMarks(Math.min(100, Math.max(0, val)));
                }}
                className="w-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white font-mono font-bold text-center text-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-slate-400 font-mono text-sm font-bold">/ 100</span>
            </div>
          </div>

          {/* Range Slider */}
          <input
            id="marks-slider"
            type="range"
            min="0"
            max="100"
            value={simulatedMarks}
            onChange={(e) => setSimulatedMarks(Number(e.target.value))}
            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          {/* Dynamic Result Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Box 1: Percentage */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {lang === 'ur' ? 'حاصل کردہ فیصد' : lang === 'roman' ? 'Haasil shuda percentage' : 'Calculated Percentage'}
                </div>
                <div className="text-xl font-black text-white font-mono">
                  {simulatedPercentage}%
                </div>
              </div>
            </div>

            {/* Box 2: Tier */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${currentSimTier.color}`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] opacity-80 font-medium">
                  {lang === 'ur' ? 'اسکالرشپ کیٹیگری' : lang === 'roman' ? 'Scholarship Category' : 'Entitlement Category'}
                </div>
                <div className="text-base font-black">
                  {currentSimTier.name}
                </div>
              </div>
            </div>

            {/* Box 3: Quota Rule */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {lang === 'ur' ? 'کوٹہ اصول و نشستیں' : lang === 'roman' ? 'Quota Rule & Seats' : 'Quota Policy'}
                </div>
                <div className="text-xs font-bold text-slate-200">
                  {currentSimTier.quota}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>
                <strong>{lang === 'ur' ? 'فوائد:' : lang === 'roman' ? 'Benefits:' : 'Award Benefits:'}</strong>{' '}
                {currentSimTier.benefits}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold w-max">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {lang === 'ur'
                  ? 'حفظِ قرآن رعایت: 25% پاسنگ مارجن و حصہ 1 استثنیٰ'
                  : lang === 'roman'
                  ? 'Hafiz Concession: 25% Pass Credit & Part 1 Exemption'
                  : 'Hafiz Quota: 25% Pass Credit & Part 1 Exemption'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Slabs Table */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 backdrop-blur-md space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>
            {lang === 'ur'
              ? 'سرکاری امتحانی سلیبس و اسکالرشپ سلیب چارٹ'
              : lang === 'roman'
              ? 'Sarkari Imtihani Syllabus & Scholarship Slab Chart'
              : 'Official Examination Slabs & Quota Matrix'}
          </span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-700">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-mono border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'نمبرات کا دائرہ' : lang === 'roman' ? 'Marks Range' : 'Marks Range'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'فیصد (% )' : lang === 'roman' ? 'Percentage (% )' : 'Percentage'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'اسکالرشپ نشست' : lang === 'roman' ? 'Scholarship Seat' : 'Scholarship Award'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'کوٹہ اصول' : lang === 'roman' ? 'Quota Rule' : 'Quota Rule'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'خصوصی فوائد' : lang === 'roman' ? 'Khasoozi Fawaid' : 'Benefits Included'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-medium">
              <tr className="bg-amber-950/20 hover:bg-amber-950/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-amber-300">90 - 100</td>
                <td className="py-3.5 px-4 font-mono text-white">90% - 100%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
                    100% Platinum Full Scholarship
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {lang === 'ur' ? 'صرف 1 طالب علم (رینک 1)' : lang === 'roman' ? 'Sirf 1 student (Rank 1)' : 'Strictly 1 Student (Rank 1)'}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {lang === 'ur' ? '100% فیس معافی + لیپ ٹاپ و کتب' : lang === 'roman' ? '100% Fee Waiver + Laptop & Books' : '100% Waiver + Laptop & Books'}
                </td>
              </tr>

              <tr className="bg-cyan-950/20 hover:bg-cyan-950/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">80 - 89</td>
                <td className="py-3.5 px-4 font-mono text-white">80% - 89%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs">
                    50% Half Scholarship
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {lang === 'ur' ? 'زیادہ سے زیادہ 1 تا 2 طلبہ' : lang === 'roman' ? 'Ziyada se ziyada 1-2 students' : 'Max 1 to 2 Students'}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {lang === 'ur' ? '50% تعلیمی فیس معافی' : lang === 'roman' ? '50% Tuition Fee Waiver' : '50% Tuition Fee Waiver'}
                </td>
              </tr>

              <tr className="bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-300">60 - 79</td>
                <td className="py-3.5 px-4 font-mono text-white">60% - 79%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs">
                    25% Quarter Scholarship
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {lang === 'ur' ? 'بقیہ تمام پاس طلبہ' : lang === 'roman' ? 'Baqi tamam pass students' : 'All Remaining Pass Students'}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {lang === 'ur' ? '25% فیس معافی اسکالرشپ' : lang === 'roman' ? '25% Fee Waiver' : '25% Fee Waiver'}
                </td>
              </tr>

              <tr className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-300">40 - 59</td>
                <td className="py-3.5 px-4 font-mono text-slate-300">40% - 59%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 border border-slate-600 font-bold text-xs">
                    Merit Pass Certificate
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">-</td>
                <td className="py-3.5 px-4 text-slate-400">
                  {lang === 'ur' ? 'ایڈمشن سرٹیفکیٹ' : lang === 'roman' ? 'Admission Certificate' : 'Admission Certificate'}
                </td>
              </tr>

              <tr className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-rose-400">&lt; 40</td>
                <td className="py-3.5 px-4 font-mono text-rose-400">&lt; 40%</td>
                <td className="py-3.5 px-4 text-slate-400">
                  {lang === 'ur' ? 'ری ٹیسٹ و بہتری درکار' : lang === 'roman' ? 'Re-test & Improvement' : 'Improvement Required'}
                </td>
                <td className="py-3.5 px-4 text-slate-400">-</td>
                <td className="py-3.5 px-4 text-slate-400">
                  {lang === 'ur' ? 'مفت آن لائن رہنمائی' : lang === 'roman' ? 'Free Mentorship' : 'Free Mentorship'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Candidates Leaderboard */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>
                {lang === 'ur'
                  ? 'طلبہ کی لائیو میرٹ لسٹ اور پوزیشن بورڈ'
                  : lang === 'roman'
                  ? 'Students Ki Live Merit List Aur Position Board'
                  : 'Live Merit Leaderboard & Rankings'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ur'
                ? 'امتحان دینے والے تمام طلبہ کی موجودہ رینکنگ اور الاٹ کردہ اسکالرشپ'
                : lang === 'roman'
                ? 'Tamam candidates ki current ranking aur allotted scholarships'
                : 'Live standings of examined candidates and allocated scholarships'}
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 px-3 py-1 bg-slate-900 rounded-xl border border-slate-700">
            Total Candidates: {sortedSubmissions.length}
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-700">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] font-mono border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'رینک' : lang === 'roman' ? 'Rank' : 'Rank'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'طالب علم کا نام و رول نمبر' : lang === 'roman' ? 'Student Name & Roll No' : 'Student'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'درجہ / اسکول' : lang === 'roman' ? 'Grade / School' : 'Grade / School'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'حاصل کردہ فیصد' : lang === 'roman' ? 'Percentage' : 'Percentage'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'اسکالرشپ نشست' : lang === 'roman' ? 'Scholarship' : 'Scholarship Tier'}</th>
                <th className="py-3.5 px-4">{lang === 'ur' ? 'اسٹیٹس' : lang === 'roman' ? 'Status' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-medium">
              {sortedSubmissions.map((sub, idx) => {
                const rank = idx + 1;
                const isCurrent = sub.studentId.toLowerCase() === currentStudentId.toLowerCase();
                const tier = sub.evaluationReport?.scholarshipRecommendation?.tier;

                return (
                  <tr
                    key={sub.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600/20 border-l-4 border-indigo-500 font-semibold'
                        : 'hover:bg-slate-700/30'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {rank === 1 ? (
                        <span className="inline-flex items-center gap-1 text-amber-400">
                          <Trophy className="w-4 h-4" /> #1
                        </span>
                      ) : rank === 2 || rank === 3 ? (
                        <span className="inline-flex items-center gap-1 text-cyan-400">
                          <Award className="w-4 h-4" /> #{rank}
                        </span>
                      ) : (
                        <span className="text-slate-400">#{rank}</span>
                      )}
                    </td>

                    {/* Student name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{sub.student.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ID: {sub.studentId}
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{sub.student.grade}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {sub.student.school || 'Academic Board'}
                      </div>
                    </td>

                    {/* Score / Percentage */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-base">
                      {sub.finalPercentage}%
                    </td>

                    {/* Scholarship Tier Badge */}
                    <td className="py-3.5 px-4">
                      {tier === 'Platinum' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
                          100% Full (Rank 1)
                        </span>
                      ) : tier === 'Silver' ? (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs">
                          50% Half
                        </span>
                      ) : tier === 'Bronze' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs">
                          25% Quarter
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-xs">
                          Merit Pass
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-xs">
                      {sub.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                        </span>
                      ) : (
                        <span className="text-amber-400 font-mono">
                          In Review
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
