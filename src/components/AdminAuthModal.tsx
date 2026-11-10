import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, Mail, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';
import { DEMO_ADMIN, isGovInEmail } from '../utils/initialData';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminSuccess: (adminUser: User) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAdminSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide Admin Email and Password.');
      return;
    }

    if (!isGovInEmail(email)) {
      setError('Invalid Admin Email: Domain must be @gov.in (e.g. any name with @gov.in).');
      return;
    }

    let customAdminPass: string | undefined;
    try {
      const raw = localStorage.getItem('ufr_user_passwords');
      if (raw) {
        const parsed = JSON.parse(raw);
        customAdminPass = parsed[email.trim().toLowerCase()];
      }
    } catch {
      // ignore
    }

    if (password === 'admin123' || (customAdminPass && password === customAdminPass)) {
      const emailLower = email.trim().toLowerCase();
      const adminUser: User = {
        id: emailLower === DEMO_ADMIN.email.toLowerCase() ? DEMO_ADMIN.id : `usr-admin-${Date.now()}`,
        name:
          emailLower === DEMO_ADMIN.email.toLowerCase()
            ? DEMO_ADMIN.name
            : `Admin (${emailLower.split('@')[0]})`,
        email: emailLower,
        mobile: DEMO_ADMIN.mobile,
        role: 'admin'
      };
      onAdminSuccess(adminUser);
      setPassword('');
      setEmail('');
      onClose();
    } else {
      setError('Access Denied: Invalid Admin Password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 p-3 sm:p-4 backdrop-blur-md overscroll-contain">
      <div className="flex min-h-full items-center justify-center py-2 sm:py-6">
        <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 overflow-hidden my-auto">
          {/* Sticky / Pinned Header */}
          <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-900 shadow font-extrabold">
                <Shield className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-slate-900 truncate">Admin Authentication Required</h2>
                <p className="text-xs text-slate-500 font-medium truncate">Restricted Municipal Authority Access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto px-5 sm:px-6 py-4 sm:py-5 overscroll-contain flex-1">
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-800 flex items-start space-x-2">
              <KeyRound className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block">Protected Area</span>
                Admin Dashboard & Authority Controls are restricted to authorized personnel. Please enter official credentials.
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center space-x-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Admin Email <span className="normal-case font-normal text-amber-700">(@gov.in domain)</span>
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="official@gov.in"
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Authorized government email (domain must be <span className="font-semibold text-slate-700">@gov.in</span>)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Admin Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Password Format: Minimum 6 characters (case-sensitive)
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-amber-500 py-2.5 text-xs font-extrabold text-slate-900 shadow-md hover:bg-amber-400 transition"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
