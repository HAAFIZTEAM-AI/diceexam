import { Question, DifficultyLevel, QuestionOption } from '../types';
import { isScienceRelated, filterOutScienceQuestions } from './scienceFilter';
import { QUESTION_SLOT_POOLS } from '../data/logicQuestionVariants';

/**
 * Digital Institute of Computer Education (DICE)
 * Specialized 25-Question Diagnostic Assessment Engine
 * 
 * Research-Backed Diagnostic Blueprint:
 * 1. Cognitive IQ & Analytical Logic (Questions 1 - 8)
 *    - Arithmetic & Interleaved Number Progressions
 *    - Relational & Deductive Grids
 *    - Matrix Equations & Spatial Reasoning
 *    - Rate / Computational Problem Solving
 * 
 * 2. Computer Aptitude & Algorithmic Logic (Questions 9 - 17)
 *    - Execution Sequences & Instruction Order
 *    - Conditional Logic (IF-THEN-ELSE Rules)
 *    - Loop & Iteration Tracing
 *    - Binary & Switch Combinatorics
 *    - Storage, File Capacity & Memory Optimization
 *    - Debugging & Error Detection
 *    - Search Efficiency (Halving / Binary Search)
 *    - Core Computer Architecture & Hardware Logic
 *    - Active IT Creator vs Passive Consumer Aptitude
 * 
 * 3. Smart Mustahiq Identification, Grit & Ethics (Questions 18 - 25)
 *    - Resourcefulness under Loadshedding & Shared Devices
 *    - Household Budgeting & Stewardship under Hardship
 *    - Dignified Tech-Based Livelihood for Family Support
 *    - Academic Integrity & Digital Ethics
 *    - Grit & Emotional Resilience in IT Debugging
 *    - Cyber Fraud Awareness & Family Protection
 *    - Social Uplift & Teaching Underprivileged Children
 *    - Comprehensive Written Vision & Authentic Need Statement
 * 
 * STRICT CONSTRAINT: ZERO SCIENCE QUESTIONS.
 * TOTAL QUESTIONS: EXACTLY 25.
 * UNIFIED EXAM: SINGLE CONTINUOUS PART.
 */

// Simple seeded PRNG for procedural variations (ensuring unique values/distractors per candidate)
class SeededRandom {
  private seed: number;

