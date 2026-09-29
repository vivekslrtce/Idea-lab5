import React from 'react';
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  PlusCircle,
  Grid,
  ChevronRight,
  TrendingUp,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Complaint, User } from '../types';
import { MapVisualizer } from './MapVisualizer';

interface DashboardViewProps {
  complaints: Complaint[];
  currentUser: User | null;
  onNavigate: (view: string, departmentFilter?: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  complaints,
  currentUser,
  onNavigate,
  onSelectComplaint
}) => {
  // Stats Calculations
  const userComplaints = currentUser
    ? currentUser.role === 'admin'
      ? complaints
      : complaints.filter((c) => c.userId === currentUser.id || c.userName === currentUser.name)
    : complaints;

  const totalReports = userComplaints.length;
  const activeIssues = userComplaints.filter(
    (c) => c.status === 'Reported' || c.status === 'Under Review'
  ).length;
  const inProgress = userComplaints.filter((c) => c.status === 'In Progress').length;
  const solvedIssues = userComplaints.filter((c) => c.status === 'Resolved').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Reported':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-700/60 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>City Infrastructure & Utility Monitor</span>
            </span>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Hello, {currentUser ? currentUser.name : 'Citizen'}!
            </h1>
            <p className="mt-1 text-sm text-blue-200 max-w-2xl">
              Track real-time urban issues, report new utility breakdowns, and follow municipal resolution updates across your neighborhood.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('report-problem')}
              className="inline-flex items-center space-x-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-600 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Report New Issue</span>
            </button>
            <button
              onClick={() => onNavigate('departments')}
              className="inline-flex items-center space-x-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 border border-white/20 transition"
            >
              <Grid className="h-4 w-4" />
              <span>Browse Departments</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Required Dashboard Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Reports */}
        <div
          onClick={() => onNavigate('submitted-problems')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Reports
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalReports}</span>
            <span className="text-xs text-slate-500">Registered complaints</span>
          </div>
          <div className="mt-3 flex items-center text-xs font-semibold text-blue-600">
            <span>View all complaints</span>
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Card 2: Active Issues */}
        <div
          onClick={() => onNavigate('live-issues')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-amber-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Issues
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeIssues}</span>
            <span className="text-xs text-amber-600 font-medium">Pending review</span>
          </div>
          <div className="mt-3 flex items-center text-xs font-semibold text-amber-700">
            <span>Reported / Under Review</span>
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div
          onClick={() => onNavigate('live-issues')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-purple-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Progress
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{inProgress}</span>
            <span className="text-xs text-purple-600 font-medium">Work order active</span>
          </div>
          <div className="mt-3 flex items-center text-xs font-semibold text-purple-700">
            <span>Field teams deployed</span>
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Card 4: Solved Issues */}
        <div
          onClick={() => onNavigate('solved-issues')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Solved Issues
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{solvedIssues}</span>
            <span className="text-xs text-emerald-600 font-medium">Fully resolved</span>
          </div>
          <div className="mt-3 flex items-center text-xs font-semibold text-emerald-700">
            <span>View resolved archive</span>
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>
      </div>

      {/* Map Visualizer Section */}
      <MapVisualizer
        complaints={complaints}
        onSelectComplaint={onSelectComplaint}
      />

      {/* Main Content Split: Recent Complaints & Quick Department Access */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Complaints Table/List (2 Cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">Recent Reported Problems</h2>
              <p className="text-xs text-slate-500">Latest municipal issue activity</p>
            </div>
            <button
              onClick={() => onNavigate('submitted-problems')}
              className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>See All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {complaints.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="group flex cursor-pointer items-start justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-blue-300 hover:bg-blue-50/30"
              >
                <div className="flex items-start space-x-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-12 w-12 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0 font-bold text-xs">
                      {item.department.substring(0, 2)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-blue-700">{item.id}</span>
                      <span className="text-xs font-semibold text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">{item.department}</span>
                    </div>
                    <h3 className="mt-0.5 text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                      {item.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-3 text-xs text-slate-500">
                      <span className="inline-flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                        {item.area}, {item.city}
                      </span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1.5 shrink-0">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                  <span
                    className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${getPriorityBadge(
                      item.priority
                    )}`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Departments Overview */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="text-md font-extrabold text-slate-800">Municipal Departments</h2>
            <p className="text-xs text-slate-500 mb-4">Quick issue category routing</p>

            <div className="space-y-2">
              {[
                { name: 'Electricity', icon: '⚡', color: 'bg-amber-50 text-amber-700' },
                { name: 'Water Supply', icon: '💧', color: 'bg-cyan-50 text-cyan-700' },
                { name: 'Street Lights', icon: '💡', color: 'bg-yellow-50 text-yellow-700' },
                { name: 'Roads', icon: '🛣️', color: 'bg-slate-100 text-slate-700' },
                { name: 'Drainage', icon: '🌊', color: 'bg-blue-50 text-blue-700' },
                { name: 'Waste Management', icon: '🗑️', color: 'bg-emerald-50 text-emerald-700' }
              ].map((dept) => {
                const count = complaints.filter((c) => c.department === dept.name).length;
                return (
                  <button
                    key={dept.name}
                    onClick={() => onNavigate('departments', dept.name)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 hover:bg-slate-100 transition text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">{dept.icon}</span>
                      <span className="text-xs font-bold text-slate-700">{dept.name}</span>
                    </div>
                    <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                      {count} reports
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
