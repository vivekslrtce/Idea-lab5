import React, { useState } from 'react';
import { X, Shield, Lock, Mail, AlertCircle, KeyRound } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);

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

    if (password === 'admin123') {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-100">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-900 shadow font-extrabold">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Admin Authentication Required</h2>
              <p className="text-xs text-slate-500 font-medium">Restricted Municipal Authority Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
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
  );
};
