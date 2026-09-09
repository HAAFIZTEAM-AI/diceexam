import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_SUBMISSIONS } from './src/data/mockSubmissions';
import { ExamSubmission, ComprehensiveReport } from './src/types';

// In-memory storage (note: on Vercel serverless this resets between cold starts)
let submissions: ExamSubmission[] = [...INITIAL_SUBMISSIONS];

// Simple in-memory rate limiting for admin login attempts
const adminLoginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ADMIN_ATTEMPTS = 8;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'dice-exam-portal',
        },
      },
    });
  }
  return aiClient;
}

function getAdminSecret(): string {
  // Prefer environment variable. Fallback only for backward compatibility.
  return process.env.ADMIN_SECRET || '@#$%^&*';
}

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Basic security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  app.use(express.json({ limit: '2mb' })); // reduced from 10mb for safety

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // ===================== SECURE ADMIN LOGIN =====================
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body || {};
    const ip = getClientIp(req);
    const now = Date.now();

    // Rate limiting
    const record = adminLoginAttempts.get(ip) || { count: 0, lastAttempt: 0 };

    if (record.count >= MAX_ADMIN_ATTEMPTS && now - record.lastAttempt < LOCKOUT_MS) {
      const remainingMin = Math.ceil((LOCKOUT_MS - (now - record.lastAttempt)) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many failed attempts. Try again in ${remainingMin} minute(s).`,
      });
    }

    // Reset counter if lockout period passed
    if (now - record.lastAttempt >= LOCKOUT_MS) {
      record.count = 0;
    }

    const expected = getAdminSecret();

    if (typeof password !== 'string' || password.trim() !== expected) {
      record.count += 1;
      record.lastAttempt = now;
      adminLoginAttempts.set(ip, record);

      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    // Success — clear attempts
    adminLoginAttempts.delete(ip);

    res.json({
      success: true,
      message: 'Admin authenticated',
      // Simple session flag (frontend can store in memory / sessionStorage)
      token: `admin_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    });
  });

  // Get all exams
  app.get('/api/exams', (req, res) => {
    const { status } = req.query;
    let results = [...submissions];
    if (status && typeof status === 'string' && status !== 'all') {
      results = results.filter((s) => s.status === status);
    }
    results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    res.json({ success: true, exams: results });
  });

  // Search exams
  app.get('/api/exams/search', (req, res) => {
    const query = ((req.query.q as string) || '').trim().toLowerCase();
    if (!query) {
      return res.json({ success: true, exams: submissions });
    }
    const matched = submissions.filter(
      (s) =>
        s.studentId.toLowerCase().includes(query) ||
        s.rollNo.toLowerCase().includes(query) ||
        s.student.name.toLowerCase().includes(query)
    );
    res.json({ success: true, exams: matched });
  });

  // Get single exam
  app.get('/api/exams/:id', (req, res) => {
    const { id } = req.params;
    const submission = submissions.find(
      (s) =>
        s.id === id ||
        s.studentId.toLowerCase() === id.toLowerCase() ||
        s.rollNo === id
    );
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Exam submission not found' });
    }
    res.json({ success: true, exam: submission });
  });

  // Submit new exam
  app.post('/api/exams', (req, res) => {
    const newSubmission: ExamSubmission = req.body;
    if (!newSubmission || !newSubmission.studentId) {
      return res.status(400).json({ success: false, message: 'Invalid submission data' });
    }

    // Basic sanitization
    newSubmission.studentId = String(newSubmission.studentId).trim().slice(0, 32);
    newSubmission.rollNo = String(newSubmission.rollNo || newSubmission.studentId).trim().slice(0, 32);

    const existingIndex = submissions.findIndex(
      (s) => s.id === newSubmission.id || s.studentId === newSubmission.studentId
    );
    if (existingIndex >= 0) {
      submissions[existingIndex] = newSubmission;
    } else {
      submissions.unshift(newSubmission);
    }
    res.json({ success: true, exam: newSubmission });
  });

  // Grade exam
  app.post('/api/exams/:id/grade', (req, res) => {
    const { id } = req.params;
    const {
      answers,
      subjectiveScore,
      finalPercentage,
      status,
      checkedBy,
      teacherRemarks,
      evaluationReport,
    } = req.body;

    const submissionIndex = submissions.findIndex((s) => s.id === id || s.studentId === id);
    if (submissionIndex === -1) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const current = submissions[submissionIndex];
    const updated: ExamSubmission = {
      ...current,
      answers: answers || current.answers,
      subjectiveScore: subjectiveScore !== undefined ? subjectiveScore : current.subjectiveScore,
      finalPercentage: finalPercentage !== undefined ? finalPercentage : current.finalPercentage,
      status: status || current.status,
      checkedAt: new Date().toISOString(),
      checkedBy: checkedBy || 'Senior Examiner',
      teacherRemarks: teacherRemarks !== undefined ? teacherRemarks : current.teacherRemarks,
      evaluationReport: evaluationReport || current.evaluationReport,
    };

    submissions[submissionIndex] = updated;
    res.json({ success: true, exam: updated });
  });

  // AI Auto-Evaluation
  app.post('/api/ai-evaluate', async (req, res) => {
    const { submission } = req.body;
    if (!submission) {
      return res.status(400).json({ success: false, message: 'Missing submission' });
    }

    const student = submission.student || {};
    const intro = (submission.introAnswers || [])
      .map((i: any) => `${i.questionUrdu}: ${i.answer}`)
      .join('\n');
    const subjectiveEntries = Object.entries(submission.answers || {})
      .filter(([_, ans]: any) => ans.textAnswer)
      .map(
        ([qid, ans]: any) =>
          `Question (${qid}):\nAnswer: "${ans.textAnswer}"\nDetected Emotion: ${ans.emotionDetected}\n`
      )
      .join('\n');

    try {
      const ai = getAI();
      if (ai) {
        const prompt = `You are the chief evaluator of OMNI-TEST v5.0 (Emotions x Home x Intellect Adaptive Testing System).
Evaluate this student's exam:
Student Name: ${student.name}, Age: ${student.age}, Grade: ${student.grade}
Student Background & Intro Survey:
${intro}

Student Subjective Exam Answers:
${subjectiveEntries}

Objective Raw Score: ${submission.rawObjectiveScore || 45} / ${submission.totalObjectiveScore || 50}
Dominant Emotion: ${submission.dominantEmotion || 'confidence'}

Produce a thorough JSON evaluation matching this structure:
{
  "subjectiveScores": { [questionId: string]: number (between 10 and 25 marks per question according to depth, honesty and relevance) },
  "totalSubjectiveScore": number,
  "teacherFeedback": { [questionId: string]: string (supportive Urdu feedback) },
  "teacherRemarks": string (detailed Urdu assessment praise and guidance),
  "evaluationReport": {
    "academicScores": {
      "math": { "score": number, "total": 25, "gradeLevel": string, "percentage": number },
      "english": { "score": number, "total": 20, "gradeLevel": string, "percentage": number },
      "islamiat": { "score": number, "total": 20, "gradeLevel": string, "percentage": number },
      "generalKnowledge": { "score": number, "total": 15, "gradeLevel": string, "percentage": number },
      "iqLogic": { "score": number, "total": 20, "gradeLevel": string, "percentage": number },
      "overallPercentage": number
    },
    "cognitiveProfile": {
      "knowledgeMastery": string,
      "learningStyle": "بصری (Visual)" | "سمعی (Auditory)" | "حرکی (Kinesthetic)" | "پڑھنے/لکھنے (Read/Write)" | "سماجی (Social)" | "تنہا (Solitary)",
      "cognitiveLoadTolerance": "کم (Low)" | "درمیانہ (Moderate)" | "زیادہ (High)",
      "metaCognitiveAwareness": "ابتدائی (Developing)" | "معیاری (Proficient)" | "اعلیٰ (Advanced)",
      "problemSolvingApproach": "تجزیاتی (Analytical)" | "وجدانی (Intuitive)" | "منظم (Systematic)" | "تخلیقی (Creative)"
    },
    "emotionalProfile": {
      "baseline": string,
      "resilience": string,
      "persistence": string,
      "confidenceLevel": "زیادہ (High)" | "درمیانہ (Medium)" | "کم (Low)",
      "motivationIndicator": "اندرونی (Intrinsic)" | "بیرونی (Extrinsic)" | "مخلوط (Balanced)"
    },
    "creativityScore": {
      "originality": number (1-10),
      "divergentThinking": number (1-10),
      "creativeProblemSolving": number (1-10),
      "imagination": number (1-10)
    },
    "socialMoralProfile": {
      "empathyScore": number (1-10),
      "moralReasoning": number (1-10),
      "socialAwareness": number (1-10),
      "justiceOrientation": number (1-10)
    },
    "scholarshipRecommendation": {
      "overallScore": number (1-100),
      "tier": "Platinum" | "Gold" | "Silver" | "Bronze" | "Recognition",
      "recommendationStatus": "سفارش کی جاتی ہے (Highly Recommended)" | "غور کریں (Consider)" | "مزید جائزہ لیں (Under Review)",
      "keyStrengths": string[] (5 strengths in Urdu),
      "growthAreas": string[] (3 growth areas in Urdu),
      "scholarshipStatement": string (Urdu statement)
    },
    "learningRoadmap": {
      "focusSubjects": string[] (in Urdu),
      "recommendedLearningStyle": string (in Urdu),
      "recommendedResources": string[] (in Urdu),
      "adviceForParentsAndTeachers": string (in Urdu)
    }
  }
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, aiEvaluation: parsed });
        }
      }
    } catch (err) {
      console.warn('Gemini API call skipped or errored, using fallback evaluation:', err);
    }

    // Heuristic fallback
    const fallbackScores: Record<string, number> = {};
    const fallbackFeedback: Record<string, string> = {};
    let subTotal = 0;

    Object.entries(submission.answers || {}).forEach(([qid, ans]: any) => {
      if (ans.textAnswer) {
        const words = (ans.textAnswer || '').trim().split(/\s+/).length;
        const mark = Math.min(25, Math.max(15, Math.round(words / 4) + 14));
        fallbackScores[qid] = mark;
        fallbackFeedback[qid] =
          'عمدہ، جامع اور فکری جواب۔ طالب علم نے اپنے وژن اور خاندانی عزم کو خوبصورتی سے بیان کیا ہے۔';
        subTotal += mark;
      }
    });

    const totalObj = submission.totalObjectiveScore || 50;
    const totalSub =
      submission.totalSubjectiveScore !== undefined
        ? submission.totalSubjectiveScore
        : Object.keys(fallbackScores).length * 25;
    const totalPossible = Math.max(1, totalObj + totalSub);
    let overallPct = Math.min(
      100,
      Math.round((((submission.rawObjectiveScore || 0) + subTotal) / totalPossible) * 100)
    );
    if (submission.isHafiz) {
      overallPct = Math.min(100, Math.max(25, overallPct + 25));
    }
    const tier =
      overallPct >= 90
        ? 'Platinum'
        : overallPct >= 80
        ? 'Gold'
        : overallPct >= 70
        ? 'Silver'
        : overallPct >= 60
        ? 'Bronze'
        : 'Recognition';

    const fallbackReport: ComprehensiveReport = {
      academicScores: {
        math: { score: 23, total: 25, gradeLevel: 'A+ (ماہرانہ)', percentage: 92 },
        english: { score: 18, total: 20, gradeLevel: 'A (بہترین)', percentage: 90 },
        islamiat: { score: 19, total: 20, gradeLevel: 'A+ (شاندار)', percentage: 95 },
        generalKnowledge: { score: 14, total: 15, gradeLevel: 'A+ (مستند)', percentage: 93 },
        iqLogic: { score: 18, total: 20, gradeLevel: 'A (ذہین)', percentage: 90 },
        overallPercentage: overallPct,
      },
      cognitiveProfile: {
        knowledgeMastery: 'مضبوط گرفت اور استدلال کی اعلیٰ صلاحیت',
        learningStyle: 'بصری (Visual)',
        cognitiveLoadTolerance: 'زیادہ (High)',
        metaCognitiveAwareness: 'معیاری (Proficient)',
        problemSolvingApproach: 'منظم (Systematic)',
      },
      emotionalProfile: {
        baseline: 'پُراعتماد اور متوازن',
        resilience: 'مشکل سوالات میں صبر اور استقامت',
        persistence: 'اعلیٰ درجے کی محنت',
        confidenceLevel: 'زیادہ (High)',
        motivationIndicator: 'اندرونی (Intrinsic)',
      },
      creativityScore: {
        originality: 9.0,
        divergentThinking: 8.8,
        creativeProblemSolving: 9.2,
        imagination: 9.0,
      },
      socialMoralProfile: {
        empathyScore: 9.2,
        moralReasoning: 9.5,
        socialAwareness: 9.0,
        justiceOrientation: 9.3,
      },
      scholarshipRecommendation: {
        overallScore: overallPct,
        tier: tier as any,
        recommendationStatus: 'سفارش کی جاتی ہے (Highly Recommended)',
        keyStrengths: [
          'عملی اور سائنسی فہم میں اعلیٰ صلاحیت',
          'اخلاقی استدلال اور راست گوئی',
          'بحرانی کیفیات میں مثبت طرزِ فکر',
          'جذباتی پختگی اور متوازن برتاؤ',
          'مستقبل کے وژن میں شفافیت',
        ],
        growthAreas: [
          'زبان کے ذخیرہ الفاظ میں مزید تنوع لانا',
          'حسابی فارمولوں کے اطلاق کی زیادہ مشق',
          'تحریری اظہار میں پیراگراف بندی کا خیال رکھنا',
        ],
        scholarshipStatement: `طالب علم نے OMNI-TEST v5.0 کے امتحانی معیارات پر شاندار صلاحیت کا ثبوت دیا ہے اور ادارہ انہیں ${tier} اسکالرشپ کا اہل قرار دیتا ہے۔`,
      },
      learningRoadmap: {
        focusSubjects: ['تخلیقی مضامین اور زبان دانی', 'عملی سائنسی تجربات', 'منطقی پہیلیاں'],
        recommendedLearningStyle: 'بصری خاکوں اور عملی مثالوں کے ذریعے تدریس',
        recommendedResources: ['بچوں کے سائنسی میگزین', 'آن لائن کوئز ماسٹر', 'اردو لغت اور اقوال'],
        adviceForParentsAndTeachers:
          'طالب علم کے اندر سیکھنے کا سچا جذبہ موجود ہے؛ انہیں مطالعے کے مزید مواقع فراہم کیے جائیں۔',
      },
    };

    res.json({
      success: true,
      aiEvaluation: {
        subjectiveScores: fallbackScores,
        totalSubjectiveScore: subTotal,
        teacherFeedback: fallbackFeedback,
        teacherRemarks: `طالب علم نے امتحان کے تمام حصوں میں نہایت سنجیدگی، ایمانداری اور علمی لگن کا ثبوت دیا ہے۔ انہیں ${tier} اسکالرشپ کی تائید کی جاتی ہے۔`,
        evaluationReport: fallbackReport,
      },
    });
  });

  // AI Co-pilot chat
  app.post('/api/ai-chat', async (req, res) => {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Missing prompt' });
    }

    try {
      const ai = getAI();
      if (ai) {
        const fullPrompt = `You are the Lead Academic & Scholarship AI Examiner for OMNI-TEST v5.0.
Your role is to assist the Admin in evaluating candidates, validating strict quota rules (100% = 1 student max, 50% = 1-2 students max, 25% = remaining qualifying candidates), analyzing written essays, and formulating educational feedback in Urdu, Roman Urdu, or English based on the user's language.

Current System Context:
${JSON.stringify(context || {})}

Examiner Request:
${prompt}

Provide a helpful, precise, professional response.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        });

        const reply = response.text?.trim() || 'تجزیہ مکمل ہو گیا۔';
        return res.json({ success: true, reply });
      }
    } catch (err) {
      console.warn('AI chat error:', err);
    }

    let fallbackReply =
      'ایڈمن کوٹہ اصول کے تحت 100% مکمل اسکالرشپ صرف میرٹ لسٹ کے پہلے (رینک 1) طالب علم کے لیے ہے، 50% اسکالرشپ زیادہ سے زیادہ 2 طلبہ (رینک 2 اور 3) کے لیے ہے، اور 25% اسکالرشپ باقی تمام پاس طلبہ کو دی جا سکتی ہے۔';
    if (
      prompt.toLowerCase().includes('essay') ||
      prompt.toLowerCase().includes('written') ||
      prompt.includes('تحریر')
    ) {
      fallbackReply =
        'طالب علم کی تحریر میں تخلیقی سوچ، معاشرتی شعور اور دیانتداری کو بنیادی اہمیت دیں۔ پارٹ 4 کے جوابی مواد میں خیالات کی گہرائی اور اخلاقی پختگی کے مطابق 8 سے 10 نمبرات تجویز کیے جاتے ہیں۔';
    } else if (prompt.toLowerCase().includes('quota') || prompt.includes('کوٹہ')) {
      fallbackReply =
        'کوٹہ قوانین:\n1. 100% اسکالرشپ: صرف 1 طالب علم (میرٹ + ضرورت انڈیکس سرفہرست)\n2. 50% اسکالرشپ: زیادہ سے زیادہ 1 تا 2 طلبہ\n3. 25% اسکالرشپ: بقیہ تمام اہل و مستحق طلبہ۔';
    }

    res.json({ success: true, reply: fallbackReply });
  });

  // Vite / Static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DICE Exam Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
