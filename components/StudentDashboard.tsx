
import React from 'react';
import { User, QuizAttempt, QuestionBank } from '../types';

interface StudentDashboardProps {
  user: User;
  attempts: QuizAttempt[];
  bank: QuestionBank;
  onStartQuiz: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, attempts, bank, onStartQuiz }) => {
  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Chào {user.name}!</h1>
          <p className="text-indigo-100 opacity-90 max-w-md">
            Hôm nay bạn muốn luyện tập phần nào? Đề cương "{bank.title}" đã sẵn sàng với {bank.mcQuestions.length} câu trắc nghiệm và {bank.essayQuestions.length} câu tự luận.
          </p>
          <button 
            onClick={onStartQuiz}
            className="mt-6 bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-play"></i> Bắt đầu làm bài
          </button>
        </div>
        <div className="hidden md:block opacity-20 transform scale-150">
          <i className="fa-solid fa-graduation-cap text-9xl"></i>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-indigo-500"></i> Lịch sử làm bài
        </h2>
        
        {attempts.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-folder-open text-gray-300 text-2xl"></i>
            </div>
            <p className="text-gray-500">Bạn chưa thực hiện bài luyện tập nào.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {attempts.map(attempt => (
              <div key={attempt.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${attempt.score >= 8 ? 'bg-green-100 text-green-600' : attempt.score >= 6 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                    {attempt.score.toFixed(1)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Lần làm thứ {attempts.length - attempts.indexOf(attempt)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(attempt.startTime).toLocaleDateString('vi-VN')} {new Date(attempt.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${attempt.score >= 6 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {attempt.score >= 6 ? 'Đạt' : 'Cần cố gắng'}
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
