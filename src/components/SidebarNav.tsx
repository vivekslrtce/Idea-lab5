import React from 'react';
import {
  LayoutDashboard,
  Grid,
  PlusCircle,
  FileText,
  AlertTriangle,
  CheckCircle,
  Shield,
  User,
  LogOut,
  X,
  History
} from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeView,
  onNavigate,
  currentUser,
  onLogout,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'departments', label: 'Departments', icon: Grid },
    { id: 'report-problem', label: 'Report Problem', icon: PlusCircle, highlight: true },
    { id: 'submitted-problems', label: 'Submitted Problems', icon: FileText },
    { id: 'live-issues', label: 'Live Issues', icon: AlertTriangle },
    { id: 'solved-issues', label: 'Solved Issues', icon: CheckCircle },
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Shield, adminOnly: true },
    { id: 'activity-logs', label: 'Activity Audit Logs', icon: History, adminOnly: true },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleSelect = (viewId: string) => {
    onNavigate(viewId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-100 transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:self-start lg:shrink-0 flex flex-col border-r border-slate-800 shadow-xl`}
      >
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden shrink-0">
          <span className="font-bold text-white text-sm">Navigation Menu</span>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info Header in Sidebar */}
        {currentUser && (
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-200">{currentUser.name}</p>
                <p className="truncate text-[11px] text-slate-400">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center rounded-md bg-blue-900/50 px-2 py-0.5 font-semibold text-blue-300 border border-blue-800/50">
                {currentUser.role === 'admin' ? 'Authority Admin' : 'Registered Citizen'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : item.highlight
                    ? 'bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-emerald-400'
                        : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.adminOnly && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-amber-300 border border-amber-500/30">
                    Admin
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        {currentUser && (
          <div className="p-3 border-t border-slate-800 shrink-0">
            <button
              onClick={onLogout}
              className="flex w-full items-center space-x-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
