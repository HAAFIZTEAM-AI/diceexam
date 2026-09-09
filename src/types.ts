export type Language = 'ur' | 'roman' | 'en';

export type EmotionState =
  | 'confidence'
  | 'anxiety'
  | 'anxious'
  | 'frustration'
  | 'boredom'
  | 'excitement'
  | 'confusion'
  | 'curiosity'
  | 'fatigue'
  | 'neutral'
  | 'hopeful'
  | 'determined'
  | 'pressured';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ExamPhaseNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type QuestionCategory =
  | 'math'
  | 'english'
  | 'islamiat'
  | 'iq_logic'
  | 'general_knowledge'
  | 'creative'
  | 'critical'
  | 'social_emotional'
  | 'scholarship';

export type QuestionType = 'mcq' | 'open_ended' | 'scenario' | 'puzzle' | 'reflective';

export interface QuestionOption {
  id: string;
  text: string;
  textUrdu: string;
  textRoman?: string;
}

export interface Question {
  id: string;
  text: string;
  textUrdu: string;
  textRoman?: string;
  category: QuestionCategory;
  subcategory: string;
  difficultyLevel: DifficultyLevel;
  cognitiveSkill: 'remembering' | 'applying' | 'analyzing' | 'evaluating' | 'creating';
  questionType: QuestionType;
  estimatedTimeSec: number;
  options?: QuestionOption[];
  correctAnswer?: string; // option id or keywords
  hint: string;
  hintUrdu: string;
  hintRoman?: string;
  explanation: string;
  explanationUrdu: string;
  explanationRoman?: string;
  emotionalTone: 'encouraging' | 'neutral' | 'challenging' | 'supportive' | 'playful';
  phase: ExamPhaseNumber;
  part?: 1 | 2 | 3 | 4;
}

export interface MustahiqProfile {
  monthlyIncomeBracket: string; // e.g., 'under_25k' | '25k_50k' | '50k_80k' | 'above_80k'
  fatherOccupation: string;
  dependentsCount: number;
  financialHardshipReason: string;
  motivationStatement: string;
  preTestEmotion: 'hopeful' | 'anxious' | 'determined' | 'pressured' | 'confident';
  needScore: number; // 0 - 100
  isMustahiqEligible: boolean;
  // Dignified covert diagnostic indicators
  foodSecurityAnswer?: string;
  booksAndUniformAnswer?: string;
  studyConditionsAnswer?: string;
  householdWorkBurdenAnswer?: string;
  emergencyHardshipAnswer?: string;
  dignifiedAssessmentSummary?: string;
}

export interface IntroQuestionAnswer {
  id: string;
  questionUrdu: string;
  questionEn: string;
  questionRoman?: string;
  answer: string;
}

export interface StudentProfile {
  studentId: string;
  rollNo: string;
  name: string;
  age: number;
  grade: string;
  school?: string;
  preferredLanguage: Language;
  createdAt: string;
  isHafiz?: boolean;
  hafizBonusGranted?: boolean;
  exemptedPart?: number;
  careerAmbition?: string;
  careerAmbitionReason?: string;
  mustahiqProfile?: MustahiqProfile;
}

export interface ExamAnswerRecord {
  questionId: string;
  selectedOption?: string;
  textAnswer?: string;
  timeTakenSeconds: number;
  emotionDetected: EmotionState;
  isCorrect?: boolean;
  scoreAwarded: number;
  maxScore: number;
  teacherFeedback?: string;
}

export type ScholarshipTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Recognition';

export interface AcademicSubjectScore {
  score: number;
  total: number;
  gradeLevel: string;
  percentage: number;
}

export interface ComprehensiveReport {
  academicScores: {
    math: AcademicSubjectScore;
    english: AcademicSubjectScore;
    islamiat: AcademicSubjectScore;
    generalKnowledge: AcademicSubjectScore;
    iqLogic: AcademicSubjectScore;
    overallPercentage: number;
  };
  cognitiveProfile: {
    knowledgeMastery: string;
    learningStyle: 'بصری (Visual)' | 'سمعی (Auditory)' | 'حرکی (Kinesthetic)' | 'پڑھنے/لکھنے (Read/Write)' | 'سماجی (Social)' | 'تنہا (Solitary)';
    cognitiveLoadTolerance: 'کم (Low)' | 'درمیانہ (Moderate)' | 'زیادہ (High)';
    metaCognitiveAwareness: 'ابتدائی (Developing)' | 'معیاری (Proficient)' | 'اعلیٰ (Advanced)';
    problemSolvingApproach: 'تجزیاتی (Analytical)' | 'وجدانی (Intuitive)' | 'منظم (Systematic)' | 'تخلیقی (Creative)';
  };
  emotionalProfile: {
    baseline: string;
    resilience: string;
    persistence: string;
    confidenceLevel: 'زیادہ (High)' | 'درمیانہ (Medium)' | 'کم (Low)';
    motivationIndicator: 'اندرونی (Intrinsic)' | 'بیرونی (Extrinsic)' | 'مخلوط (Balanced)';
  };
  creativityScore: {
    originality: number; // 1-10
    divergentThinking: number; // 1-10
    creativeProblemSolving: number; // 1-10
    imagination: number; // 1-10
  };
  socialMoralProfile: {
    empathyScore: number; // 1-10
    moralReasoning: number; // 1-10
    socialAwareness: number; // 1-10
    justiceOrientation: number; // 1-10
  };
  scholarshipRecommendation: {
    overallScore: number; // 0-100
    tier: ScholarshipTier;
    recommendationStatus: 'سفارش کی جاتی ہے (Highly Recommended)' | 'غور کریں (Consider)' | 'مزید جائزہ لیں (Under Review)';
    keyStrengths: string[];
    growthAreas: string[];
    scholarshipStatement: string;
  };
  learningRoadmap: {
    focusSubjects: string[];
    recommendedLearningStyle: string;
    recommendedResources: string[];
    adviceForParentsAndTeachers: string;
  };
}

export interface ExamSubmission {
  id: string;
  studentId: string;
  rollNo: string;
  student: StudentProfile;
  mustahiqProfile?: MustahiqProfile;
  introAnswers: IntroQuestionAnswer[];
  homeProfileSummary?: string;
  answers: Record<string, ExamAnswerRecord>;
  phaseReached: number;
  highestDifficultyAchieved: number;
  totalTimeSpentSeconds: number;
  dominantEmotion: EmotionState;
  rawObjectiveScore: number;
  totalObjectiveScore: number;
  subjectiveScore: number;
  totalSubjectiveScore: number;
  finalPercentage: number;
  isHafiz?: boolean;
  hafizCreditPercentage?: number; // default 25
  exemptedPart?: number; // part 1 exempted
  status: 'pending' | 'in_review' | 'checked' | 'published';
  submittedAt: string;
  checkedAt?: string;
  checkedBy?: string;
  teacherRemarks?: string;
  evaluationReport?: ComprehensiveReport;
}
