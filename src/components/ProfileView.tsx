import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Shield, Edit3, LogOut, FileText, Clock, CheckCircle2, Save } from 'lucide-react';
import { User, Complaint } from '../types';

interface ProfileViewProps {
  currentUser: User | null;
  complaints: Complaint[];
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  complaints,
  onUpdateUser,
  onLogout,
  onSwitchRole
}) => {
  if (!currentUser) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [mobile, setMobile] = useState(currentUser.mobile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User stats
  const userComplaints =
    currentUser.role === 'admin'
      ? complaints
      : complaints.filter((c) => c.userId === currentUser.id || c.userName === currentUser.name);

  const totalReports = userComplaints.length;
  const activeReports = userComplaints.filter((c) => c.status !== 'Resolved').length;
  const solvedReports = userComplaints.filter((c) => c.status === 'Resolved').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim()
    };
    onUpdateUser(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">User Profile</h1>
        <p className="text-sm text-slate-500">
          Account details, contact information, and complaint reporting history.
        </p>
      </div>

      {saveSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          Profile updated successfully!
        </div>
      )}

      {/* Main Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-extrabold text-white shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-blue-800 border border-blue-200">
                  {currentUser.role === 'admin' ? 'Authority Admin' : 'Citizen'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                if (currentUser.role === 'citizen') {
                  onSwitchRole(); // Will trigger Admin Auth modal in App
                } else {
                  onSwitchRole(); // Admin switching back to citizen
                }
              }}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs font-bold text-purple-700 hover:bg-purple-100"
            >
              <Shield className="h-4 w-4" />
              <span>{currentUser.role === 'admin' ? 'Switch to Citizen' : 'Admin Login Required'}</span>
            </button>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100 text-center">
            <FileText className="h-5 w-5 text-blue-600 mx-auto" />
            <span className="block text-2xl font-extrabold text-blue-900 mt-1">{totalReports}</span>
            <span className="text-xs font-semibold text-blue-700">Total Reports</span>
          </div>

          <div className="rounded-xl bg-amber-50/60 p-4 border border-amber-100 text-center">
            <Clock className="h-5 w-5 text-amber-600 mx-auto" />
            <span className="block text-2xl font-extrabold text-amber-900 mt-1">
              {activeReports}
            </span>
            <span className="text-xs font-semibold text-amber-700">Active Reports</span>
          </div>

          <div className="rounded-xl bg-emerald-50/60 p-4 border border-emerald-100 text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
            <span className="block text-2xl font-extrabold text-emerald-900 mt-1">
              {solvedReports}
            </span>
            <span className="text-xs font-semibold text-emerald-700">Solved Reports</span>
          </div>
        </div>

        {/* Details or Edit Form */}
        {!isEditing ? (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="block font-semibold text-slate-400">Full Name</span>
                <span className="block text-sm font-bold text-slate-800 mt-0.5">
                  {currentUser.name}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="block font-semibold text-slate-400">Email Address</span>
                <span className="block text-sm font-bold text-slate-800 mt-0.5">
                  {currentUser.email}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 sm:col-span-2">
                <span className="block font-semibold text-slate-400">Mobile Number</span>
                <span className="block text-sm font-bold text-slate-800 mt-0.5">
                  {currentUser.mobile}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Account ID: {currentUser.id}</span>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:underline"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
