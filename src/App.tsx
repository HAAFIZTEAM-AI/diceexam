import React, { useState, useEffect } from 'react';
import { UnifiedLoginGateway } from './components/LoginGateway/UnifiedLoginGateway';
import { StudentPortal } from './components/StudentPortal/StudentPortal';
import { AdminDashboard } from './components/AdminChecking/AdminDashboard';
import { ExamGradingStudio } from './components/AdminChecking/ExamGradingStudio';
import { ComprehensiveResultCard } from './components/ResultSearching/ComprehensiveResultCard';
import { fetchAllExams, saveLocalSubmissions } from './services/examService';
import {
  StudentProfile,
  ExamSubmission,
  Language,
} from './types';

export default function App() {
  const [sessionRole, setSessionRole] = useState<'gateway' | 'student' | 'admin'>('gateway');
  const [lang, setLang] = useState<Language>('ur');
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);

  // Submissions state
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [selectedAdminSubmission, setSelectedAdminSubmission] = useState<ExamSubmission | null>(null);
  const [viewingResultSubmission, setViewingResultSubmission] = useState<ExamSubmission | null>(null);

  // Initial fetch of submissions
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await fetchAllExams();
      setSubmissions(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Gateway handler: Login as Student
  const handleLoginAsStudent = (enteredStudentId: string) => {
    const cleanId = enteredStudentId.trim();

    // Check if an existing candidate matches this ID
    const existing = submissions.find(
      (s) => s.studentId.toLowerCase() === cleanId.toLowerCase()
    );

    if (existing) {
      setCurrentStudent(existing.student);
    } else {
      // Create a fresh candidate profile with this unique ID
      const newStudent: StudentProfile = {
        studentId: cleanId,
        rollNo: cleanId,
        name: `Candidate (${cleanId})`,
        age: 14,
        grade: 'Class 8',
        school: 'Public High School',
        preferredLanguage: lang,
        createdAt: new Date().toISOString(),
        mustahiqProfile: {
          monthlyIncomeBracket: '25k_50k',
          fatherOccupation: 'Daily Wage / Worker',
          dependentsCount: 5,
          financialHardshipReason: 'Basic living expenses & education needs',
          motivationStatement: 'Determined to study hard and support family',
          preTestEmotion: 'determined',
          needScore: 80,
          isMustahiqEligible: true,
        },
      };
      setCurrentStudent(newStudent);
    }

    setSessionRole('student');
  };

  // Gateway handler: Login as Admin
  const handleLoginAsAdmin = () => {
    setSessionRole('admin');
    setSelectedAdminSubmission(null);
  };

  // Logout / Switch ID handler
  const handleLogout = () => {
    setSessionRole('gateway');
    setCurrentStudent(null);
    setSelectedAdminSubmission(null);
    setViewingResultSubmission(null);
  };

  // Exam submitted inside Student Portal
  const handleExamSubmitted = (submission: ExamSubmission) => {
    setSubmissions((prev) => {
      const filtered = prev.filter((s) => s.studentId !== submission.studentId);
      return [submission, ...filtered];
    });
    loadSubmissions();
  };

  // Admin finished grading
  const handleGradedExam = (updated: ExamSubmission) => {
    setSelectedAdminSubmission(updated);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    loadSubmissions();
  };

  return (
    <div
      dir={lang === 'en' ? 'ltr' : 'rtl'}
      className={`min-h-screen ${
        sessionRole === 'gateway' || sessionRole === 'student'
          ? 'bg-slate-900 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      } flex flex-col selection:bg-indigo-600 selection:text-white ${
        lang === 'ur' ? 'font-urdu' : 'font-sans'
      }`}
    >
      {/* 1. GATEWAY VIEW: Shows on initial load ("enter hote hi sirf student id maange") */}
      {sessionRole === 'gateway' && (
        <UnifiedLoginGateway
          onLoginAsStudent={handleLoginAsStudent}
          onLoginAsAdmin={handleLoginAsAdmin}
          lang={lang}
          onLanguageChange={setLang}
        />
      )}

      {/* 2. STUDENT PORTAL VIEW: Shows 3 options (Aptitude Test, Result, Leaderboard) */}
      {sessionRole === 'student' && currentStudent && (
        <StudentPortal
          student={currentStudent}
          submissions={submissions}
          lang={lang}
          onLanguageChange={setLang}
          onLogout={handleLogout}
          onExamSubmitted={handleExamSubmitted}
        />
      )}

      {/* 3. ADMIN PORTAL VIEW: Accessible strictly with Admin ID (@#$%^&*) */}
      {sessionRole === 'admin' && (
        <div className="flex-1">
          {viewingResultSubmission ? (
            <div className="max-w-4xl mx-auto py-6 px-4">
              <ComprehensiveResultCard
                submission={viewingResultSubmission}
                onBack={() => setViewingResultSubmission(null)}
                lang={lang}
              />
            </div>
          ) : selectedAdminSubmission ? (
            <ExamGradingStudio
              submission={selectedAdminSubmission}
              onBack={() => {
                setSelectedAdminSubmission(null);
                loadSubmissions();
              }}
              onGraded={handleGradedExam}
              lang={lang}
            />
          ) : (
            <AdminDashboard
              submissions={submissions}
              onSelectSubmission={(sub) => setSelectedAdminSubmission(sub)}
              onViewResult={(studentId) => {
                const found = submissions.find(
                  (s) => s.studentId.toLowerCase() === studentId.toLowerCase()
                );
                if (found) setViewingResultSubmission(found);
              }}
              onAutoAllocate={(updated) => {
                setSubmissions(updated);
                saveLocalSubmissions(updated);
              }}
              onLogout={handleLogout}
              lang={lang}
            />
          )}
        </div>
      )}
    </div>
  );
}
