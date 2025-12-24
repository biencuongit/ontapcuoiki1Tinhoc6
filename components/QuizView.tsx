
import React, { useState, useMemo } from 'react';
import { QuestionBank, Question, Option } from '../types';
import { gradeEssayAnswer } from '../services/geminiService';

interface QuizViewProps {
  bank: QuestionBank;
  onSubmit: (mcAns: Record<string, string>, esAns: Record<string, string>, score: number) => void;
  onCancel: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ bank, onSubmit, onCancel }) => {
  const [mcAnswers, setMcAnswers] = useState<Record<string, string>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Trộn câu hỏi và đáp án nhưng GIỮ NGUYÊN 100% SỐ LƯỢNG (Đảm bảo đủ 56 câu trắc nghiệm và tự luận)
  const shuffledBank = useMemo(() => {
    const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
    
    return {
      mc: shuffle(bank.mcQuestions).map((q: Question) => ({
        ...q,
        options: q.options ? shuffle(q.options as Option[]) : []
      })),
      es: shuffle(bank.essayQuestions) as Question[]
    };
  }, [bank]);

  const getUnfinishedCount = () => {
    const unfinishedMC = shuffledBank.mc.filter(q => !mcAnswers[q.id]).length;
    const unfinishedES = shuffledBank.es.filter(q => !essayAnswers[q.id] || essayAnswers[q.id].trim() === '').length;
    return unfinishedMC + unfinishedES;
  };

  const handleManualSubmit = () => {
    const unfinished = getUnfinishedCount();
    if (unfinished > 0) {
      setShowWarning(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    processSubmission();
  };

  const processSubmission = async () => {
    setIsSubmitting(true);
    
    let mcCorrect = 0;
    shuffledBank.mc.forEach(q => {
      if (mcAnswers[q.id] === q.correctAnswer) mcCorrect++;
    });
    // Tự động chia điểm để tổng trắc nghiệm luôn là 9 điểm
    const mcScore = shuffledBank.mc.length > 0 ? (mcCorrect / shuffledBank.mc.length) * 9 : 0;

    let totalEssayWeightedScore = 0;
    for (const q of shuffledBank.es) {
        const studentAns = essayAnswers[q.id] || '';
        // Chấm điểm thông minh bằng AI
        const score = await gradeEssayAnswer(q.content, studentAns, q.correctAnswer);
        totalEssayWeightedScore += score;
    }
    // Tự động chia điểm để tổng tự luận luôn là 1 điểm
    const essayScore = shuffledBank.es.length > 0 ? (totalEssayWeightedScore / shuffledBank.es.length) * 1 : 1;

    onSubmit(mcAnswers, essayAnswers, Math.min(10, mcScore + essayScore));
  };

  const scrollToQuestion = (id: string, type: 'mc' | 'es') => {
    const el = document.getElementById(`q-${type}-${id}`);
    if (el) {
      const offset = 120; // Tránh bị đè bởi sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const totalQuestions = shuffledBank.mc.length + shuffledBank.es.length;
  const completedCount = Object.keys(mcAnswers).length + Object.keys(essayAnswers).filter(k => essayAnswers[k].trim()).length;

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-40 relative">
      {/* Sidebar: Question Map - Tối ưu cho số lượng lớn (56+ câu) */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 space-y-4 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="font-black text-gray-800 uppercase text-[10px] tracking-widest">Bản đồ câu hỏi</h4>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Tất cả {totalQuestions} câu</span>
          </div>
          
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 custom-scrollbar">
            <div>
              <p className="text-[9px] font-black text-gray-400 mb-2 uppercase tracking-tighter flex items-center gap-1">
                <i className="fa-solid fa-list-check"></i> Trắc nghiệm ({shuffledBank.mc.length})
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {shuffledBank.mc.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => scrollToQuestion(q.id, 'mc')}
                    className={`aspect-square rounded-lg text-[10px] font-bold transition-all border ${mcAnswers[q.id] ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-indigo-200 hover:text-indigo-400'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            
            {shuffledBank.es.length > 0 && (
              <div>
                <p className="text-[9px] font-black text-gray-400 mb-2 uppercase tracking-tighter flex items-center gap-1">
                  <i className="fa-solid fa-pen-nib"></i> Tự luận ({shuffledBank.es.length})
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {shuffledBank.es.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => scrollToQuestion(q.id, 'es')}
                      className={`aspect-square rounded-lg text-[10px] font-bold transition-all border ${essayAnswers[q.id]?.trim() ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-emerald-200 hover:text-emerald-400'}`}
                    >
                      TL{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400">HOÀN THÀNH:</span>
              <span className="text-indigo-600">{completedCount}/{totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-700 ease-out shadow-sm" 
                style={{ width: `${(completedCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-grow space-y-8">
        {/* Header trạng thái - Đã bỏ giới hạn thời gian */}
        <div className="sticky top-16 bg-white/95 backdrop-blur-md shadow-lg p-5 rounded-b-[2rem] flex items-center justify-between border-x border-b border-indigo-50 z-40">
          <div className="flex flex-col">
            <h2 className="font-black text-indigo-900 uppercase text-xs sm:text-sm tracking-tight flex items-center gap-2">
              <i className="fa-solid fa-book-open"></i> {bank.title}
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                <i className="fa-solid fa-check-double text-indigo-400"></i> {completedCount}/{totalQuestions} câu đã làm
              </span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                Luyện tập tự do
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
            >
              {isSubmitting ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
              NỘP BÀI
            </button>
          </div>
        </div>

        {showWarning && (
          <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-[2rem] flex items-start gap-5 animate-in fade-in slide-in-from-top-4">
            <div className="bg-rose-100 p-4 rounded-2xl text-rose-600 shadow-sm">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <div>
              <h4 className="font-black text-rose-900 uppercase text-sm tracking-tight">Cần hoàn thành tất cả các câu!</h4>
              <p className="text-sm text-rose-700 mt-1 leading-relaxed">Đề cương yêu cầu bạn làm đủ <strong>{totalQuestions} câu</strong> để đảm bảo kiến thức. Hiện tại bạn còn <strong>{getUnfinishedCount()} câu</strong> chưa hoàn thành. Hãy kiểm tra lại bản đồ câu hỏi bên cạnh nhé!</p>
            </div>
            <button onClick={() => setShowWarning(false)} className="text-rose-300 hover:text-rose-500 transition-colors">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        )}

        <div className="space-y-12">
          {/* Phần 1: Trắc nghiệm */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-l-8 border-indigo-600 pl-5 py-2">
              <div>
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Phần 1: Trắc nghiệm</h3>
                <div className="flex items-center gap-3 mt-1">
                   <p className="text-xs text-indigo-500 font-bold uppercase">{shuffledBank.mc.length} CÂU HỎI</p>
                   <span className="w-1 h-1 rounded-full bg-indigo-200"></span>
                   <p className="text-xs text-gray-400 font-bold uppercase">9.0 ĐIỂM TỔNG</p>
                </div>
              </div>
            </div>
            
            {shuffledBank.mc.map((q, idx) => (
              <div key={q.id} id={`q-mc-${q.id}`} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border-2 transition-all duration-500 ${mcAnswers[q.id] ? 'border-indigo-100' : 'border-white hover:border-gray-100'}`}>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm transition-all ${mcAnswers[q.id] ? 'bg-indigo-600 text-white rotate-3 scale-110' : 'bg-gray-50 text-indigo-200'}`}>
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-800 text-xl mb-10 leading-relaxed pt-2">
                      {q.content}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options?.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setMcAnswers(prev => ({ ...prev, [q.id]: opt.id }));
                            if (showWarning && getUnfinishedCount() === 0) setShowWarning(false);
                          }}
                          className={`text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-5 group ${mcAnswers[q.id] === opt.id ? 'border-indigo-600 bg-indigo-50 text-indigo-800 ring-8 ring-indigo-50/50' : 'border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/20'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${mcAnswers[q.id] === opt.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-indigo-400'}`}>
                            {opt.id}
                          </div>
                          <span className="font-semibold text-lg">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Phần 2: Tự luận */}
          {shuffledBank.es.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between border-l-8 border-emerald-500 pl-5 py-2">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Phần 2: Tự luận</h3>
                  <div className="flex items-center gap-3 mt-1">
                     <p className="text-xs text-emerald-500 font-bold uppercase">{shuffledBank.es.length} CÂU HỎI</p>
                     <span className="w-1 h-1 rounded-full bg-emerald-200"></span>
                     <p className="text-xs text-gray-400 font-bold uppercase">1.0 ĐIỂM TỔNG</p>
                  </div>
                </div>
              </div>

              {shuffledBank.es.map((q, idx) => (
                <div key={q.id} id={`q-es-${q.id}`} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border-2 transition-all duration-500 ${essayAnswers[q.id]?.trim() ? 'border-emerald-100' : 'border-white hover:border-gray-100'}`}>
                  <div className="flex gap-6">
                     <div className="flex flex-col items-center gap-2">
                      <span className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm transition-all ${essayAnswers[q.id]?.trim() ? 'bg-emerald-500 text-white rotate-3 scale-110' : 'bg-gray-50 text-emerald-200'}`}>
                        {idx + 1}
                      </span>
                      <span className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest">TỰ LUẬN</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800 text-xl mb-8 leading-relaxed pt-2">
                        {q.content}
                      </p>
                      <textarea
                        className="w-full p-8 border-2 border-gray-50 rounded-[2rem] focus:ring-[12px] focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all min-h-[250px] text-gray-700 leading-relaxed text-lg"
                        placeholder="Hãy viết bài giải chi tiết của bạn tại đây để hệ thống chấm điểm..."
                        value={essayAnswers[q.id] || ''}
                        onChange={e => {
                          setEssayAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                          if (showWarning && getUnfinishedCount() === 0) setShowWarning(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Floating Action Bar - Tối ưu cho Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-gray-100 p-6 flex justify-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-4xl flex items-center justify-between gap-8">
            <div className="hidden md:flex flex-col">
               <div className="flex items-center gap-2 mb-1">
                 <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Tiến độ ôn tập</p>
                 <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${completedCount === totalQuestions ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                   {completedCount === totalQuestions ? 'ĐÃ XONG' : `${Math.round((completedCount/totalQuestions)*100)}%`}
                 </span>
               </div>
               <p className="text-xs text-gray-500 font-medium">Đã làm {completedCount} / {totalQuestions} câu. Không giới hạn thời gian.</p>
            </div>
            <button 
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-14 py-4 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-4 group"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  ĐANG CHẤM ĐIỂM...
                </>
              ) : (
                <>
                  NỘP BÀI VÀ XEM ĐÁP ÁN
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </>
              )}
            </button>
          </div>
      </div>
    </div>
  );
};

export default QuizView;
