
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('6A1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLogin({
      id: Date.now().toString(),
      name,
      role,
      class: role === UserRole.STUDENT ? className : undefined
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Chào mừng bạn trở lại!</h2>
          <p className="text-gray-500 mt-2">Vui lòng chọn vai trò để tiếp tục ôn tập</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
          <button 
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${role === UserRole.STUDENT ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setRole(UserRole.STUDENT)}
          >
            Học sinh
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${role === UserRole.TEACHER ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setRole(UserRole.TEACHER)}
          >
            Giáo viên
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Nhập tên của bạn..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {role === UserRole.STUDENT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={className}
                onChange={e => setClassName(e.target.value)}
              >
                <option>6A1</option>
                <option>6A2</option>
                <option>6A3</option>
                <option>6A4</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 mt-4"
          >
            Bắt đầu ngay
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
