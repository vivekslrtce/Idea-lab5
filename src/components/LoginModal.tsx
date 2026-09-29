import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { DEMO_CITIZEN, DEMO_ADMIN } from '../utils/initialData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (newUser: User) => void;
  canClose?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  canClose = true
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (email === DEMO_CITIZEN.email && password === 'password123') {
      onLoginSuccess(DEMO_CITIZEN);
      onClose();
      return;
    }

    if (email === DEMO_ADMIN.email && password === 'admin123') {
      onLoginSuccess(DEMO_ADMIN);
      onClose();
      return;
    }

    // Check custom registered users
    const matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      onLoginSuccess(matchedUser);
      onClose();
      return;
    }

    setError('Invalid email or password. You can also use the Demo login buttons below!');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !regEmail.trim() || !mobile.trim() || !regPassword) {
      setError('All fields are required.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (registeredUsers.some((u) => u.email.toLowerCase() === regEmail.toLowerCase())) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: regEmail.trim(),
      mobile: mobile.trim(),
      role: 'citizen'
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    setSuccess('Registration successful! Logging you in...');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const loginAsDemoCitizen = () => {
    onLoginSuccess(DEMO_CITIZEN);
    onClose();
  };

  const loginAsDemoAdmin = () => {
    onLoginSuccess(DEMO_ADMIN);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isRegistering ? 'Create Citizen Account' : 'Sign In to Portal'}
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Urban Utility Problem Reporting Platform
              </p>
            </div>
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {!canClose && (
          <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-2.5 text-center text-xs font-bold text-blue-800">
            🔒 Authentication Required: Please sign in or register to access the civic portal.
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center space-x-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {!isRegistering ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. citizen@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              Sign In
            </button>

            {/* Quick Demo Fill Buttons */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                ⚡ Fill Demo Account Fields
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(DEMO_CITIZEN.email);
                    setPassword('password123');
                  }}
                  className="rounded-lg border border-blue-200 bg-white py-2 px-3 text-xs font-bold text-blue-700 shadow-xs hover:bg-blue-50"
                >
                  Citizen Fields
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(DEMO_ADMIN.email);
                    setPassword('admin123');
                  }}
                  className="rounded-lg border border-purple-200 bg-white py-2 px-3 text-xs font-bold text-purple-700 shadow-xs hover:bg-purple-50"
                >
                  Admin Fields
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Note: Click "Sign In" above to verify credentials and access the portal.
              </p>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError(null);
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Register Here
              </button>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Full Name
              </label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Mobile Number
              </label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              Complete Registration
            </button>

            <div className="mt-3 text-center text-xs text-slate-500">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError(null);
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
