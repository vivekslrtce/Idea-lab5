import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { DEMO_CITIZEN, DEMO_ADMIN, isGovInEmail } from '../utils/initialData';

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
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Admin form state (strictly empty, no credentials given)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

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

    if (isGovInEmail(email) && password === 'admin123') {
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
      onLoginSuccess(adminUser);
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

    setError('Invalid email or password. Please check your credentials.');
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminEmail.trim() || !adminPassword) {
      setError('Please provide Admin Email and Password.');
      return;
    }

    if (!isGovInEmail(adminEmail)) {
      setError('Invalid Admin Email: Domain must be @gov.in (e.g. any name with @gov.in).');
      return;
    }

    if (adminPassword === 'admin123') {
      const emailLower = adminEmail.trim().toLowerCase();
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
      onLoginSuccess(adminUser);
      setAdminEmail('');
      setAdminPassword('');
      onClose();
    } else {
      setError('Access Denied: Invalid Admin Password.');
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric digits and cap strictly at 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(digitsOnly);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanMobileDigits = mobile.replace(/\D/g, '');

    if (!name.trim() || !regEmail.trim() || !cleanMobileDigits || !regPassword) {
      setError('All fields are required.');
      return;
    }

    if (cleanMobileDigits.length !== 10) {
      setError('Enter a Valid Mobile Number');
      return;
    }

    if (!/^[6-9]/.test(cleanMobileDigits)) {
      setError('Enter a Valid Mobile Number');
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

    const formattedMobile = `+91 ${cleanMobileDigits}`;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: regEmail.trim(),
      mobile: formattedMobile,
      role: 'citizen'
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    setSuccess('Registration successful! Logging you in...');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-md ${
                authMode === 'admin'
                  ? 'bg-amber-500 text-slate-900 font-extrabold'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {authMode === 'admin'
                  ? 'Admin Sign In'
                  : authMode === 'register'
                  ? 'Create Citizen Account'
                  : 'Sign In to Portal'}
              </h2>
              <p className="text-xs font-medium text-slate-500">
                {authMode === 'admin'
                  ? 'Restricted Municipal Authority Access'
                  : 'Urban Utility Problem Reporting Platform'}
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

        {authMode === 'admin' && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-800 flex items-start space-x-2">
            <Shield className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold block">Protected Area</span>
              Restricted to authorized municipal personnel. Please enter official credentials.
            </div>
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

        {authMode === 'admin' ? (
          /* ADMIN LOGIN FORM (Strictly no placeholders and no credentials given) */
          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Admin Email <span className="normal-case font-normal text-amber-700">(@gov.in domain)</span>
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Authorized government email (domain must be <span className="font-semibold text-slate-700">@gov.in</span>)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-900 shadow-md hover:bg-amber-400 transition"
            >
              Sign In as Admin
            </button>

            <div className="mt-4 text-center text-xs text-slate-500">
              Citizen Portal?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        ) : authMode === 'login' ? (
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

            <div className="mt-4 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError(null);
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Register Here
              </button>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-center text-xs text-slate-500">
              Admin Login?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('admin');
                  setAdminEmail('');
                  setAdminPassword('');
                  setError(null);
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Mobile Number
                </label>
                <span className="text-[11px] font-semibold text-slate-400">
                  {mobile.length}/10 digits
                </span>
              </div>
              <div className="relative mt-1 flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
                {/* Fixed +91 country code place */}
                <div className="flex items-center space-x-1 border-r border-slate-200 bg-slate-100/90 px-3 py-2 text-xs font-bold text-slate-700 select-none shrink-0">
                  <span className="text-sm">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={mobile}
                  onChange={handleMobileChange}
                  placeholder="9876543210"
                  className="w-full bg-transparent px-3 py-2 text-sm font-semibold tracking-wider text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Enter a Valid Mobile Number
              </p>
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
                  setAuthMode('login');
                  setError(null);
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
              Admin Login?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('admin');
                  setAdminEmail('');
                  setAdminPassword('');
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
