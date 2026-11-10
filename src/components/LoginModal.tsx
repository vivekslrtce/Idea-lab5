import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
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

const getStoredPasswords = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem('ufr_user_passwords');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const storePassword = (userEmail: string, pass: string) => {
  try {
    const map = getStoredPasswords();
    map[userEmail.toLowerCase()] = pass;
    localStorage.setItem('ufr_user_passwords', JSON.stringify(map));
  } catch (e) {
    console.error('Failed to store password', e);
  }
};

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  canClose = true
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin form state (strictly empty, no credentials given)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Register form state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetAllFields = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setAdminEmail('');
    setAdminPassword('');
    setShowAdminPassword(false);
    setName('');
    setRegEmail('');
    setMobile('');
    setRegPassword('');
    setConfirmPassword('');
    setShowRegPassword(false);
    setShowConfirmPassword(false);
    setForgotEmail('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setShowForgotNewPassword(false);
    setError(null);
    setSuccess(null);
    setAuthMode('login');
  };

  // Erase all credentials and inputs whenever the modal opens or upon logout
  useEffect(() => {
    if (isOpen) {
      resetAllFields();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    const passwords = getStoredPasswords();
    const cleanEmail = email.trim().toLowerCase();
    const customPass = passwords[cleanEmail];

    // Citizen login check
    if (
      cleanEmail === DEMO_CITIZEN.email.toLowerCase() &&
      (password === 'password123' || (customPass && password === customPass))
    ) {
      resetAllFields();
      onLoginSuccess(DEMO_CITIZEN);
      onClose();
      return;
    }

    // Admin login in regular form
    if (isGovInEmail(cleanEmail)) {
      if (password === 'admin123' || (customPass && password === customPass)) {
        const adminUser: User = {
          id: cleanEmail === DEMO_ADMIN.email.toLowerCase() ? DEMO_ADMIN.id : `usr-admin-${Date.now()}`,
          name:
            cleanEmail === DEMO_ADMIN.email.toLowerCase()
              ? DEMO_ADMIN.name
              : `Admin (${cleanEmail.split('@')[0]})`,
          email: cleanEmail,
          mobile: DEMO_ADMIN.mobile,
          role: 'admin'
        };
        resetAllFields();
        onLoginSuccess(adminUser);
        onClose();
        return;
      }
    }

    // Check custom registered users
    const matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (matchedUser) {
      if (!customPass || password === customPass) {
        resetAllFields();
        onLoginSuccess(matchedUser);
        onClose();
        return;
      }
    }

    setError('Invalid email or password. Please check your credentials or reset your password.');
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

    const passwords = getStoredPasswords();
    const cleanAdminEmail = adminEmail.trim().toLowerCase();
    const customAdminPass = passwords[cleanAdminEmail];

    if (adminPassword === 'admin123' || (customAdminPass && adminPassword === customAdminPass)) {
      const adminUser: User = {
        id: cleanAdminEmail === DEMO_ADMIN.email.toLowerCase() ? DEMO_ADMIN.id : `usr-admin-${Date.now()}`,
        name:
          cleanAdminEmail === DEMO_ADMIN.email.toLowerCase()
            ? DEMO_ADMIN.name
            : `Admin (${cleanAdminEmail.split('@')[0]})`,
        email: cleanAdminEmail,
        mobile: DEMO_ADMIN.mobile,
        role: 'admin'
      };
      resetAllFields();
      onLoginSuccess(adminUser);
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
      setError('Password format error: Must be at least 6 characters long.');
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

    // Store custom registered password
    storePassword(regEmail.trim(), regPassword);

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    setSuccess('Registration successful! Logging you in...');
    setTimeout(() => {
      resetAllFields();
      onClose();
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!forgotEmail.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!forgotNewPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setError('Password format error: Must be at least 6 characters long.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const isCitizen = cleanEmail === DEMO_CITIZEN.email.toLowerCase();
    const isAdmin = isGovInEmail(cleanEmail);
    const isRegistered = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);

    if (!isCitizen && !isAdmin && !isRegistered) {
      setError('No account found with this email. Please verify your email or register a new account.');
      return;
    }

    // Save updated password
    storePassword(cleanEmail, forgotNewPassword);

    setSuccess('Password updated successfully! Redirecting to sign in...');
    setTimeout(() => {
      setEmail(cleanEmail);
      setPassword('');
      setAuthMode('login');
      setSuccess(null);
      setError(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 p-3 sm:p-4 backdrop-blur-sm overscroll-contain">
      <div className="flex min-h-full items-center justify-center py-2 sm:py-6">
        <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-100 transition-all overflow-hidden my-auto">
          {/* Sticky / Pinned Header */}
          <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {authMode !== 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="mr-0.5 shrink-0 rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                  title="Back to Login / Sign In"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md ${
                  authMode === 'admin'
                    ? 'bg-amber-500 text-slate-900 font-extrabold'
                    : authMode === 'forgot'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {authMode === 'forgot' ? (
                  <KeyRound className="h-5 w-5" />
                ) : (
                  <Shield className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                  {authMode === 'admin'
                    ? 'Admin Sign In'
                    : authMode === 'register'
                    ? 'Create Citizen Account'
                    : authMode === 'forgot'
                    ? 'Reset Password'
                    : 'Sign In to Portal'}
                </h2>
                <p className="text-xs font-medium text-slate-500 truncate">
                  {authMode === 'admin'
                    ? 'Restricted Municipal Authority Access'
                    : authMode === 'forgot'
                    ? 'Recover or update your account password'
                    : 'Urban Utility Problem Reporting Platform'}
                </p>
              </div>
            </div>
            {canClose && (
              <button
                onClick={onClose}
                className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto px-5 sm:px-6 py-4 sm:py-5 overscroll-contain flex-1">
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
            <div className="flex items-center justify-between pb-0.5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Citizen Login</span>
              </button>
            </div>

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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    setForgotEmail(adminEmail);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-sm font-medium text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Password Format: Minimum 6 characters (case-sensitive)
              </p>
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
        ) : authMode === 'forgot' ? (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-800 flex items-start space-x-2">
              <KeyRound className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <span className="font-bold block">Reset Password</span>
                Enter your registered email address and define a new secure password.
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Registered Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                New Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showForgotNewPassword ? 'text' : 'password'}
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showForgotNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Password Format: Minimum 6 characters (case-sensitive)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showForgotNewPassword ? 'text' : 'password'}
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="w-1/3 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Login</span>
              </button>
              <button
                type="submit"
                className="w-2/3 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
              >
                Save & Update Password
              </button>
            </div>
          </form>
        ) : authMode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
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
                  placeholder="Enter your email address"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    setForgotEmail(email);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                <span>Password Format: Min. 6 characters</span>
                <span className="text-slate-400 font-medium">Case-sensitive</span>
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
            {/* Back to Sign In button at top of registration form */}
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 rounded-lg py-1 px-1.5 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In / Login</span>
              </button>
              <span className="text-[11px] font-semibold text-slate-400">Citizen Sign Up</span>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showRegPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              Password Format: Minimum 6 characters (case-sensitive)
            </p>

            {/* Action buttons with Back to Login & Complete Registration */}
            <div className="flex items-center space-x-2 pt-1.5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="w-1/3 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Login</span>
              </button>
              <button
                type="submit"
                className="w-2/3 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
              >
                Complete Registration
              </button>
            </div>

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
      </div>
    </div>
  );
};
