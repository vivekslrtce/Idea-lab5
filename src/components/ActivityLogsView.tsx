import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Download,
  Shield,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  LogIn,
  LogOut,
  UserPlus,
  ArrowRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { ActivityLog, ActivityActionType, Complaint, User } from '../types';
import {
  getActivityLogs,
  clearActivityLogs,
  resetActivityLogs,
  ACTIVITY_LOGS_STORAGE_KEY
} from '../utils/activityLogger';

interface ActivityLogsViewProps {
  currentUser: User | null;
  complaints: Complaint[];
  onSelectComplaint?: (complaint: Complaint) => void;
  onNavigate?: (view: string) => void;
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({
  currentUser,
  complaints,
  onSelectComplaint,
  onNavigate
}) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'citizen' | 'admin'>('ALL');
  const [actionCategory, setActionCategory] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadLogs = () => {
    const data = getActivityLogs();
    setLogs(data);
  };

  useEffect(() => {
    loadLogs();

    const handleUpdate = () => {
      loadLogs();
    };

    window.addEventListener('ufr_activity_logs_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('ufr_activity_logs_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClearLogs = () => {
    clearActivityLogs();
    setLogs([]);
    setShowClearConfirm(false);
    showToast('Activity logs have been successfully cleared from localStorage.');
  };

  const handleResetLogs = () => {
    resetActivityLogs();
    loadLogs();
    showToast('Restored default demo audit activity logs.');
  };

  const handleExportJson = () => {
    const raw = localStorage.getItem(ACTIVITY_LOGS_STORAGE_KEY) || '[]';
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ufr-audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported audit activity logs as JSON.');
  };

  // Filter & Search logic
  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.targetId && log.targetId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = roleFilter === 'ALL' || log.userRole === roleFilter;

      let matchesCategory = true;
      if (actionCategory === 'COMPLAINTS') {
        matchesCategory = log.action === 'COMPLAINT_CREATED' || log.action === 'COMPLAINT_UPDATED';
      } else if (actionCategory === 'STATUS') {
        matchesCategory = log.action === 'COMPLAINT_STATUS_UPDATED';
      } else if (actionCategory === 'AUTH') {
        matchesCategory =
          log.action === 'USER_LOGIN' ||
          log.action === 'USER_LOGOUT' ||
          log.action === 'USER_REGISTER';
      } else if (actionCategory === 'PROFILE') {
        matchesCategory = log.action === 'PROFILE_UPDATED';
      }

      return matchesSearch && matchesRole && matchesCategory;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  // Analytics Metrics
  const totalCount = logs.length;
  const citizenActions = logs.filter((l) => l.userRole === 'citizen').length;
  const adminActions = logs.filter((l) => l.userRole === 'admin').length;
  const nowMs = Date.now();
  const past24hCount = logs.filter((l) => {
    const logTime = new Date(l.timestamp).getTime();
    return nowMs - logTime <= 24 * 60 * 60 * 1000;
  }).length;

  const getActionBadge = (action: ActivityActionType) => {
    switch (action) {
      case 'COMPLAINT_CREATED':
        return {
          icon: FileText,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Report Lodged'
        };
      case 'COMPLAINT_STATUS_UPDATED':
        return {
          icon: RefreshCw,
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Status Change'
        };
      case 'COMPLAINT_UPDATED':
        return {
          icon: ArrowRight,
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          label: 'Complaint Updated'
        };
      case 'USER_LOGIN':
        return {
          icon: LogIn,
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Sign In'
        };
      case 'USER_LOGOUT':
        return {
          icon: LogOut,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'Sign Out'
        };
      case 'USER_REGISTER':
        return {
          icon: UserPlus,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          label: 'New Account'
        };
      case 'PROFILE_UPDATED':
        return {
          icon: UserIcon,
          bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          label: 'Profile Edited'
        };
      default:
        return {
          icon: History,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          label: action
        };
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return {
        formatted: date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        relative: getRelativeTimeString(date)
      };
    } catch {
      return { formatted: iso, relative: '' };
    }
  };

  const getRelativeTimeString = (date: Date): string => {
    const diffSeconds = Math.round((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 60) return 'just now';
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleTargetClick = (targetId: string) => {
    if (targetId.startsWith('UFR-') && onSelectComplaint) {
      const match = complaints.find((c) => c.id.toLowerCase() === targetId.toLowerCase());
      if (match) {
        onSelectComplaint(match);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xl transition-all">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow font-extrabold">
            <History className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold">Activity & Audit Logs</h1>
              <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-extrabold text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Admin Exclusive
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditable activity trail recorded in LocalStorage (<code className="text-amber-300 font-mono">ufr_activity_logs</code>).
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadLogs}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition shadow-xs"
            title="Reload from local storage"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportJson}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-blue-500/30 bg-blue-600/20 px-3.5 py-2 text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition shadow-xs"
            title="Download JSON file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-red-500/30 bg-red-600/10 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-600/20 transition shadow-xs"
            title="Clear all logs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Logs */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3 text-red-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Clear Activity Logs?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              This will remove all recorded audit events from your browser's <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">ufr_activity_logs</code> storage array. You can restore the initial demo logs at any time.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleResetLogs}
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
              >
                Reset to Demo
              </button>
              <button
                onClick={handleClearLogs}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Audit Logs</span>
            <History className="h-5 w-5 text-blue-600" />
          </div>
          <span className="mt-2 block text-3xl font-extrabold text-slate-900">{totalCount}</span>
          <span className="text-xs text-slate-500">Stored in localStorage</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Citizen Actions</span>
            <UserIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="mt-2 block text-3xl font-extrabold text-emerald-600">{citizenActions}</span>
          <span className="text-xs text-slate-500">Lodged reports & logins</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Admin Actions</span>
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <span className="mt-2 block text-3xl font-extrabold text-purple-600">{adminActions}</span>
          <span className="text-xs text-slate-500">Reviews & status updates</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Past 24 Hours</span>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <span className="mt-2 block text-3xl font-extrabold text-amber-600">{past24hCount}</span>
          <span className="text-xs text-slate-500">Recent municipal activity</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, email, complaint ID, or action..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Role Filter */}
          <div className="md:col-span-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="citizen">Citizens Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>

          {/* Action Category Filter */}
          <div className="md:col-span-3">
            <select
              value={actionCategory}
              onChange={(e) => setActionCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Action Types</option>
              <option value="COMPLAINTS">Complaints Lodged & Updated</option>
              <option value="STATUS">Status Transitions</option>
              <option value="AUTH">Sign In / Sign Out / Register</option>
              <option value="PROFILE">Profile Updates</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="w-full flex items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        {/* Active Filter Pill Counter */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredLogs.length}</strong> of{' '}
            <strong className="text-slate-800">{logs.length}</strong> activity logs
          </span>
          {(searchTerm || roleFilter !== 'ALL' || actionCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('ALL');
                setActionCategory('ALL');
              }}
              className="font-bold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Logs List Table / Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <History className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No activity logs found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {logs.length === 0
                ? "The 'ufr_activity_logs' storage array is currently empty. Try performing an action or click 'Reset to Demo' above."
                : 'No logs match your current filter and search criteria.'}
            </p>
            {logs.length === 0 && (
              <button
                onClick={handleResetLogs}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
              >
                Load Sample Demo Logs
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const BadgeIcon = badge.icon;
              const time = formatTimestamp(log.timestamp);
              const isComplaintTarget = log.targetId && log.targetId.startsWith('UFR-');

              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Action Icon Pill */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${badge.bg} shadow-2xs mt-0.5`}
                    >
                      <BadgeIcon className="h-5 w-5" />
                    </div>

                    {/* Main Content */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{log.title}</span>

                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>

                        {log.targetId && (
                          <button
                            type="button"
                            onClick={() => handleTargetClick(log.targetId!)}
                            className={`inline-flex items-center space-x-1 rounded-md px-2 py-0.5 text-[11px] font-mono font-bold border ${
                              isComplaintTarget
                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer'
                                : 'bg-slate-100 text-slate-600 border-slate-200 cursor-default'
                            }`}
                            title={isComplaintTarget ? 'Click to inspect complaint' : undefined}
                          >
                            <span>{log.targetId}</span>
                            {isComplaintTarget && <ExternalLink className="h-3 w-3" />}
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {log.description}
                      </p>

                      {/* Metadata tags if present */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {log.metadata.department && (
                            <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                              Dept: <strong className="text-slate-900">{log.metadata.department}</strong>
                            </span>
                          )}
                          {log.metadata.priority && (
                            <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                              Priority: <strong className="text-slate-900">{log.metadata.priority}</strong>
                            </span>
                          )}
                          {log.metadata.previousStatus && log.metadata.newStatus && (
                            <span className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                              {log.metadata.previousStatus} ➔ {log.metadata.newStatus}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actor and Timestamp Meta */}
                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-slate-800">{log.userName}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase border ${
                          log.userRole === 'admin'
                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {log.userRole}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                      <span>{time.formatted}</span>
                      {time.relative && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500 text-[10px]">
                          {time.relative}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
