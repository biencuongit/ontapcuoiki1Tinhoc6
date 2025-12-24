
import React, { useState } from 'react';
import { QuestionBank, QuizAttempt, UserRole } from '../types';
import { parseQuestionBankFromText } from '../services/geminiService';

interface TeacherDashboardProps {
  bank: QuestionBank;
  attempts: QuizAttempt[];
  onUpdateBank: (bank: QuestionBank) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ bank, attempts, onUpdateBank }) => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'BANK'>('STATS');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImport = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    const newBank = await parseQuestionBankFromText(inputText);
    if (newBank) {
      onUpdateBank({
        ...bank,
        mcQuestions: newBank.mcQuestions.map((q: any, i: number) => ({ ...q, id: `mc_${Date.now()}_${i}`, type: 'MULTIPLE_CHOICE' })),
        essayQuestions: newBank.essayQuestions.map((q: any, i: number) => ({ ...q, id: `es_${Date.now()}_${i}`, type: 'ESSAY' }))
      });
      setInputText('');
      alert(`Đã cập nhật ngân hàng câu hỏi thành công! Tổng cộng ${newBank.mcQuestions.length + newBank.essayQuestions.length} câu.`);
    } else {
      alert('Có lỗi khi trích xuất dữ liệu. Vui lòng kiểm tra lại nội dung dán vào.');
    }
    setIsProcessing(false);
  };

  const avgScore = attempts.length > 0 ? attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length : 0;
  const passRate = (attempts.filter(a => a.score >= 6).length / (attempts.length || 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button 
          onClick={() => setActiveTab('STATS')}
          className={`px-8 py-3 rounded-2xl font-black transition-all ${activeTab === 'STATS' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
        >
          <i className="fa-solid fa-chart-line mr-2"></i> Thống kê
        </button>
        <button 
          onClick={() => setActiveTab('BANK')}
          className={`px-8 py-3 rounded-2xl font-black transition-all ${activeTab === 'BANK' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
        >
          <i className="fa-solid fa-database mr-2"></i> Ngân hàng đề ({bank.mcQuestions.length + bank.essayQuestions.length})
        </button>
      </div>

      {activeTab === 'STATS' ? (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tổng số lượt luyện</p>
                    <p className="text-5xl font-black text-indigo-600">{attempts.length}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Trung bình cả lớp</p>
                    <p className="text-5xl font-black text-emerald-500">{avgScore.toFixed(1)}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tỉ lệ đạt (>= 6.0)</p>
                    <p className="text-5xl font-black text-orange-500">{passRate.toFixed(0)}%</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-black text-gray-800 uppercase text-sm">Danh sách học sinh vừa làm bài</h3>
                    <span className="text-xs text-gray-400 font-bold">{attempts.length} bản ghi</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-4">Thời gian</th>
                                <th className="px-8 py-4">Tên học sinh</th>
                                <th className="px-8 py-4">Lớp</th>
                                <th className="px-8 py-4">Điểm</th>
                                <th className="px-8 py-4">Kết quả</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {attempts.map(a => (
                                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">{new Date(a.startTime).toLocaleString('vi-VN')}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-800">User #{a.userId.slice(-4)}</td>
                                    <td className="px-8 py-5 text-sm text-gray-500">6A1</td>
                                    <td className="px-8 py-5 text-sm font-black text-indigo-600">{a.score.toFixed(1)}</td>
                                    <td className="px-8 py-5 text-sm">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${a.score >= 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {a.score >= 6 ? 'Đạt yêu cầu' : 'Chưa đạt'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {attempts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <i className="fa-solid fa-inbox text-4xl text-gray-200 mb-4 block"></i>
                                        <p className="text-gray-400 font-bold">Chưa có dữ liệu học sinh làm bài.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      ) : (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-gray-800 uppercase text-sm flex items-center gap-2">
                        <i className="fa-solid fa-file-circle-plus text-indigo-500"></i> Nhập 100% đề cương (AI Power)
                    </h3>
                    <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        Công nghệ trích xuất Gemini 3
                    </div>
                </div>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Để đảm bảo học sinh học đầy đủ, hãy dán toàn bộ nội dung file Word/Excel đề cương vào đây. Hệ thống sẽ trích xuất <strong>tất cả</strong> các câu hỏi không bỏ sót câu nào.</p>
                <textarea 
                    className="w-full h-64 p-6 border-2 border-gray-50 rounded-[2rem] focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all mb-6 text-sm font-mono leading-relaxed"
                    placeholder="Hãy dán nội dung văn bản đề cương của bạn vào đây... (Ví dụ: Câu 1: ... A. ... B. ...)"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                />
                <button 
                    onClick={handleImport}
                    disabled={isProcessing || !inputText}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-lg"
                >
                    {isProcessing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                    PHÂN TÍCH VÀ CẬP NHẬT TOÀN BỘ ĐỀ CƯƠNG
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <h4 className="font-black text-gray-800 uppercase text-xs">Trắc nghiệm ({bank.mcQuestions.length})</h4>
                        <span className="text-[10px] font-bold text-gray-400">9.0 điểm tổng</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {bank.mcQuestions.map((q, i) => (
                            <div key={q.id} className="text-sm p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="font-bold text-gray-800 leading-relaxed mb-2"><span className="text-indigo-600 mr-2">{i+1}.</span>{q.content}</p>
                                <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest"><i className="fa-solid fa-check-double mr-1"></i> Đáp án: {q.correctAnswer}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <h4 className="font-black text-gray-800 uppercase text-xs">Tự luận ({bank.essayQuestions.length})</h4>
                        <span className="text-[10px] font-bold text-gray-400">1.0 điểm tổng</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {bank.essayQuestions.map((q, i) => (
                            <div key={q.id} className="text-sm p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="font-bold text-gray-800 leading-relaxed mb-2"><span className="text-emerald-600 mr-2">{i+1}.</span>{q.content}</p>
                                <div className="bg-white p-3 rounded-xl border border-gray-200 text-[10px] text-gray-500 leading-relaxed">
                                    <span className="font-black text-indigo-400 uppercase mr-1">Gợi ý:</span>
                                    {q.correctAnswer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
