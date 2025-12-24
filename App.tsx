
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Question, QuizAttempt, QuestionBank } from './types';
import { INITIAL_MC_QUESTIONS, INITIAL_ESSAY_QUESTIONS } from './constants';
import Header from './components/Header';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import TeacherDashboard from './components/TeacherDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'QUIZ' | 'RESULT' | 'TEACHER'>('LOGIN');
  const [questionBank, setQuestionBank] = useState<QuestionBank>({
    title: 'Đề Cương Cuối Học Kỳ I - Tin Học 6',
    mcQuestions: INITIAL_MC_QUESTIONS,
    essayQuestions: INITIAL_ESSAY_QUESTIONS
  });
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('azota_user');
    const savedBank = localStorage.getItem('azota_bank');
    const savedAttempts = localStorage.getItem('azota_attempts');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedBank) setQuestionBank(JSON.parse(savedBank));
    if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('azota_user', JSON.stringify(user));
    localStorage.setItem('azota_bank', JSON.stringify(questionBank));
    localStorage.setItem('azota_attempts', JSON.stringify(attempts));
  }, [user, questionBank, attempts]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setView(userData.role === UserRole.TEACHER ? 'TEACHER' : 'DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setView('LOGIN');
    localStorage.removeItem('azota_user');
  };

  const startQuiz = () => {
    const newAttempt: QuizAttempt = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      startTime: Date.now(),
      mcAnswers: {},
      essayAnswers: {},
      score: 0,
      status: 'IN_PROGRESS'
    };
    setCurrentAttempt(newAttempt);
    setView('QUIZ');
  };

  const submitQuiz = (mcAns: Record<string, string>, esAns: Record<string, string>, finalScore: number) => {
    if (!currentAttempt) return;

    const completedAttempt: QuizAttempt = {
      ...currentAttempt,
      endTime: Date.now(),
      mcAnswers: mcAns,
      essayAnswers: esAns,
      score: finalScore,
      status: 'COMPLETED'
    };

    setAttempts(prev => [completedAttempt, ...prev]);
    setCurrentAttempt(completedAttempt);
    setView('RESULT');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {view === 'LOGIN' && <Login onLogin={handleLogin} />}
        
        {view === 'DASHBOARD' && user && (
          <StudentDashboard 
            user={user} 
            attempts={attempts.filter(a => a.userId === user.id)} 
            onStartQuiz={startQuiz}
            bank={questionBank}
          />
        )}

        {view === 'QUIZ' && currentAttempt && (
          <QuizView 
            bank={questionBank} 
            onSubmit={submitQuiz}
            onCancel={() => setView('DASHBOARD')}
          />
        )}

        {view === 'RESULT' && currentAttempt && (
          <ResultView 
            attempt={currentAttempt} 
            bank={questionBank}
            onBack={() => setView('DASHBOARD')}
          />
        )}

        {view === 'TEACHER' && user?.role === UserRole.TEACHER && (
          <TeacherDashboard 
            bank={questionBank}
            attempts={attempts}
            onUpdateBank={setQuestionBank}
          />
        )}
      </main>

      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        &copy; 2025 Azota Junior - Nền tảng luyện đề thông minh.
      </footer>
    </div>
  );
};

export default App;
