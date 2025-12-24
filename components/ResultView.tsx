
import React from 'react';
import { QuizAttempt, QuestionBank } from '../types';

interface ResultViewProps {
  attempt: QuizAttempt;
  bank: QuestionBank;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ attempt, bank, onBack }) => {
  const isPassed = attempt.score >= 6;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2rem] p-10 text-center shadow-2xl border border-gray-100 overflow-hidden relative">
        <div className={`absolute top-0 left-0 right-0 h-3 ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
        
        <div className="mb-8 flex justify-center">
            <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-8 ${isPassed ? 'border-emerald-50 bg-emerald-100 text-emerald-600' : 'border-rose-50 bg-rose-100 text-rose-600'} shadow-inner`}>
                <span className="text-4xl font-black">{attempt.score.toFixed(1)}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Điểm số</span>
            </div>
        </div>
        
        <h2 className={`text-3xl font-black mb-3 ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
          {isPassed ? 'Tuyệt vời!' : 'Cố gắng lên nhé!'}
        </h2>
        
        <div className="px-6 mb-10">
            {isPassed ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100">
                    <p className="font-bold">Chúc mừng! Bạn đã đạt yêu cầu tối thiểu 6 điểm.</p>
                    <p className="text-sm opacity-90">Bây giờ bạn có thể xem đáp án chi tiết phía dưới để củng cố kiến thức.</p>
                </div>
            ) : (
                <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl border border-rose-100">
                    <p className="font-black text-lg">“Bạn cần đạt tối thiểu 6 điểm để xem đáp án. Vui lòng làm lại bài.”</p>
                    <p className="text-sm mt-2 opacity-90">Đừng nản lòng, hãy xem lại đề cương và thử lại một lần nữa!</p>
                </div>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Thời gian làm</p>
                <p className="font-bold text-gray-800 text-xl">
                    {Math.floor(((attempt.endTime || 0) - attempt.startTime) / 1000 / 60)} phút
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Xếp loại</p>
                <p className={`font-bold text-xl ${attempt.score >= 8 ? 'text-indigo-600' : isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {attempt.score >= 8 ? 'Giỏi' : attempt.score >= 6.5 ? 'Khá' : attempt.score >= 5 ? 'Trung bình' : 'Yếu'}
                </p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
            <button 
                onClick={onBack}
                className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
                Về Trang Chủ
            </button>
            <button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-black py-4 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
            >
                Làm Lại Ngay
            </button>
        </div>
      </div>

      {isPassed ? (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="flex items-center gap-4 border-l-8 border-indigo-600 pl-4 py-2">
                <h3 className="text-2xl font-black text-gray-900 uppercase">Đáp án chi tiết</h3>
            </div>
            
            <div className="space-y-6">
                {bank.mcQuestions.map((q, i) => (
                    <div key={q.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${attempt.mcAnswers[q.id] === q.correctAnswer ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <p className="font-black text-gray-800 mb-6 text-lg">Câu {i + 1}: {q.content}</p>
                        <div className="grid gap-3">
                            {q.options?.map(opt => {
                                const isCorrect = opt.id === q.correctAnswer;
                                const isSelected = attempt.mcAnswers[q.id] === opt.id;
                                
                                return (
                                    <div key={opt.id} className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : isSelected ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-gray-50 border-gray-50 text-gray-500'}`}>
                                        <span className="flex items-center gap-3">
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${isCorrect ? 'bg-emerald-500 text-white' : isSelected ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                {opt.id}
                                            </span>
                                            {opt.text}
                                        </span>
                                        {isCorrect && <i className="fa-solid fa-check-circle text-emerald-500 text-xl"></i>}
                                        {isSelected && !isCorrect && <i className="fa-solid fa-times-circle text-rose-500 text-xl"></i>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                
                {bank.essayQuestions.map((q, i) => (
                    <div key={q.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm border-l-8 border-emerald-500">
                        <p className="font-black text-gray-800 mb-6 text-lg">Tự luận {i + 1}: {q.content}</p>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Câu trả lời của bạn:</p>
                                <p className="text-gray-700 leading-relaxed italic">"{attempt.essayAnswers[q.id] || '(Bỏ trống)'}"</p>
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">Hướng dẫn trả lời / Đáp án mẫu:</p>
                                <p className="text-indigo-900 leading-relaxed font-medium">{q.correctAnswer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-sm border-4 border-dashed border-gray-200 rounded-[2rem] p-12 text-center text-gray-400">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <i className="fa-solid fa-lock"></i>
            </div>
            <p className="font-black text-xl text-gray-500 mb-2 uppercase tracking-tight">Đáp án đang bị khóa</p>
            <p className="text-sm max-w-xs mx-auto">Vui lòng ôn tập lại nội dung và thực hiện bài làm đạt từ 6 điểm trở lên để mở khóa phần này.</p>
        </div>
      )}
    </div>
  );
};

export default ResultView;
