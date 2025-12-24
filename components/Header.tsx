
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-indigo-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">A</div>
          <span className="font-bold text-xl tracking-tight text-indigo-900 hidden sm:inline">Azota Junior</span>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role === 'TEACHER' ? 'Giáo viên' : `Lớp ${user.class}`}</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors"
              title="Đăng xuất"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400 font-medium">Luyện đề trực tuyến</span>
        )}
      </div>
    </header>
  );
};

export default Header;
