
import React from 'react';
import { APP_NAME, DAILY_IMAGE_LIMIT } from '../constants';
import { SparklesIcon, GoogleIcon } from './icons';
import { useAuth } from '../hooks/useDailyLimit';

interface HeaderProps {
  remaining: number;
}

const Header: React.FC<HeaderProps> = ({ remaining }) => {
  const { isLoggedIn, login, logout } = useAuth();
  return (
    <header className="py-4 px-6 md:px-12 border-b border-gray-700/50 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-purple-400" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            {APP_NAME}
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400 bg-gray-800 px-3 py-1.5 rounded-full">
                <span>{remaining} / {DAILY_IMAGE_LIMIT}</span>
                <span className="hidden sm:inline"> صورة متبقية</span>
            </div>
            {isLoggedIn ? (
                <button onClick={logout} className="px-4 py-2 text-sm font-bold bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    تسجيل الخروج
                </button>
            ) : (
                <button onClick={login} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <GoogleIcon className="w-4 h-4" />
                    <span>تسجيل الدخول بـ Google</span>
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