  constructor(seedStr: string | number) {
    if (typeof seedStr === 'string') {
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
      }
      this.seed = Math.abs(hash) || 1234567;
    } else {
      this.seed = Math.abs(seedStr) || 1234567;
    }
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

/**
 * Builds the 25-Question Exam Paper tailored to the student.
 * Parameterized with candidate seed so numbers and choices vary intelligently.
 */
export function generateExamPaperForCandidate(
  studentId: string,
  options: {
    isHafiz?: boolean;
    sessionTimestamp?: number;
  } = {}
): Question[] {
  const { sessionTimestamp = Math.floor(Date.now() / (1000 * 60 * 30)) } = options;
  const seedString = `${studentId.trim().toUpperCase()}_${sessionTimestamp}`;
  const rng = new SeededRandom(seedString);

  // Helper to construct randomized MCQ options
  const makeMcq = (
    id: string,
    rawOptions: { text: string; textUrdu: string; textRoman?: string; isCorrect?: boolean }[],
    baseQuestion: Omit<Question, 'id' | 'options' | 'correctAnswer'>
  ): Question => {
    const shuffled = rng.shuffle(rawOptions);
    let correctId = 'opt_1';
    const finalOptions: QuestionOption[] = shuffled.map((opt, idx) => {
      const optId = `opt_${idx + 1}`;
      if (opt.isCorrect) correctId = optId;
      return {
        id: optId,
        text: opt.text,
        textUrdu: opt.textUrdu,
        textRoman: opt.textRoman,
      };
    });

    return {
      ...baseQuestion,
      id,
      options: finalOptions,
      correctAnswer: correctId,
    };
  };

  const paper: Question[] = [];

  // =========================================================================
  // SECTION A: COGNITIVE IQ & LOGICAL REASONING (Questions 1 - 8)
  // =========================================================================

  // Q1: Arithmetic Multiplier Pattern: double and add 1
  const q1Base = rng.choice([2, 3, 4]);
  const s1 = q1Base;
  const s2 = s1 * 2 + 1;
  const s3 = s2 * 2 + 1;
  const s4 = s3 * 2 + 1;
  const s5 = s4 * 2 + 1;
  const sAns = s5 * 2 + 1;
  paper.push(
    makeMcq(
      'dice_q1_iq_seq',
      [
        { text: `${sAns}`, textUrdu: `${sAns}`, isCorrect: true },
        { text: `${sAns - 2}`, textUrdu: `${sAns - 2}` },
        { text: `${sAns + 4}`, textUrdu: `${sAns + 4}` },
        { text: `${s5 * 2}`, textUrdu: `${s5 * 2}` },
      ],
      {
        text: `Find the next number in the logical series: ${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ?`,
        textUrdu: `اس منطقی سلسلے کا اگلا عدد معلوم کریں: ${s1}، ${s2}، ${s3}، ${s4}، ${s5}، ؟`,
        textRoman: `Is series ka agla number dhoondein: ${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ?`,
        category: 'iq_logic',
        subcategory: 'عددی منطق و سلسلہ (Number Pattern Logic)',
        difficultyLevel: 5,
        cognitiveSkill: 'analyzing',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'Rule: Multiply each number by 2 and add 1 to get the next number.',
        hintUrdu: 'اشارہ (30% رہنمائی): پچھلے عدد کو 2 سے ضرب دیں اور پھر 1 جمع کریں۔',
        hintRoman: 'Hint: Pichle number ko 2 se multiply karein aur 1 add karein.',
        explanation: `Each term is calculated by (previous × 2) + 1. ${s5} × 2 + 1 = ${sAns}.`,
        explanationUrdu: `ہر اگلا عدد پچھلے عدد کو 2 سے ضرب دے کر 1 جمع کرنے سے حاصل ہوتا ہے۔ ${s5} × 2 + 1 = ${sAns}۔`,
        emotionalTone: 'encouraging',
        phase: 1,
      }
    )
  );

  // Q2: Dual Interleaved Alternating Sequence
  // Track 1 (+4): 6, 10, 14, 18. Track 2 (-3): 30, 27, 24, 21.
  // Series: 6, 30, 10, 27, 14, 24, 18, ? -> Answer: 21
  paper.push(
    makeMcq(
      'dice_q2_iq_dual',
      [
        { text: '21', textUrdu: '21', isCorrect: true },
        { text: '22', textUrdu: '22' },
        { text: '20', textUrdu: '20' },
        { text: '26', textUrdu: '26' },
      ],
      {
        text: 'What number replaces the question mark in this alternating series? 6, 30, 10, 27, 14, 24, 18, ?',
        textUrdu: 'اس دہری ترتیب والی سیریز میں سوالیہ نشان کی جگہ کون سا عدد آئے گا؟ 6، 30، 10، 27، 14، 24، 18، ؟',
        textRoman: 'Is alternating series mein question mark ki jagah kya aayega? 6, 30, 10, 27, 14, 24, 18, ?',
        category: 'iq_logic',
        subcategory: 'دہری متوازی سیریز (Interleaved Series)',
        difficultyLevel: 6,
        cognitiveSkill: 'analyzing',
        questionType: 'mcq',
        estimatedTimeSec: 75,
        hint: 'Hint: Notice that there are two alternating patterns: the odd positions increase by 4, while the even positions decrease by 3.',
        hintUrdu: 'اشارہ (30% رہنمائی): اس میں دو الگ سلسلے چل رہے ہیں؛ طاق جگہوں پر 4 کا اضافہ ہو رہا ہے اور جفت جگہوں پر 3 کی کمی ہو رہی ہے۔',
        hintRoman: 'Hint: Do series mix hain: aik mein 4 barh raha hai aur doosri mein 3 kam ho raha hai.',
        explanation: 'The even terms are decreasing by 3: 30 -> 27 -> 24 -> 21.',
        explanationUrdu: 'دوسری متوازی سیریز 30، 27، 24 میں 3 کم ہو رہا ہے، لہٰذا اگلا عدد 21 ہے۔',
        emotionalTone: 'challenging',
        phase: 1,
      }
    )
  );

  // Q3: Relational Deduction Grid
  paper.push(
    makeMcq(
      'dice_q3_iq_deduction',
      [
        { text: 'Zahid', textUrdu: 'زاہد', textRoman: 'Zahid', isCorrect: true },
        { text: 'Kamran', textUrdu: 'کامران', textRoman: 'Kamran' },
        { text: 'Bilal', textUrdu: 'بلال', textRoman: 'Bilal' },
        { text: 'Farhan', textUrdu: 'فرحان', textRoman: 'Farhan' },
      ],
      {
        text: 'Kamran scored higher than Bilal. Farhan scored lower than Bilal. Zahid scored higher than Kamran. Who achieved the top highest score?',
        textUrdu: 'کامران نے بلال سے زیادہ نمبر حاصل کیے۔ فرحان کے نمبر بلال سے کم رہے۔ جبکہ زاہد نے کامران سے بھی زیادہ نمبر لیے۔ سب سے زیادہ نمبر کس کے ہیں؟',
        textRoman: 'Kamran ke number Bilal se zyada hain. Farhan ke Bilal se kam hain. Zahid ke Kamran se zyada hain. Sab se top par kon hai?',
        category: 'iq_logic',
        subcategory: 'منطقی ترتیب و تقابل (Comparative Deduction)',
        difficultyLevel: 5,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'Arrange in descending order: Zahid > Kamran > Bilal > Farhan.',
        hintUrdu: 'اشارہ (30% رہنمائی): تمام طلبہ کو زیادہ سے کم نمبروں کی ترتیب میں رکھ کر موازنہ کریں۔',
        hintRoman: 'Hint: Zyada se kam ki tarteeb banayein.',
        explanation: 'Ranking order: Zahid > Kamran > Bilal > Farhan. Zahid is at the top.',
        explanationUrdu: 'ترتیب: زاہد > کامران > بلال > فرحان۔ سب سے اوپر زاہد ہے۔',
        emotionalTone: 'neutral',
        phase: 1,
      }
    )
  );

  // Q4: Matrix Equation Logic (a² + b²)
  paper.push(
    makeMcq(
      'dice_q4_iq_matrix',
      [
        { text: '61', textUrdu: '61', isCorrect: true },
        { text: '55', textUrdu: '55' },
        { text: '72', textUrdu: '72' },
        { text: '30', textUrdu: '30' },
      ],
      {
        text: 'If (2 , 3) = 13 and (3 , 4) = 25 and (4 , 5) = 41, then what is (5 , 6) = ?',
        textUrdu: 'اگر (2 ، 3) = 13 اور (3 ، 4) = 25 اور (4 ، 5) = 41 ہو، تو (5 ، 6) = کیا ہوگا؟',
        textRoman: 'Agar (2 , 3) = 13 aur (3 , 4) = 25 aur (4 , 5) = 41 hai, toh (5 , 6) = kya hoga?',
        category: 'iq_logic',
        subcategory: 'مربعات کا حسابی فارمولا (Squared Logic)',
        difficultyLevel: 7,
        cognitiveSkill: 'analyzing',
        questionType: 'mcq',
        estimatedTimeSec: 80,
        hint: 'Square both numbers and add them together: 2² + 3² = 4 + 9 = 13.',
        hintUrdu: 'اشارہ (30% رہنمائی): دونوں اعداد کا مربع (Square) لے کر باہم جمع کریں۔',
        hintRoman: 'Hint: Dono numbers ka square le kar jama karein.',
        explanation: '5² + 6² = 25 + 36 = 61.',
        explanationUrdu: '5 کا مربع 25 اور 6 کا مربع 36 ہے۔ 25 + 36 = 61۔',
        emotionalTone: 'challenging',
        phase: 1,
      }
    )
  );

  // Q5: Verbal Functional Analogy (Architecture & Construction)
  paper.push(
    makeMcq(
      'dice_q5_iq_analogy',
      [
        { text: 'Software : Application', textUrdu: 'سافٹ ویئر : کمپیوٹر ایپلیکیشن', textRoman: 'Software : Application', isCorrect: true },
        { text: 'Pen : Paper', textUrdu: 'قلم : کاغذ', textRoman: 'Pen : Paper' },
        { text: 'Car : Road', textUrdu: 'گاڑی : سڑک', textRoman: 'Car : Road' },
        { text: 'Tree : Leaf', textUrdu: 'درخت : پتہ', textRoman: 'Tree : Leaf' },
      ],
      {
        text: 'BRICK is to BUILDING as CODE is to: ?',
        textUrdu: 'جس طرح "اینٹ" سے "عمارت" بنتی ہے، اسی طرح کمپیوٹر "کوڈ (Code)" سے کیا تخلیق ہوتا ہے؟',
        textRoman: 'Jis tarah "Eent" se "Imarat" banti hai, usi tarah "Code" se kya banta hai?',
        category: 'iq_logic',
        subcategory: 'تعمیری تشبیہ و باہمی تعلق (Functional Analogy)',
        difficultyLevel: 4,
        cognitiveSkill: 'applying',
        questionType: 'mcq',
        estimatedTimeSec: 45,
        hint: 'Bricks are the fundamental building blocks of a building, just like code is the building block of software.',
        hintUrdu: 'اشارہ (30% رہنمائی): اینٹ عمارت کا بنیادی جزو ہے، سوچیے کوڈ کس کا بنیادی تعمیری جزو ہے۔',
        hintRoman: 'Hint: Code kis cheez ko create karne ke liye likha jata hai.',
        explanation: 'Just as individual bricks assemble to construct a building, individual lines of code construct software.',
        explanationUrdu: 'جس طرح اینٹوں سے عمارت کی تعمیر ہوتی ہے، کوڈ کے مجموعے سے سافٹ ویئر یا ایپ بنتی ہے۔',
        emotionalTone: 'encouraging',
        phase: 1,
      }
    )
  );

  // Q6: Venn & Deductive Reasoning
  paper.push(
    makeMcq(
      'dice_q6_iq_deduction2',
      [
        { text: 'All programmers understand problem solving.', textUrdu: 'تمام پروگرامرز مسائل کا منطقی حل سمجھتے ہیں۔', textRoman: 'Tamam programmers masail ka hal samajhte hain.', isCorrect: true },
        { text: 'All computer users are programmers.', textUrdu: 'کمپیوٹر استعمال کرنے والے تمام افراد پروگرامر ہیں۔', textRoman: 'Tamam users programmer hain.' },
        { text: 'Programming requires no logical practice.', textUrdu: 'پروگرامنگ کے لیے منطق کی ضرورت نہیں ہوتی۔', textRoman: 'Programming mein logic ki zaroorat nahi.' },
        { text: 'Only adults can learn logic.', textUrdu: 'صرف بڑے لوگ ہی منطق سیکھ سکتے ہیں۔', textRoman: 'Sirf baray log logic seekh sakte hain.' },
      ],
      {
        text: 'Statement 1: All programmers understand logic.\nStatement 2: All people who understand logic can solve structured problems.\nWhat logically follows from these statements?',
        textUrdu: 'بیان 1: تمام پروگرامرز منطق (Logic) کو سمجھتے ہیں۔\nبیان 2: جو بھی منطق سمجھتا ہے وہ مسائل کا منظم حل نکال سکتا ہے۔\nاس سے کون سا حتمی نتیجہ ثابت ہوتا ہے؟',
        textRoman: 'Bayan 1: Tamam programmers logic samajhte hain. Bayan 2: Jo logic samajhta hai wo problems solve karta hai. Logical conclusion kya hai?',
        category: 'iq_logic',
        subcategory: 'منطقی استنباط (Deductive Syllogism)',
        difficultyLevel: 5,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'If A implies B, and B implies C, then A must imply C.',
        hintUrdu: 'اشارہ (30% رہنمائی): اگر پہلا گروہ دوسرے سے جڑا ہے اور دوسرا تیسرے سے، تو پہلا براہِ راست تیسرے سے جڑ جائے گا۔',
        hintRoman: 'Hint: Agar A se B aur B se C nikalta hai toh A se C lazmi niklay ga.',
        explanation: 'Programmers -> Understand Logic -> Solve Structured Problems.',
        explanationUrdu: 'چونکہ پروگرامرز منطق جانتے ہیں اور منطق جاننے والے مسائل حل کرتے ہیں، اس لیے تمام پروگرامرز مسائل حل کر سکتے ہیں۔',
        emotionalTone: 'neutral',
        phase: 1,
      }
    )
  );

  // Q7: Spatial & Directional Reasoning
  paper.push(
    makeMcq(
      'dice_q7_iq_spatial',
      [
        { text: 'Facing North, 2 meters away from the turning point', textUrdu: 'شمال کی طرف رخ، موڑ سے 2 میٹر فاصلے پر', textRoman: 'Shamal (North) ki taraf rukh, 2 meter fasla', isCorrect: true },
        { text: 'Facing South, 6 meters away', textUrdu: 'جنوب کی طرف رخ، 6 میٹر فاصلے پر', textRoman: 'Janoob (South) ki taraf rukh, 6 meter fasla' },
        { text: 'Facing East, 4 meters away', textUrdu: 'مشرق کی طرف رخ، 4 میٹر فاصلے پر', textRoman: 'Mashriq (East) ki taraf rukh, 4 meter fasla' },
        { text: 'Facing West, at the starting point', textUrdu: 'مغرب کی طرف رخ، واپس شروعاتی مقام پر', textRoman: 'Maghrib (West) ki taraf rukh' },
      ],
      {
        text: 'A mini mobile robot is facing East. It turns 90 degrees right (clockwise), moves 5 meters forward, then turns 180 degrees around and moves 3 meters forward. Which direction is it now facing?',
        textUrdu: 'ایک روبوٹ مشرق (East) کی طرف منہ کر کے کھڑا ہے۔ وہ 90 ڈگری دائیں مڑ کر 5 میٹر آگے جاتا ہے، پھر 180 ڈگری الٹا مڑ کر 3 میٹر آگے چلتا ہے۔ اب اس کا رخ کس سمت میں ہے؟',
        textRoman: 'Aik robot East ki taraf khara hai. 90 degree right murr kar 5 meter agay jata hai, phir 180 degree murr kar 3 meter chalta hai. Ab rukh kis taraf hai?',
        category: 'iq_logic',
        subcategory: 'سمتی و مکانی فہم (Spatial Direction Logic)',
        difficultyLevel: 6,
        cognitiveSkill: 'analyzing',
        questionType: 'mcq',
        estimatedTimeSec: 75,
        hint: 'East + 90 degrees right turns into South. 180 degrees reverse from South turns into North.',
        hintUrdu: 'اشارہ (30% رہنمائی): مشرق سے 90 ڈگری دائیں مڑنے سے جنوب بنتا ہے، اور جنوب سے 180 ڈگری الٹا گھومنے پر شمال کی سمت بنتی ہے۔',
        hintRoman: 'Hint: East se right murrne par South, aur South se 180 ghoomne par North banta hai.',
        explanation: 'Facing East -> turn 90° right = South -> move 5m South -> turn 180° = North -> move 3m North. Robot faces North.',
        explanationUrdu: 'مشرق سے دائیں مڑ کر جنوب ہوا، پھر 180 ڈگری گھوم کر رخ شمال کی طرف ہو گیا۔',
        emotionalTone: 'neutral',
        phase: 1,
      }
    )
  );

  // Q8: Lab Efficiency & Quantitative Math
  paper.push(
    makeMcq(
      'dice_q8_iq_rate',
      [
        { text: '12 minutes', textUrdu: '12 منٹ', textRoman: '12 minutes', isCorrect: true },
        { text: '6 minutes', textUrdu: '6 منٹ', textRoman: '6 minutes' },
        { text: '18 minutes', textUrdu: '18 منٹ', textRoman: '18 minutes' },
        { text: '24 minutes', textUrdu: '24 منٹ', textRoman: '24 minutes' },
      ],
      {
        text: 'In a computer lab, 4 high-speed printers can print 240 scholarship examination papers in 6 minutes. If 2 printers are turned off for maintenance, how many minutes will the remaining 2 printers take to print the same 240 papers?',
        textUrdu: 'کمپیوٹر لیب کے 4 پرنٹرز 6 منٹ میں 240 امتحانی پرچے پرنٹ کرتے ہیں۔ اگر 2 پرنٹرز بند کر دیے جائیں، تو باقی 2 پرنٹرز کو وہی 240 پرچے پرنٹ کرنے میں کتنا وقت لگے گا؟',
        textRoman: 'Lab ke 4 printers 6 minute mein 240 papers print karte hain. Agar 2 printers band hon toh baaqi 2 ko 240 papers print karne mein kitne minute lagein ge?',
        category: 'math',
        subcategory: 'تناسب و رفتار کا حساب (Inverse Proportion & Speed)',
        difficultyLevel: 5,
        cognitiveSkill: 'applying',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'When the number of workers/printers is halved (from 4 to 2), the time required doubles.',
        hintUrdu: 'اشارہ (30% رہنمائی): جب پرنٹرز کی تعداد آدھی ہو جائے گی تو کام مکمل کرنے کا وقت دوگنا ہو جائے گا۔',
        hintRoman: 'Hint: Printers aadhay honay se waqt double ho jata hai.',
        explanation: 'Printers and time are inversely proportional. 4 printers take 6 mins, so 2 printers will take 6 × 2 = 12 mins.',
        explanationUrdu: 'پرنٹرز آدھے ہو گئے، اس لیے وقت دوگنا ہو کر 6 × 2 = 12 منٹ لگے گا۔',
        emotionalTone: 'encouraging',
        phase: 1,
      }
    )
  );

  // =========================================================================
  // SECTION B: COMPUTER APTITUDE, ALGORITHMIC LOGIC & TECH (Questions 9 - 17)
  // =========================================================================

  // Q9: Algorithmic Step-by-Step Order of Execution
  paper.push(
    makeMcq(
      'dice_q9_algo_sequence',
      [
        { text: 'Step 3 -> Step 1 -> Step 4 -> Step 2', textUrdu: 'مرحلہ 3 ← مرحلہ 1 ← مرحلہ 4 ← مرحلہ 2', isCorrect: true },
        { text: 'Step 1 -> Step 2 -> Step 3 -> Step 4', textUrdu: 'مرحلہ 1 ← مرحلہ 2 ← مرحلہ 3 ← مرحلہ 4' },
        { text: 'Step 2 -> Step 4 -> Step 1 -> Step 3', textUrdu: 'مرحلہ 2 ← مرحلہ 4 ← مرحلہ 1 ← مرحلہ 3' },
        { text: 'Step 4 -> Step 3 -> Step 2 -> Step 1', textUrdu: 'مرحلہ 4 ← مرحلہ 3 ← مرحلہ 2 ← مرحلہ 1' },
      ],
      {
        text: 'A student is designing a computer program to calculate the average test score for 50 candidates. Arrange the logical steps in correct sequence:\n1. Add all student scores into total\n2. Display final average on screen\n3. Input and read student marks\n4. Divide total sum by 50',
        textUrdu: 'ایک طالب علم 50 طلبہ کے اوسط مارکس نکالنے کے لیے کمپیوٹر پروگرام لکھ رہا ہے۔ ان مراحل کی درست ترین منطقی ترتیب کیا ہوگی؟\n1. تمام طلبہ کے نمبرز جمع کرنا\n2. اسکرین پر حتمی اوسط دکھانا\n3. طلبہ کے نمبرز کمپیوٹر میں درج کرنا (Input)\n4. کل رقم کو 50 پر تقسیم کرنا',
        textRoman: 'Average marks calculate karne ke liye steps ki theek tarteeb kya hai? 1: Jama karna, 2: Screen par dikhana, 3: Input lena, 4: Divide karna.',
        category: 'critical',
        subcategory: 'الگورتھم کی منطقی ترتیب (Algorithmic Sequencing)',
        difficultyLevel: 5,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'First you must Input data (3), then Calculate total (1), then Divide (4), and finally Output (2).',
        hintUrdu: 'اشارہ (30% رہنمائی): پہلے ڈیٹا وصول ہوگا (Input)، پھر جمع، پھر تقسیم، اور آخر میں نتیجہ دکھایا جائے گا (Output)۔',
        hintRoman: 'Hint: Pehle input, phir process (sum + divide), aur aakhir mein output.',
        explanation: 'Correct execution flow: Input (3) -> Sum (1) -> Divide (4) -> Output (2).',
        explanationUrdu: 'درست کمپیوٹر پروسیسنگ ترتیب: ڈیٹا ان پٹ (3) ← سم کرنا (1) ← تقسیم (4) ← آؤٹ پٹ (2)۔',
        emotionalTone: 'encouraging',
        phase: 2,
      }
    )
  );

  // Q10: Conditional IF-THEN-ELSE Rules
  paper.push(
    makeMcq(
      'dice_q10_algo_conditional',
      [
        { text: '50% Scholarship Awarded', textUrdu: '50% اسکالرشپ الاٹ ہوگی', textRoman: '50% Scholarship milegi', isCorrect: true },
        { text: '100% Full Scholarship Awarded', textUrdu: '100% مکمل اسکالرشپ الاٹ ہوگی', textRoman: '100% Full scholarship milegi' },
        { text: '25% Standard Merit Awarded', textUrdu: '25% میرٹ اسکالرشپ الاٹ ہوگی', textRoman: '25% Merit milegi' },
        { text: 'Application Rejected', textUrdu: 'درخواست مسترد ہوگی', textRoman: 'Application reject hogi' },
      ],
      {
        text: 'A scholarship decision program follows these rules:\nIF (Marks >= 80 AND FamilyIncome <= 30,000) THEN "100% Full"\nELSE IF (Marks >= 80 AND FamilyIncome <= 60,000) THEN "50% Scholarship"\nELSE THEN "25% Standard Merit"\nCandidate "Hamza" scored 84 Marks and his Family Income is Rs. 42,000. What does the computer output?',
        textUrdu: 'اسکالرشپ سافٹ ویئر کے فیصلے کا اصول یہ ہے:\nاگر (نمبرز >= 80 ہوں اور آمدن <= 30,000 ہو) تو "100% مکمل اسکالرشپ"\nورنہ اگر (نمبرز >= 80 ہوں اور آمدن <= 60,000 ہو) تو "50% اسکالرشپ"\nورنہ "25% معیاری اسکالرشپ"\nامیدوار حمزہ کے 84 نمبرز ہیں اور خاندانی آمدن 42,000 روپے ہے۔ کمپیوٹر کیا فیصلہ سنائے گا؟',
        textRoman: 'Software rules: Marks>=80 & Income<=30k -> 100%. Marks>=80 & Income<=60k -> 50%. Hamza ke 84 marks aur 42k income hai. Computer kya decide karega?',
        category: 'critical',
        subcategory: 'مشروط منطق (Conditional IF-THEN-ELSE)',
        difficultyLevel: 5,
        cognitiveSkill: 'applying',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'Hamza has 84 marks (meets >=80). His income is 42,000 (greater than 30,000, but less than 60,000). Check which condition matches.',
        hintUrdu: 'اشارہ (30% رہنمائی): حمزہ کے نمبرز 80 سے زیادہ ہیں، جبکہ آمدن 30 ہزار سے زیادہ مگر 60 ہزار سے کم ہے۔ غور کریں کون سی شرط پوری ہو رہی ہے۔',
        hintRoman: 'Hint: 84 marks hain aur 42k income 30k se zyada aur 60k se kam hai.',
        explanation: 'First condition fails because 42,000 > 30,000. Second condition matches because 84 >= 80 and 42,000 <= 60,000.',
        explanationUrdu: 'پہلی شرط پوری نہیں ہوئی کیونکہ آمدن 30 ہزار سے زیادہ ہے، مگر دوسری شرط (آمدن 60 ہزار سے کم) پوری ہونے سے 50% ملے گی۔',
        emotionalTone: 'neutral',
        phase: 2,
      }
    )
  );

  // Q11: Loop & Iteration Logic Tracing
  // Start: X = 2. Loop 3 times: X = X * 2 + 1
  // Loop 1: 2*2+1 = 5
  // Loop 2: 5*2+1 = 11
  // Loop 3: 11*2+1 = 23
  paper.push(
    makeMcq(
      'dice_q11_algo_loop',
      [
        { text: '23', textUrdu: '23', isCorrect: true },
        { text: '16', textUrdu: '16' },
        { text: '25', textUrdu: '25' },
        { text: '19', textUrdu: '19' },
      ],
      {
        text: 'In a coding algorithm, variable X starts with value 2. A loop repeats the following instruction exactly 3 times: "X = (X × 2) + 1". What is the final value of X after the loop finishes?',
        textUrdu: 'ایک کمپیوٹر پروگرام میں ویری ایبل X کی شروعاتی قیمت 2 ہے۔ ایک لوپ (Loop) اس ہدایت کو لگاتار 3 مرتبہ دہراتا ہے: "X = (X × 2) + 1"۔ لوپ کے اختتام پر X کی حتمی قیمت کیا ہوگی؟',
        textRoman: 'Variable X ki value 2 hai. Loop 3 baar ye instruction run karta hai: X = (X * 2) + 1. Loop khatam hone par final value kya hogi?',
        category: 'critical',
        subcategory: 'تکراری لوپ کا تجزیہ (Loop Iteration Tracing)',
        difficultyLevel: 6,
        cognitiveSkill: 'analyzing',
        questionType: 'mcq',
        estimatedTimeSec: 75,
        hint: 'Track step by step: Round 1 gives (2×2)+1=5. Round 2 gives (5×2)+1=11. Now calculate Round 3.',
        hintUrdu: 'اشارہ (30% رہنمائی): پہلے چکر میں (2×2)+1 = 5 ہوگا۔ دوسرے چکر میں (5×2)+1 = 11 ہوگا۔ اب تیسرے چکر کا حساب لگائیں۔',
        hintRoman: 'Hint: Pehle round mein 5, doosre mein 11. Ab teesre round ka hisab karein.',
        explanation: 'Round 1: 2×2+1=5. Round 2: 5×2+1=11. Round 3: 11×2+1=23.',
        explanationUrdu: 'پہلا چکر: 5، دوسرا چکر: 11، تیسرا چکر: 11 × 2 + 1 = 23۔',
        emotionalTone: 'challenging',
        phase: 2,
      }
    )
  );

  // Q12: Binary & Switch Logic (Combinatorics)
  // 1 switch -> 2 states (2^1). 2 switches -> 4 states (2^2). 4 switches -> 2^4 = 16.
  paper.push(
    makeMcq(
      'dice_q12_comp_binary',
      [
        { text: '16 unique states', textUrdu: '16 منفرد کوڈز یا کیفیات', textRoman: '16 unique codes', isCorrect: true },
        { text: '8 unique states', textUrdu: '8 کیفیات', textRoman: '8 unique states' },
        { text: '32 unique states', textUrdu: '32 کیفیات', textRoman: '32 unique states' },
        { text: '4 unique states', textUrdu: '4 کیفیات', textRoman: '4 unique states' },
      ],
      {
        text: 'Computers fundamentally process information using electronic binary switches (0 for OFF, 1 for ON). If 1 switch can represent 2 codes (0, 1) and 2 switches can represent 4 codes (00, 01, 10, 11), how many different codes can 4 binary switches represent?',
        textUrdu: 'کمپیوٹر بنیادی طور پر بائنری سوئچز پر کام کرتا ہے (0 یعنی بند، 1 یعنی آن)۔ اگر 1 سوئچ سے 2 کوڈ بنتے ہیں (0 یا 1) اور 2 سوئچز سے 4 کوڈ بنتے ہیں (00، 01، 10، 11)، تو بتائیے 4 بائنری سوئچز مل کر کتنے مختلف کوڈز بنا سکتے ہیں؟',
        textRoman: 'Computer binary switches par kaam karta hai. 1 switch se 2 codes, 2 switches se 4 codes. Toh 4 switches mil kar kitne codes bana sakte hain?',
        category: 'critical',
        subcategory: 'بائنری اور ڈیجیٹل سسٹم (Binary Switch Combinatorics)',
        difficultyLevel: 5,
        cognitiveSkill: 'applying',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'Formula: Every additional switch doubles the total combinations (2 × 2 × 2 × 2 = 2⁴).',
        hintUrdu: 'اشارہ (30% رہنمائی): ہر نیا سوئچ پچھلے امتزاج کو دوگنا کر دیتا ہے: 2 کی طاقت 4 (2 × 2 × 2 × 2)۔',
        hintRoman: 'Hint: Har switch se combinations double ho jate hain: 2 * 2 * 2 * 2.',
        explanation: 'Each binary switch has 2 possibilities. For 4 switches, total states = 2⁴ = 16.',
        explanationUrdu: 'ہر سوئچ کی 2 حالتیں ہوتی ہیں، پس 4 سوئچز کے کل ممکنہ کوڈز = 2 × 2 × 2 × 2 = 16 ہیں۔',
        emotionalTone: 'encouraging',
        phase: 2,
      }
    )
  );

  // Q13: Digital Storage & Capacity Management
  // 600 MB free. 4 videos @ 130 MB = 520 MB. 4 PDF assignments @ 15 MB = 60 MB. Total = 580 MB <= 600 MB.
  paper.push(
    makeMcq(
      'dice_q13_comp_storage',
      [
        { text: 'Yes, because 580 MB is needed and 20 MB will still remain free.', textUrdu: 'ہاں، کیونکہ کل 580 MB درکار ہے اور 20 MB مزید بچ جائے گی۔', textRoman: 'Haan, kyunke 580 MB chahiye aur 20 MB bach jayegi.', isCorrect: true },
        { text: 'No, because it exceeds the phone memory by 50 MB.', textUrdu: 'نہیں، کیونکہ یہ فون میموری سے 50 MB زیادہ بنتا ہے۔', textRoman: 'Nahi, space kam parh jayegi.' },
        { text: 'No, computer videos cannot be saved on mobile.', textUrdu: 'نہیں، کمپیوٹر کی ویڈیوز موبائل میں محفوظ نہیں ہو سکتیں۔', textRoman: 'Nahi, videos save nahi ho sakein gi.' },
        { text: 'Yes, exactly 600 MB will be filled completely to 0 MB.', textUrdu: 'ہاں، بالکل پورا 600 MB بھر جائے گا اور صفر بچے گا۔', textRoman: 'Haan, pura 600 MB pack ho jayega.' },
      ],
      {
        text: 'A student has exactly 600 Megabytes (MB) free storage space on their device. To complete their DICE homework, they need to download 4 programming lesson videos (130 MB each) and 4 coding practice PDFs (15 MB each). Can they download all files?',
        textUrdu: 'ایک طالب علم کے موبائل میں 600 میگا بائٹس (MB) جگہ خالی ہے۔ ہوم ورک کے لیے اسے 4 تدریسی ویڈیوز (ہر ویڈیو 130 MB) اور 4 اسائنمنٹ فائلیں (ہر فائل 15 MB) ڈاؤن لوڈ کرنی ہیں۔ کیا یہ تمام فائلیں محفوظ ہو جائیں گی؟',
        textRoman: 'Mobile mein 600 MB space free hai. 4 videos (130 MB each) aur 4 PDFs (15 MB each) download karni hain. Kya space poori ho jayegi?',
        category: 'math',
        subcategory: 'ڈیجیٹل میموری و ڈیٹا مینجمنٹ (Digital Storage Logic)',
        difficultyLevel: 5,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'Calculate total required space: (4 × 130) + (4 × 15) = 520 + 60.',
        hintUrdu: 'اشارہ (30% رہنمائی): کل مطلوبہ جگہ کا حساب لگائیں: 4 ویڈیوز = 520 MB، اور 4 فائلیں = 60 MB۔',
        hintRoman: 'Hint: Total space calculate karein: (4 * 130) + (4 * 15).',
        explanation: 'Total needed = (4 × 130 MB) + (4 × 15 MB) = 520 + 60 = 580 MB. Since 580 < 600, it fits with 20 MB remaining.',
        explanationUrdu: 'کل جگہ = 520 + 60 = 580 MB۔ چونکہ 580 MB دستیاب 600 MB سے کم ہے، اس لیے 20 MB مزید بچ بھی جائے گی۔',
        emotionalTone: 'encouraging',
        phase: 2,
      }
    )
  );

  // Q14: Debugging & Error Detection
  paper.push(
    makeMcq(
      'dice_q14_algo_debug',
      [
        { text: 'The order of subtraction is reversed; it should be (Paid - Price).', textUrdu: 'تفریق کی ترتیب الٹ لکھی گئی ہے؛ درست فارمولا (Paid - Price) ہونا چاہیے۔', textRoman: 'Tafreeq ka formula ulta hai; (Paid - Price) hona chahiye.', isCorrect: true },
        { text: 'The computer does not know what rupees are.', textUrdu: 'کمپیوٹر کو معلوم نہیں تھا کہ روپے کیا ہوتے ہیں۔', textRoman: 'Computer ko rupees ka pata nahi tha.' },
        { text: 'Minus signs are never allowed in software.', textUrdu: 'کمپیوٹر پروگرامنگ میں مائنس کی علامت ممنوع ہے۔', textRoman: 'Minus sign allowed nahi hota.' },
        { text: 'The book price was too high.', textUrdu: 'کتاب کی قیمت ضرورت سے زیادہ تھی۔', textRoman: 'Book price bohot zyada thi.' },
      ],
      {
        text: 'A beginner student wrote code to calculate change given to customers: "Change = Price - Paid". When a customer bought an 800 rupee book and paid a 1,000 rupee note, the computer printed "-200 Rupees". What is the programmatic bug?',
        textUrdu: 'ایک نوآموز طالب علم نے بقایا رقم (Change) نکالنے کا فارمولا لکھا: "Change = Price - Paid"۔ جب گاہک نے 800 روپے کی کتاب خریدی اور 1000 روپے کا نوٹ دیا، تو کمپیوٹر نے بقایا "-200 روپے" دکھایا۔ اس پروگرام میں کیا غلطی ہے؟',
        textRoman: 'Programmer ne formula likha: Change = Price - Paid. Customer ne 800 ki book ke 1000 diye toh computer ne -200 dikhaya. Bug kya hai?',
        category: 'critical',
        subcategory: 'ڈیبگنگ اور غلطی کی نشاندہی (Debugging Logic)',
        difficultyLevel: 4,
        cognitiveSkill: 'analyzing',
        questionType: 'mcq',
        estimatedTimeSec: 50,
        hint: 'Change should be how much money was paid minus the cost of the item.',
        hintUrdu: 'اشارہ (30% رہنمائی): بقایا رقم نکالنے کے لیے دی گئی رقم میں سے قیمت منہا کی جاتی ہے، الٹ نہیں۔',
        hintRoman: 'Hint: Paid amount mein se price minus honi chahiye.',
        explanation: '800 - 1000 = -200. The correct formula is Paid - Price (1000 - 800 = +200).',
        explanationUrdu: 'طالب علم نے 800 میں سے 1000 نکالے جس سے -200 آیا۔ درست فارمولا Paid - Price یعنی 1000 - 800 = 200 روپے ہونا چاہیے۔',
        emotionalTone: 'supportive',
        phase: 2,
      }
    )
  );

  // Q15: Search Efficiency (Binary Search Intuition)
  paper.push(
    makeMcq(
      'dice_q15_comp_efficiency',
      [
        { text: 'Open in the middle and divide in half each time (Binary Search)', textUrdu: 'درمیان میں سے کھول کر ہر بار فہرست کو آدھا کرتے جائیں (بائنری سرچ)', textRoman: 'Darmian se khol kar har baar aadha karte jayein', isCorrect: true },
        { text: 'Start reading every page from page 1 to 1000 one by one', textUrdu: 'صفحہ 1 سے لے کر 1000 تک ایک ایک کر کے تمام نام پڑھیں', textRoman: 'Page 1 se 1000 tak aik aik karke parhein' },
        { text: 'Start from the last page and read backwards', textUrdu: 'آخری صفحے سے شروع کر کے الٹا پڑھیں', textRoman: 'Aakhri page se ulta parhein' },
        { text: 'Pick pages at random and hope to get lucky', textUrdu: 'آنکھیں بند کر کے بغیر ترتیب کے صفحات پلٹیں', textRoman: 'Random pages check karein' },
      ],
      {
        text: 'Suppose you have a printed dictionary of 1,000 pages arranged alphabetically from A to Z. What is the fastest and smartest logical method to find a specific word like "Python"?',
        textUrdu: 'فرض کریں آپ کے پاس 1,000 صفحات کی حروفِ تہجی (A تا Z) کی ترتیب میں رکھی ڈکشنری ہے۔ کسی مخصوص لفظ جیسے "Python" کو ڈھونڈنے کا سب سے تیز رفتار اور سمارٹ ترین منطقی طریقہ کیا ہے؟',
        textRoman: '1,000 pages ki A-to-Z dictionary mein kisi word ko dhoondne ka sab se fastest aur smart treeqa kya hai?',
        category: 'critical',
        subcategory: 'الگورتھمک کارکردگی و تلاش (Search Optimization)',
        difficultyLevel: 5,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'Because the data is sorted alphabetically, you can eliminate half the book with a single comparison.',
        hintUrdu: 'اشارہ (30% رہنمائی): چونکہ کتاب حروفِ تہجی کی ترتیب میں ہے، ہر بار درمیان سے چیک کر کے آپ آدھی کتاب فوراً خارج کر سکتے ہیں۔',
        hintRoman: 'Hint: Har step par aadha book eliminate ho jata hai.',
        explanation: 'Binary search splits the sorted search space in half repeatedly, requiring at most 10 checks for 1,000 pages (2¹⁰ = 1024).',
        explanationUrdu: 'اس طریقہ کار کو کمپیوٹر سائنس میں بائنری سرچ (Binary Search) کہتے ہیں جس سے 1,000 صفحات صرف 10 کوششوں میں چھانٹے جا سکتے ہیں۔',
        emotionalTone: 'encouraging',
        phase: 2,
      }
    )
  );

  // Q16: Computer Hardware Architecture & Functions
  paper.push(
    makeMcq(
      'dice_q16_comp_hardware',
      [
        { text: 'Central Processing Unit (CPU / Processor)', textUrdu: 'سی پی یو یا پروسیسر (CPU / Processor)', textRoman: 'Central Processing Unit (CPU)', isCorrect: true },
        { text: 'Computer Screen / Monitor', textUrdu: 'کمپیوٹر مانیٹر یا اسکرین', textRoman: 'Computer Monitor' },
        { text: 'Computer Keyboard', textUrdu: 'کمپیوٹر کی بورڈ', textRoman: 'Computer Keyboard' },
        { text: 'External Power Cable', textUrdu: 'بجلی کی بیرونی تار', textRoman: 'Power Cable' },
      ],
      {
        text: 'Which internal hardware component is known as the "Brain of the Computer" that executes mathematical calculations and logical decisions?',
        textUrdu: 'کمپیوٹر کا وہ کون سا بنیادی اندرونی حصہ ہے جسے "کمپیوٹر کا دماغ" کہا جاتا ہے اور جو تمام حسابی و منطقی فیصلے کرتا ہے؟',
        textRoman: 'Computer ka "Brain" kis part ko kaha jata hai jo tamaam calculations aur logical decisions karta hai?',
        category: 'critical',
        subcategory: 'کمپیوٹر سسٹمز فہم (Hardware Architecture)',
        difficultyLevel: 3,
        cognitiveSkill: 'remembering',
        questionType: 'mcq',
        estimatedTimeSec: 30,
        hint: 'It processes instructions and performs logic; commonly abbreviated as CPU.',
        hintUrdu: 'اشارہ (30% رہنمائی): یہ وہ یونٹ ہے جو تمام ہدایات پر عمل درآمد کرواتا ہے، اسے مختصر طور پر CPU کہتے ہیں۔',
        hintRoman: 'Hint: Isay CPU bhi kehte hain.',
        explanation: 'The CPU (Central Processing Unit) carries out instructions and controls operations inside the computer system.',
        explanationUrdu: 'سی پی یو (CPU) کو کمپیوٹر کا دماغ کہا جاتا ہے کیونکہ یہ تمام ہدایات اور حساب کتاب کو کنٹرول کرتا ہے۔',
        emotionalTone: 'neutral',
        phase: 2,
      }
    )
  );

  // Q17: IT Aptitude: Creator vs Passive Consumer
  paper.push(
    makeMcq(
      'dice_q17_comp_interest',
      [
        { text: 'A student who is curious about how apps are coded and builds digital projects to solve real problems', textUrdu: 'وہ طالب علم جو یہ جاننے کا تجسس رکھتا ہے کہ ایپس اور ویب سائٹس کیسے بنتی ہیں اور وہ پروگرامنگ سے مسائل حل کرنا چاہتا ہے', textRoman: 'Jo apps aur websites banane mein dilchaspi rakhta hai aur problems solve karna chahta hai', isCorrect: true },
        { text: 'A student who plays smartphone video games 6 hours every day', textUrdu: 'وہ طالب علم جو دن میں 6 گھنٹے صرف ویڈیو گیمز کھیلتا ہے', textRoman: 'Jo sara din sirf video games khelta hai' },
        { text: 'A student who only watches funny video reels and social media', textUrdu: 'وہ جو صرف مزاحیہ ویڈیوز اور سوشل میڈیا پر وقت ضائع کرتا ہے', textRoman: 'Jo sirf funny reels dekhta hai' },
        { text: 'A student who frequently buys expensive mobile covers', textUrdu: 'وہ جو مہنگے موبائل کورز تبدیل کرتا رہتا ہے', textRoman: 'Jo mehangay mobile covers khareedta hai' },
      ],
      {
        text: 'Which student demonstrates true, authentic aptitude and high future potential in the field of Computer Technology?',
        textUrdu: 'کمپیوٹر ٹیکنالوجی اور سافٹ ویئر کے میدان میں حقیقی لگن اور شاندار مستقبل کی نشانی کس طالب علم میں پائی جاتی ہے؟',
        textRoman: 'Computer technology ke shobay mein sachay shauq aur behtareen mustaqbil ki nishani kis talib-e-ilm mein hai?',
        category: 'scholarship',
        subcategory: 'ٹیکنالوجی تخلیقی ذوق (Active IT Creator Mindset)',
        difficultyLevel: 4,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 45,
        hint: 'Focus on creation, understanding logic, and solving problems rather than mere passive consumption and entertainment.',
        hintUrdu: 'اشارہ (30% رہنمائی): صرف گیمز کھیلنے یا وقت ضائع کرنے کی بجائے تخلیق اور کوڈنگ کا تجسس اصل قابلیت ہے۔',
        hintRoman: 'Hint: Sirf entertainment nahi balke software create karne ka shauq.',
        explanation: 'Real computer aptitude is characterized by computational curiosity, problem solving, and wanting to build technology rather than just consume it.',
        explanationUrdu: 'حقیقی کمپیوٹر قابلیت اس میں ہے کہ طالب علم ٹیکنالوجی کا صارف بننے کی بجائے اس کا خالق (Creator) بنے اور مسائل حل کرے۔',
        emotionalTone: 'encouraging',
        phase: 2,
      }
    )
  );

  // =========================================================================
  // SECTION C: SMART MUSTAHIQ IDENTIFICATION, GRIT & ETHICS (Questions 18 - 25)
  // =========================================================================

  // Q18: Resourcefulness under Loadshedding & Limited Devices
  paper.push(
    makeMcq(
      'dice_q18_mustahiq_grit',
      [
        { text: 'Plan study time around power hours, write algorithms on paper during outages, and share the phone with family respectfully', textUrdu: 'بجلی کے شیڈول کے مطابق وقت طے کرنا، لوڈشیڈنگ میں کاپی پر کوڈ اور منطق لکھنا اور گھر والوں کے ساتھ باہمی احترام سے فون شیئر کرنا', textRoman: 'Bijli ke schedule ke mutabiq parhai karna, copy par code likhna aur phone time manage karna', isCorrect: true },
        { text: 'Make excuses that homework was impossible due to loadshedding', textUrdu: 'یہ بہانہ بنا کر بیٹھ جانا کہ بجلی نہ ہونے کی وجہ سے پڑھائی ناممکن ہے', textRoman: 'Bahana banana ke loadshedding thi' },
        { text: 'Quarrel with family members to monopolize the only phone all day', textUrdu: 'گھر میں اکیلے فون پر قبضہ کرنے کے لیے بہن بھائیوں سے لڑنا', textRoman: 'Ghar walon se phone ke liye larai karna' },
        { text: 'Stop attending computer classes entirely', textUrdu: 'کمپیوٹر کی کلاسز لینا ہی مکمل چھوڑ دینا', textRoman: 'Classes chhor dena' },
      ],
      {
        text: 'In an underprivileged household experiencing 4 hours of daily loadshedding and only one smartphone shared among family members, how does a truly determined student succeed at DICE?',
        textUrdu: 'ایک مستحق گھرانے میں جہاں روزانہ 4 گھنٹے بجلی بند رہتی ہو اور پورے گھر میں صرف ایک سمارٹ فون ہو، ایک باہمت اور سچا طالب علم کمپیوٹر کی تعلیم میں کیسے کامیابی حاصل کرتا ہے؟',
        textRoman: 'Agar ghar mein loadshedding ho aur aik hi phone ho, toh aik mustahiq aur ba-himmat student kaisay kamyab hota hai?',
        category: 'social_emotional',
        subcategory: 'محدود وسائل میں تدبیر و ہمت (Resourcefulness under Constraints)',
        difficultyLevel: 5,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'True grit means turning constraints into structured planning: writing algorithms in a notebook when power is gone.',
        hintUrdu: 'اشارہ (30% رہنمائی): حقیقی ہمت یہ ہے کہ بجلی نہ ہونے پر کاپی قلم پر تیاری کی جائے اور دستیاب وقت کا بہترین استعمال ہو۔',
        hintRoman: 'Hint: Mushkil halaat mein planning aur mehnat se hal nikalna.',
        explanation: 'Resourcefulness and resilience are the primary predictors of success for scholarship candidates facing financial hardship.',
        explanationUrdu: 'وسائل کی تنگی کے باوجود تدبیر اور محنت سے وقت کا انتظام کرنا ایک باصلاحیت اور مستحق طالب علم کی سچی پہچان ہے۔',
        emotionalTone: 'supportive',
        phase: 3,
      }
    )
  );

  // Q19: Household Budgeting & Stewardship under Hardship
  paper.push(
    makeMcq(
      'dice_q19_mustahiq_budget',
      [
        { text: 'Cut unnecessary personal spending, utilize family emergency savings carefully, and prioritize education as a lasting investment', textUrdu: 'غیر ضروری اخراجات بند کرنا، ہنگامی بچت کو دانشمندی سے استعمال کرنا اور تعلیم کو خاندان کی مستقل نجات کی ترجیح بنانا', textRoman: 'Ghair zaroori kharche band karna aur taleem ko pehli tarjeeh dena', isCorrect: true },
        { text: 'Borrow money on high compound interest from predatory lenders', textUrdu: 'سود خوروں سے بھاری سود پر قرض اٹھا لینا', textRoman: 'Sood par qarza lena' },
        { text: 'Spend money on expensive restaurant food to forget worries', textUrdu: 'پریشانی دور کرنے کے لیے ہوٹلنگ پر پیسے اڑا دینا', textRoman: 'Hotel par paise urrana' },
        { text: 'Ignore household bills until electricity is permanently cut off', textUrdu: 'بلوں کو نظر انداز کر دینا تاکہ بجلی کاٹ دی جائے', textRoman: 'Bills ignore karna' },
      ],
      {
        text: 'A daily-wage earning father earns Rs. 30,000 monthly. House rent is Rs. 10,000, food groceries Rs. 14,000, and utility bills Rs. 4,000. When an unexpected Rs. 2,000 educational or health expense arises, what is the wisest, most dignified family action?',
        textUrdu: 'ایک دیہاڑی دار باپ کی ماہانہ آمدن 30,000 روپے ہے۔ مکان کا کرایہ 10,000، راشن 14,000 اور بجلی و گیس کے بل 4,000 روپے ہیں۔ اگر اچانک 2,000 روپے کا تعلیمی یا طبی خرچہ آ جائے، تو سب سے دانشمندانہ اور باعزت تدبیر کیا ہوگی؟',
        textRoman: '30,000 mahana aamdan mein rent 10k, rashan 14k, bills 4k hain. 2,000 emergency kharchay ke liye sab se ba-izzat hal kya hai?',
        category: 'math',
        subcategory: 'خاندانی کفالت و مالی دانشمندی (Household Budgeting)',
        difficultyLevel: 5,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 60,
        hint: 'Dignified budgeting requires curtailing discretionary costs and safeguarding family independence without debt traps.',
        hintUrdu: 'اشارہ (30% رہنمائی): غیر ضروری اخراجات روک کر دستیاب بچت کو دانشمندی سے استعمال کرنا قرض سے بچاتا ہے۔',
        hintRoman: 'Hint: Fuzool kharchi rok kar zaroori zaroorat poori karna.',
        explanation: 'Demonstrates economic awareness, disciplined financial stewardship, and understanding of daily-wage household realities.',
        explanationUrdu: 'بچت اور کفایت شعاری سے گھر کے بجٹ کو متوازن رکھنا خودداری اور شعور کی علامت ہے۔',
        emotionalTone: 'supportive',
        phase: 3,
      }
    )
  );

  // Q20: Dignified Tech-Based Livelihood for Family Support
  paper.push(
    makeMcq(
      'dice_q20_mustahiq_earning',
      [
        { text: 'Offer legal digital document typing, graphic layouts, and online data entry to local shops and clients after classes', textUrdu: 'کلاسز کے بعد محلے کی دکانوں اور کلائنٹس کے لیے قانونی کمپیوٹر ٹائپنگ، گرافک ڈیزائن اور ڈیٹا اینٹری کا باعزت کام کرنا', textRoman: 'Class ke baad typing, design aur data entry ka ba-izzat kaam karna', isCorrect: true },
        { text: 'Rely purely on charity and handouts without learning to work', textUrdu: 'ہنر سیکھنے کی بجائے صرف خیرات اور امداد پر تکیہ کرنا', textRoman: 'Sirf khairat par baith jana' },
        { text: 'Engage in online get-rich-quick scams that deceive others', textUrdu: 'لوگوں کو دھوکہ دینے والے جعلی آن لائن منصوبوں میں شامل ہونا', textRoman: 'Dhoka aur scam wale kaamon mein parhna' },
        { text: 'Demand that parents take loans to buy luxury gaming gadgets', textUrdu: 'والدین سے ضد کرنا کہ قرض لے کر گیمنگ کمپیوٹر خریدیں', textRoman: 'Maa baap se zidd karna' },
      ],
      {
        text: 'After learning practical computer skills at DICE, what is the most dignified, halal, and realistic way for an underprivileged student to earn while studying to support their parents?',
        textUrdu: 'ڈجیٹل انسٹیٹیوٹ آف کمپیوٹر ایجوکیشن (DICE) سے کمپیوٹر مہارتیں سیکھنے کے بعد، ایک مستحق طالب علم کے لیے دورانِ تعلیم اپنے والدین کی مدد کرنے کا سب سے باعزت اور حلال طریقہ کیا ہے؟',
        textRoman: 'Computer skills seekhne ke baad apne parents ki madad ke liye sab se ba-izzat aur halal zariya kya hai?',
        category: 'scholarship',
        subcategory: 'باعزت روزگار و خودداری (Dignified Halal Livelihood)',
        difficultyLevel: 4,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 50,
        hint: 'True empowerment comes from offering legitimate digital services to real businesses and clients.',
        hintUrdu: 'اشارہ (30% رہنمائی): اپنے ہنر اور محنت سے مقامی مارکیٹ اور لوگوں کے لیے ڈیجیٹل سروسز فراہم کر کے حلال رزق کمانا۔',
        hintRoman: 'Hint: Apni mehnat aur digital skills se halal kamai karna.',
        explanation: 'Scholarship selection prioritizes students with the drive to build self-reliance and support their families ethically.',
        explanationUrdu: 'ہنر سیکھ کر اپنے زورِ بازو پر والدین کی مالی مدد کرنا خودداری اور مستحق ذہانت کی اعلیٰ ترین دلیل ہے۔',
        emotionalTone: 'encouraging',
        phase: 3,
      }
    )
  );

  // Q21: Academic Integrity & Digital Ethics
  paper.push(
    makeMcq(
      'dice_q21_mustahiq_ethics',
      [
        { text: 'Immediately close the answer key screen, report it to the examiner, and solve the test solely with personal honesty', textUrdu: 'فوری طور پر جوابات والی اسکرین بند کرنا، نگران کو مطلع کرنا اور صرف اپنی ایمانداری اور محنت سے پرچہ حل کرنا', textRoman: 'Fauran answer screen band karna aur apni imandari se test solve karna', isCorrect: true },
        { text: 'Copy all answers quickly while nobody is watching', textUrdu: 'جب کوئی نہ دیکھ رہا ہو تو تمام جوابات چپکے سے نقل کر لینا', textRoman: 'Chupkay se cheating kar lena' },
        { text: 'Take photos with phone and sell the key to other students', textUrdu: 'موبائل سے تصویر بنا کر دوسرے بچوں کو بیچنا', textRoman: 'Answers doosron ko bechna' },
        { text: 'Boast to friends that cheating was easy', textUrdu: 'دوستوں میں فخر کرنا کہ نقل کرنا آسان تھا', textRoman: 'Doston ko cheating sikhana' },
      ],
      {
        text: 'While taking a computer assessment in the lab, an answer key file is accidentally open and visible on an unattended screen next to you. Nobody is looking. What action reflects genuine Islamic values and personal honor?',
        textUrdu: 'کمپیوٹر لیب میں ٹیسٹ کے دوران پاس والی اسکرین پر حادثاتی طور پر جوابی پرچہ کھلا رہ گیا ہے اور آپ کو کوئی نہیں دیکھ رہا۔ اس وقت کون سا عمل سچے اسلامی اخلاق اور ذاتی خودداری کا مظہر ہوگا؟',
        textRoman: 'Lab mein test ke dauran sath wali screen par answers khulay hain aur koi nahi dekh raha. Imandari ka taqaza kya hai?',
        category: 'islamiat',
        subcategory: 'دیانت داری و اخلاقی ضمیر (Academic Integrity & Ethics)',
        difficultyLevel: 4,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 45,
        hint: 'True honor means doing what is right even when completely unseen by humans, knowing that Allah is watching.',
        hintUrdu: 'اشارہ (30% رہنمائی): سچی دیانت داری اور تقویٰ یہ ہے کہ تنہائی میں بھی اللہ کے خوف اور اپنی خودداری کا پاس رکھا جائے۔',
        hintRoman: 'Hint: Tanhai mein bhi imandari par qayam rehna.',
        explanation: 'Integrity is essential for scholarship trust and software responsibility.',
        explanationUrdu: 'دھوکے سے حاصل کی گئی کامیابی بے برکت ہوتی ہے۔ سچی خودداری یہ ہے کہ انسان صرف اپنی حلال محنت پر بھروسہ کرے۔',
        emotionalTone: 'encouraging',
        phase: 3,
      }
    )
  );

  // Q22: Emotional Grit in IT Debugging
  paper.push(
    makeMcq(
      'dice_q22_mustahiq_resilience',
      [
        { text: 'Stay patient and calm, carefully read the error message line by line, and methodically fix the code until it runs', textUrdu: 'صبر اور سکون کا مظاہرہ کرنا، خرابی کا پیغام (Error) غور سے پڑھنا اور طریقہ کار کے تحت کوڈ درست کر کے پروگرام چلانا', textRoman: 'Sabar ke sath error message parhna aur step by step code theek karna', isCorrect: true },
        { text: 'Get angry, smash the computer keyboard, and leave the lab', textUrdu: 'غصے میں کی بورڈ توڑ دینا اور لیب سے باہر بھاگ جانا', textRoman: 'Ghusse mein keyboard torna' },
        { text: 'Start crying and declare that computers are not for you', textUrdu: 'رونا شروع کر دینا اور کہنا کہ میں کمپیوٹر نہیں سیکھ سکتا', textRoman: 'Rona aur himmat haar jana' },
        { text: 'Blame the teacher and computer for the mistake', textUrdu: 'اپنی غلطی کا الزام استاد اور کمپیوٹر پر ڈالنا', textRoman: 'Teacher par ilzam lagana' },
      ],
      {
        text: 'You spend 3 days building a computer program or website, but during presentation, an unexpected error appears and the software crashes. What is the most mature, professional response?',
        textUrdu: 'آپ نے 3 دن محنت سے ایک کمپیوٹر پروگرام یا ویب سائٹ بنائی، لیکن پیش کش کے وقت اچانک ایک خرابی (Error) آ گئی اور پروگرام بند ہو گیا۔ اس وقت ایک سنجیدہ طالب علم کا کیا ردِعمل ہونا چاہیے؟',
        textRoman: '3 din ki mehnat ke baad program crash ho gaya. Is waqt aik mature aur hardworking student ka kya response hona chahiye?',
        category: 'social_emotional',
        subcategory: 'ثابت قدمی و فکری استقامت (Emotional Grit & Problem Solving)',
        difficultyLevel: 4,
        cognitiveSkill: 'applying',
        questionType: 'mcq',
        estimatedTimeSec: 45,
        hint: 'Errors are natural in programming; patience and analytical debugging are the hallmark of a great developer.',
        hintUrdu: 'اشارہ (30% رہنمائی): کمپیوٹر میں غلطیاں (Bugs) آنا قدرتی امر ہے؛ سکون سے ایرر پڑھ کر درست کرنا ہی ایک اچھے ڈویلپر کا ہنر ہے۔',
        hintRoman: 'Hint: Error ko dekh kar ghabrana nahi balke solve karna.',
        explanation: 'Grit and patient analytical debugging are core attributes assessed in technology scholarship applicants.',
        explanationUrdu: 'پریشانی کے وقت ہمت نہ ہارنا اور تدبیر سے خرابی دور کرنا حقیقی ذہانت اور کردار کی علامت ہے۔',
        emotionalTone: 'encouraging',
        phase: 3,
      }
    )
  );

  // Q23: Cybersecurity & Family Protection from Scams
  paper.push(
    makeMcq(
      'dice_q23_mustahiq_cyber',
      [
        { text: 'Alert family that this is a dangerous fake fraud, never share OTP/PIN, and delete/report the scam number', textUrdu: 'والدین کو فوراً خبردار کرنا کہ یہ فراڈ ہے، کبھی بھی پن کوڈ یا ایڈوانس رقم نہ بھیجیں اور نمبر بلاک کریں', textRoman: 'Ghar walon ko alert karna ke ye fraud hai aur kabhi PIN ya paise na bhejein', isCorrect: true },
        { text: 'Borrow money quickly to pay the advance fee hoping to win', textUrdu: 'انعام کے لالچ میں ادھار لے کر جلدی سے فیس جمع کروانا', textRoman: 'Lalach mein aakar paise bhej dena' },
        { text: 'Send your father’s CNIC and ATM PIN code to the unknown number', textUrdu: 'نامعلوم نمبر پر والد کا شناختی کارڈ اور اے ٹی ایم پن بھیج دینا', textRoman: 'Father ka PIN code send kar dena' },
        { text: 'Forward the message to all relatives so they can pay too', textUrdu: 'میسج تمام رشتے داروں کو فارورڈ کرنا تاکہ وہ بھی پیسے بھیجیں', textRoman: 'Sab ko forward karna' },
      ],
      {
        text: 'An SMS arrives on your father’s mobile: "Congratulations! You won Rs. 100,000 cash from Welfare Scheme. Send Rs. 3,000 processing fee and your bank PIN immediately to claim." As a computer student, how do you protect your family?',
        textUrdu: 'آپ کے والد کے موبائل پر پیغام آیا: "مبارک ہو! آپ کا 1 لاکھ روپے کا انعام نکلا ہے۔ فوری طور پر 3,000 روپے فیس اور اپنا خفیہ بینک پن کوڈ بھیج کر رقم وصول کریں۔" کمپیوٹر کا طالب علم ہونے کے ناطے آپ اپنے خاندان کو کیسے بچائیں گے؟',
        textRoman: 'Father ke phone par lottery scam ka SMS aya ke 3000 bhejo aur 1 lakh lo. Computer student hone ke naate aap family ko kaisay protect karein ge?',
        category: 'critical',
        subcategory: 'سائبر سیکیورٹی و فراڈ سے تحفظ (Cybersecurity & Family Protection)',
        difficultyLevel: 4,
        cognitiveSkill: 'applying',
        questionType: 'mcq',
        estimatedTimeSec: 45,
        hint: 'Legitimate organizations never ask for bank PINs or advance payment to claim prizes. This is a classic phishing scam.',
        hintUrdu: 'اشارہ (30% رہنمائی): کوئی بھی سرکاری یا فلاحی ادارہ انعام کے نام پر ایڈوانس فیس یا پن کوڈ نہیں مانگتا، یہ دھوکہ ہے۔',
        hintRoman: 'Hint: Ye fake scam hota hai, kabhi PIN ya advance fees na dein.',
        explanation: 'Demonstrates practical digital literacy and social responsibility in protecting vulnerable families from financial loss.',
        explanationUrdu: 'ڈیجیٹل شعور کا تقاضا ہے کہ ایسے فراڈ پیغامات سے خاندان اور سادہ لوح شہریوں کو مالی نقصان سے بچایا جائے۔',
        emotionalTone: 'encouraging',
        phase: 3,
      }
    )
  );

  // Q24: Community Uplift & Teaching Underprivileged Children
  paper.push(
    makeMcq(
      'dice_q24_mustahiq_uplift',
      [
        { text: 'Set up free weekend computer learning sessions to teach basic digital skills and typing to neighborhood poor children', textUrdu: 'ہفتہ وار چھٹی کے دن محلے کے غریب اور مستحق بچوں کو بلا معاوضہ بنیادی کمپیوٹر اور ٹائپنگ سکھانا', textRoman: 'Mohallay ke ghareeb bachon ko free computer aur typing sikhana', isCorrect: true },
        { text: 'Hide all knowledge and refuse to help anyone in the community', textUrdu: 'اپنا علم چھپا کر رکھنا اور محلے کے کسی بچے کی مدد سے انکار کرنا', textRoman: 'Ilm chupana aur kisi ki madad na karna' },
        { text: 'Mock children who do not have access to computers', textUrdu: 'جن کے پاس کمپیوٹر نہیں ہے ان کا مذاق اڑانا', textRoman: 'Doosron ka mazaq banana' },
        { text: 'Demand that small children pay expensive fees to learn from you', textUrdu: 'چھوٹے بچوں سے سیکھنے کی بھاری فیس کا مطالبہ کرنا', textRoman: 'Bari fees maangna' },
      ],
      {
        text: 'If Digital Institute of Computer Education (DICE) awards you a full scholarship, what is the most noble way you can give back to your local community and other needy children?',
        textUrdu: 'اگر ڈجیٹل انسٹیٹیوٹ آف کمپیوٹر ایجوکیشن (DICE) آپ کو 100% اسکالرشپ فراہم کرے، تو آپ اپنے علاقے اور دوسرے غریب بچوں کی بھلائی کے لیے علم کا صدقہ کیسے ادا کریں گے؟',
        textRoman: 'Agar DICE aap ko scholarship de, toh aap apne mohallay ke zaroorat mand bachon ki kaisay khidmat karein ge?',
        category: 'scholarship',
        subcategory: 'کمیونٹی خدمت اور علم کا صدقہ (Community Uplift & Social Impact)',
        difficultyLevel: 4,
        cognitiveSkill: 'evaluating',
        questionType: 'mcq',
        estimatedTimeSec: 45,
        hint: 'Sharing knowledge with those who cannot afford education multiplies its blessings and uplifts society.',
        hintUrdu: 'اشارہ (30% رہنمائی): علم بانٹنے سے بڑھتا ہے؛ غریب بچوں کو کمپیوٹر سکھانا صدقہ جاریہ اور سچی قیادت ہے۔',
        hintRoman: 'Hint: Ghareeb bachon ko digital skills sikhana.',
        explanation: 'Community leadership and multiplier effect are key criteria in institutional scholarship decisions.',
        explanationUrdu: 'اسکالرشپ کمیٹی ایسے طلبہ کو ترجیح دیتی ہے جو خود سیکھ کر اپنے علاقے کے پسماندہ بچوں کے لیے روشنی کا ذریعہ بنیں۔',
        emotionalTone: 'encouraging',
        phase: 3,
      }
    )
  );

  // =========================================================================
  // QUESTION 25: COMPREHENSIVE SUBJECTIVE WRITTEN VISION & FINANCIAL TRUTH
  // Evaluated by AI & Examiner to uncover authentic need, grit & IT vision
  // =========================================================================
  paper.push({
    id: 'dice_q25_written_vision',
    category: 'scholarship',
    subcategory: 'تفصیلی تحریری وژن اور خاندانی عزم (Subjective Vision & Need Assessment)',
    difficultyLevel: 7,
    cognitiveSkill: 'creating',
    questionType: 'open_ended',
    estimatedTimeSec: 240,
    text: 'Personal Vision, IT Ambition & Family Hardship: If awarded a scholarship at Digital Institute of Computer Education (DICE), what specific computer skill (e.g. Programming, Web Development, Graphic Design, AI) do you commit to mastering? Explain your family’s financial challenges, how you plan to use this skill to lift your parents out of poverty, and how you will serve your community.',
    textUrdu: 'ذاتی وژن، کمپیوٹر ہنر اور خاندانی حالات: اگر آپ کو ڈجیٹل انسٹیٹیوٹ آف کمپیوٹر ایجوکیشن (DICE) کی جانب سے اسکالرشپ دی جائے، تو آپ کمپیوٹر کی کون سی مخصوص مہارت (جیسے پروگرامنگ، ویب سائٹ سازی، گرافک ڈیزائن یا اے آئی) حاصل کرنا چاہتے ہیں؟ اپنے گھر کے معاشی حالات اور اپنے والدین کو غربت سے نکالنے کے لیے آپ کا کیا ٹھوس عزم اور لائحہ عمل ہے؟ تفصیل سے تحریر کریں۔',
    textRoman: 'Agar aap ko DICE scholarship milay, toh aap konsi computer skill seekhein ge? Apne ghar ke maashi halaat aur walidain ki madad ka kya plan hai? Tafseel se likhein.',
    hint: 'Structure your written thoughts into 3 clear parts: 1) Your target computer skill and why it inspires you, 2) Your family background and concrete plan to support your parents, 3) How you will teach or help other underprivileged children.',
    hintUrdu: 'اشارہ (30% رہنمائی): اپنی تحریر کو تین واضح نکات میں بانٹیں: 1) آپ کون سا کمپیوٹر ہنر سیکھنا چاہتے ہیں اور کیوں، 2) والدین اور گھر کی مالی حالت بہتر بنانے کا عملی منصوبہ، 3) علاقے کے مستحق بچوں کی مدد کا عزم۔',
    hintRoman: 'Hint: 3 baton par focus karein: Target computer skill, ghar ki madad, aur mohallay ke bachon ki khidmat.',
    explanation: 'Evaluated by Chief Examiner and AI for genuine depth of thought, financial hardship authenticity, articulateness, grit, and community vision.',
    explanationUrdu: 'اس تحریر کا جائزہ چیف ایگزامینر اور AI گہرائی، سچے خاندانی حالات، مستقل مزاجی اور خدمت کے جذبے کی بنیاد پر لیں گے۔',
    emotionalTone: 'supportive',
    phase: 3,
  });

  // Apply candidate-specific variant selection for slots that have variant pools
  const enrichedPaper = paper.map((baseQ, idx) => {
    const slotNum = idx + 1;
    const pool = QUESTION_SLOT_POOLS.find((p) => p.slotIndex === slotNum);
    if (pool && pool.variants.length > 0) {
      // 50% chance to use an alternative variant from pool, deterministically chosen
      const useVariant = rng.next() > 0.35;
      if (useVariant) {
        const chosen = rng.choice(pool.variants);
        if (!isScienceRelated(chosen)) {
          return chosen;
        }
      }
    }
    return baseQ;
  });

  // Final Refinement & Deduplication Pass
  return refineAndDeduplicateExamPaper(enrichedPaper, studentId, rng);
}

/**
 * Normalizes question text to detect duplicate formulations
 */
function normalizeQuestionStem(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reserve Pool of guaranteed unique, non-science Logic & IQ questions
 * used to swap out any potential duplicates detected during assembly.
 */
const RESERVE_UNIQUE_LOGIC_QUESTIONS: Question[] = [
  {
    id: 'dice_reserve_iq_1',
    text: 'Logical Equation Puzzle: If 2 # 3 = 13, 3 # 4 = 25, and 4 # 5 = 41, then what is 5 # 6 = ?',
    textUrdu: 'منطقی حسابی معمہ: اگر 2 # 3 = 13، اور 3 # 4 = 25، اور 4 # 5 = 41 ہو، تو 5 # 6 کا جواب کیا ہوگا؟',
    textRoman: 'Logic formula: 2 # 3 = 13, 3 # 4 = 25, 4 # 5 = 41. Toh 5 # 6 = ?',
    category: 'iq_logic',
    subcategory: 'حسابی مساوات منطق (Equation Formula Logic)',
    difficultyLevel: 7,
    cognitiveSkill: 'analyzing',
    questionType: 'mcq',
    estimatedTimeSec: 60,
    options: [
      { id: 'opt_1', text: '61', textUrdu: '61' },
      { id: 'opt_2', text: '55', textUrdu: '55' },
      { id: 'opt_3', text: '65', textUrdu: '65' },
      { id: 'opt_4', text: '51', textUrdu: '51' },
    ],
    correctAnswer: 'opt_1',
    hint: 'Rule: a² + b² (Square both numbers and add them: 5² + 6² = 25 + 36).',
    hintUrdu: 'اشارہ: دونوں اعداد کے مربع (Squares) کو جمع کریں: 5 کا مربع 25 + 6 کا مربع 36۔',
    hintRoman: '5^2 + 6^2 = 25 + 36 = 61.',
    explanation: '5² + 6² = 25 + 36 = 61.',
    explanationUrdu: '5² + 6² = 25 + 36 = 61۔',
    emotionalTone: 'challenging',
    phase: 1,
  },
  {
    id: 'dice_reserve_iq_2',
    text: 'Algorithmic Conditional Trace: If Score > 50 AND Attendance > 80, Status = "Pass". Else Status = "Review". A student has Score = 65 and Attendance = 75. What is the Status?',
    textUrdu: 'الگورتھم کی منطقی شرط: اگر اسکور 50 سے زیادہ ہو اور حاضری 80 سے زیادہ ہو تو اسٹیٹس "Pass" ہوگا ورنہ "Review"۔ اگر طالب علم کا اسکور 65 اور حاضری 75 ہو، تو نتیجہ کیا ہوگا؟',
    textRoman: 'Condition: Score > 50 AND Attendance > 80 => Pass, Else Review. Student: Score 65, Attendance 75. Nateeja kya hoga?',
    category: 'iq_logic',
    subcategory: 'منطقی شرائط (Conditional Tracing)',
    difficultyLevel: 6,
    cognitiveSkill: 'evaluating',
    questionType: 'mcq',
    estimatedTimeSec: 50,
    options: [
      { id: 'opt_1', text: 'Review', textUrdu: 'Review' },
      { id: 'opt_2', text: 'Pass', textUrdu: 'Pass' },
      { id: 'opt_3', text: 'Fail', textUrdu: 'Fail' },
      { id: 'opt_4', text: 'Error', textUrdu: 'Error' },
    ],
    correctAnswer: 'opt_1',
    hint: 'Both conditions must be TRUE for "Pass". Attendance is 75, which is not > 80.',
    hintUrdu: 'اشارہ: پاس ہونے کے لیے دونوں شرائط کا پورا ہونا ضروری ہے۔ حاضری 75 ہے جو 80 سے کم ہے۔',
    hintRoman: 'Attendance 80 se kam hai, is liye Review hoga.',
    explanation: 'Because attendance (75) is not > 80, the compound AND fails and evaluates to "Review".',
    explanationUrdu: 'چونکہ حاضری 80 سے کم ہے، اس لیے نتیجہ "Review" ہوگا۔',
    emotionalTone: 'neutral',
    phase: 2,
  },
  {
    id: 'dice_reserve_iq_3',
    text: 'Odd One Out (Algorithmic Logic): Which concept fundamentally differs from the other three?',
    textUrdu: 'مختلف کی شناخت (Odd One Out): مندرجہ ذیل میں سے کون سا تصور باقی تینوں سے بنیادی طور پر مختلف ہے؟',
    textRoman: 'In chaar mein se konsi cheez baaqi 3 se mukhtalif hai?',
    category: 'iq_logic',
    subcategory: 'منطقی زمرہ بندی (Classification Logic)',
    difficultyLevel: 5,
    cognitiveSkill: 'analyzing',
    questionType: 'mcq',
    estimatedTimeSec: 45,
    options: [
      { id: 'opt_1', text: 'Monitor (اسکرین / ڈسپلے ہارڈویئر)', textUrdu: 'مانیٹر (ہارڈویئر)' },
      { id: 'opt_2', text: 'Bubble Sort Algorithm (چھانٹی کا الگورتھم)', textUrdu: 'سارٹنگ الگورتھم' },
      { id: 'opt_3', text: 'Binary Search Algorithm (تلاش کا الگورتھم)', textUrdu: 'بائنری سرچ الگورتھم' },
      { id: 'opt_4', text: 'Merge Sort Algorithm (مرج سارٹ الگورتھم)', textUrdu: 'مرج سارٹ الگورتھم' },
    ],
    correctAnswer: 'opt_1',
    hint: 'Three choices are logical algorithms used in computer programming, while one is physical display hardware.',
    hintUrdu: 'اشارہ: تین آپشنز کمپیوٹر الگورتھم ہیں جبکہ ایک فزیکل ہارڈویئر اسکرین ہے۔',
    hintRoman: 'Monitor hardware hai, baaqi teen software algorithms hain.',
    explanation: 'Monitor is an output hardware device; the other three are computational sorting and searching algorithms.',
    explanationUrdu: 'مانیٹر ہارڈویئر ہے جبکہ باقی تینوں کمپیوٹر الگورتھم ہیں۔',
    emotionalTone: 'encouraging',
    phase: 2,
  },
];

/**
 * Rigorous Deduplication & Science Exclusion Engine
 * Guarantees:
 * 1. Exactly 25 questions in the student paper.
 * 2. Strictly 0 science-related questions.
 * 3. Strictly NO two questions are identical (distinct IDs and distinct question stems).
 */
export function refineAndDeduplicateExamPaper(
  rawPaper: Question[],
  studentId: string,
  rng: SeededRandom
): Question[] {
  const result: Question[] = [];
  const seenIds = new Set<string>();
  const seenStems = new Set<string>();

  // Reserve index pointer in case substitutions are needed
  let reserveIdx = 0;

  for (let i = 0; i < rawPaper.length; i++) {
    const q = rawPaper[i];
    const stem = normalizeQuestionStem(q.text);

    const isDuplicate = seenIds.has(q.id) || seenStems.has(stem);
    const hasScience = isScienceRelated(q);

    if (!isDuplicate && !hasScience) {
      result.push(q);
      seenIds.add(q.id);
      seenStems.add(stem);
    } else {
      // Find a non-duplicate, non-science substitute from the reserve or slot variants
      let substitute: Question | null = null;

      // Try reserve pool first
      while (reserveIdx < RESERVE_UNIQUE_LOGIC_QUESTIONS.length) {
        const candidate = RESERVE_UNIQUE_LOGIC_QUESTIONS[reserveIdx++];
        const candStem = normalizeQuestionStem(candidate.text);
        if (!seenIds.has(candidate.id) && !seenStems.has(candStem) && !isScienceRelated(candidate)) {
          substitute = candidate;
          break;
        }
      }

      // If reserve exhausted, dynamically generate a guaranteed unique arithmetic logic question
      if (!substitute) {
        const mult = 3 + (result.length % 5);
        const add = 2 + (result.length % 7);
        const dynId = `dice_dyn_unique_${studentId}_${i + 1}`;
        substitute = {
          id: dynId,
          text: `Computational Pattern: If f(n) = (${mult} × n) + ${add}, what is the exact value of f(4)?`,
          textUrdu: `حسابی منطق: اگر فارمولا f(n) = (${mult} × n) + ${add} ہو، تو f(4) کی صحیح قیمت کیا ہوگی؟`,
          textRoman: `Formula f(n) = (${mult} * n) + ${add}. f(4) kya hoga?`,
          category: 'iq_logic',
          subcategory: 'منطقی فارمولا (Computational Logic Function)',
          difficultyLevel: 6,
          cognitiveSkill: 'evaluating',
          questionType: 'mcq',
          estimatedTimeSec: 50,
          options: [
            { id: 'opt_1', text: `${mult * 4 + add}`, textUrdu: `${mult * 4 + add}` },
            { id: 'opt_2', text: `${mult * 4 + add - 3}`, textUrdu: `${mult * 4 + add - 3}` },
            { id: 'opt_3', text: `${mult * 4 + add + 4}`, textUrdu: `${mult * 4 + add + 4}` },
            { id: 'opt_4', text: `${mult * 4}`, textUrdu: `${mult * 4}` },
          ],
          correctAnswer: 'opt_1',
          hint: `Multiply 4 by ${mult} then add ${add}.`,
          hintUrdu: `اشارہ: 4 کو ${mult} سے ضرب دیں اور پھر ${add} جمع کریں۔`,
          hintRoman: `4 * ${mult} + ${add}.`,
          explanation: `f(4) = (${mult} × 4) + ${add} = ${mult * 4 + add}.`,
          explanationUrdu: `حل: (${mult} × 4) + ${add} = ${mult * 4 + add}۔`,
          emotionalTone: 'encouraging',
          phase: 2,
        };
      }

      result.push(substitute);
      seenIds.add(substitute.id);
      seenStems.add(normalizeQuestionStem(substitute.text));
    }
  }

  // Ensure strict paper size of exactly 25 questions
  return result.slice(0, 25);
}

/**
 * Primary Refined Question Selection Algorithm for student examinations.
 * Meets all criteria:
 * - Exactly 25 questions in a single continuous paper.
 * - Strictly NO science questions.
 * - Strictly NO two identical questions for a student.
 * - Heavy emphasis on IQ, Logic, and Problem Solving.
 */
export function selectExamQuestionsForStudent(
  studentId: string,
  options: {
    isHafiz?: boolean;
    sessionTimestamp?: number;
  } = {}
): Question[] {
  return generateExamPaperForCandidate(studentId, options);
}

/**
 * Validates any candidate exam paper for structural integrity:
 * - Exactly 25 questions
 * - Zero science questions
 * - Zero duplicates
 */
export function validateCandidateExamPaper(questions: Question[]): {
  isValid: boolean;
  totalQuestions: number;
  duplicateCount: number;
  scienceRelatedCount: number;
  duplicateIds: string[];
  scienceIssues: string[];
} {
  const seenIds = new Set<string>();
  const duplicateIds: string[] = [];
  const scienceIssues: string[] = [];

  for (const q of questions) {
    if (seenIds.has(q.id)) {
      duplicateIds.push(q.id);
    }
    seenIds.add(q.id);

    if (isScienceRelated(q)) {
      scienceIssues.push(`${q.id}: ${q.text.substring(0, 40)}...`);
    }
  }

  const isValid =
    questions.length === 25 &&
    duplicateIds.length === 0 &&
    scienceIssues.length === 0;

  return {
    isValid,
    totalQuestions: questions.length,
    duplicateCount: duplicateIds.length,
    scienceRelatedCount: scienceIssues.length,
    duplicateIds,
    scienceIssues,
  };
}

/**
 * Question registry lookup supporting questions from both
 * base generated papers, variant pools, and reserves.
 */
export function getQuestionById(id: string): Question | undefined {
  if (!id) return undefined;

  // Search reserve pool
  const fromReserve = RESERVE_UNIQUE_LOGIC_QUESTIONS.find((q) => q.id === id);
  if (fromReserve) return fromReserve;

  // Search variant pools
  for (const pool of QUESTION_SLOT_POOLS) {
    const found = pool.variants.find((v) => v.id === id);
    if (found) return found;
  }

  return undefined;
}

export { isScienceRelated, filterOutScienceQuestions };

