import { ExamSubmission, ComprehensiveReport, Question } from '../types';
import { INITIAL_SUBMISSIONS } from '../data/mockSubmissions';
import {
  selectExamQuestionsForStudent,
  generateExamPaperForCandidate,
  validateCandidateExamPaper,
  getQuestionById,
  isScienceRelated,
  filterOutScienceQuestions,
} from './questionEngine';

const STORAGE_KEY = 'omni_test_submissions_v1';

export function getLocalSubmissions(): ExamSubmission[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read local storage:', e);
  }
  return [...INITIAL_SUBMISSIONS];
}

export function saveLocalSubmissions(list: ExamSubmission[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save to local storage:', e);
  }
}

export async function fetchAllExams(): Promise<ExamSubmission[]> {
  try {
    const res = await fetch('/api/exams');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.exams)) {
        saveLocalSubmissions(data.exams);
        return data.exams;
      }
    }
  } catch (e) {
    console.warn('API fetch failed, reading from localStorage:', e);
  }
  return getLocalSubmissions();
}

export async function searchExams(query: string): Promise<ExamSubmission[]> {
  try {
    const res = await fetch(`/api/exams/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.exams)) {
        return data.exams;
      }
    }
  } catch (e) {
    console.warn('API search failed, filtering local submissions:', e);
  }

  const all = getLocalSubmissions();
  if (!query.trim()) return all;
  const q = query.trim().toLowerCase();
  return all.filter(
    (s) =>
      s.studentId.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.student.name.toLowerCase().includes(q)
  );
}

export async function submitExam(submission: ExamSubmission): Promise<boolean> {
  // Update local storage first
  const current = getLocalSubmissions();
  const existingIdx = current.findIndex((s) => s.id === submission.id || s.studentId === submission.studentId);
  if (existingIdx >= 0) {
    current[existingIdx] = submission;
  } else {
    current.unshift(submission);
  }
  saveLocalSubmissions(current);

  // Send to backend API
  try {
    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    return res.ok;
  } catch (e) {
    console.warn('Backend submit failed, saved to local cache:', e);
    return true;
  }
}

export async function gradeExam(
  examId: string,
  payload: {
    answers?: any;
    subjectiveScore?: number;
    finalPercentage?: number;
    status?: 'pending' | 'in_review' | 'checked' | 'published';
    checkedBy?: string;
    teacherRemarks?: string;
    evaluationReport?: ComprehensiveReport;
  }
): Promise<ExamSubmission | null> {
  try {
    const res = await fetch(`/api/exams/${examId}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.exam) {
        // Sync local storage
        const current = getLocalSubmissions();
        const idx = current.findIndex((s) => s.id === examId || s.studentId === examId);
        if (idx >= 0) {
          current[idx] = data.exam;
          saveLocalSubmissions(current);
        }
        return data.exam;
      }
    }
  } catch (e) {
    console.warn('Backend grade failed, updating locally:', e);
  }

  // Local fallback
  const current = getLocalSubmissions();
  const idx = current.findIndex((s) => s.id === examId || s.studentId === examId);
  if (idx >= 0) {
    const updated: ExamSubmission = {
      ...current[idx],
      ...payload,
      checkedAt: new Date().toISOString(),
    };
    current[idx] = updated;
    saveLocalSubmissions(current);
    return updated;
  }
  return null;
}

export async function requestAIEvaluation(submission: ExamSubmission): Promise<any> {
  try {
    const res = await fetch('/api/ai-evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.aiEvaluation) {
        return data.aiEvaluation;
      }
    }
  } catch (e) {
    console.error('AI evaluation request failed:', e);
  }
  return null;
}

/**
 * Generates an individualized 25-question exam paper for a student.
 * Guarantees:
 * 1. Zero science-related questions (physics, chemistry, biology strictly excluded).
 * 2. Absolute uniqueness: No two questions are identical in content or ID for the student.
 * 3. Heavy emphasis on Cognitive IQ, Deductive Logic, Algorithmic Thinking, and Resourcefulness.
 */
export function getStudentExamPaper(
  studentId: string,
  options: {
    isHafiz?: boolean;
    sessionTimestamp?: number;
  } = {}
): Question[] {
  return selectExamQuestionsForStudent(studentId, options);
}

// Re-export question engine selection and validation functions
export {
  selectExamQuestionsForStudent,
  generateExamPaperForCandidate,
  validateCandidateExamPaper,
  getQuestionById,
  isScienceRelated,
  filterOutScienceQuestions,
};

