import React from 'react';
import { Building2, Shield, User as UserIcon, LogOut, PlusCircle, Menu } from 'lucide-react';
import { User } from '../types';

interface HeaderNavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  onToggleSidebar: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigate,
  onToggleSidebar
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-900/10 bg-blue-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Side: Menu toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-blue-200 hover:bg-blue-800 lg:hidden"
            title="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex cursor-pointer items-center space-x-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg group-hover:bg-blue-500 transition">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-white">UrbanFix</span>
                <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  Civic Portal
                </span>
              </div>
              <p className="hidden text-xs text-blue-200 sm:block">
                Urban Utility Problem Reporting Platform
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('report-problem')}
            className="hidden items-center space-x-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-600 sm:inline-flex transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Report Problem</span>
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div
                onClick={() => onNavigate('profile')}
                className="flex cursor-pointer items-center space-x-2 rounded-xl bg-blue-800/80 px-3 py-1.5 border border-blue-700 hover:bg-blue-800 transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {currentUser.role === 'admin' ? (
                    <Shield className="h-4 w-4 text-amber-300" />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold leading-none text-white">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] font-medium text-blue-300 capitalize">
                    {currentUser.role === 'admin' ? 'Authority Admin' : 'Citizen'}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="rounded-xl border border-blue-700/60 p-2 text-blue-200 hover:bg-blue-800 hover:text-white"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
