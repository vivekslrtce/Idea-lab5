import React, { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
  MapPin,
  Edit3
} from 'lucide-react';
import { Complaint, ComplaintStatus, Department, Priority } from '../types';

interface AdminDashboardViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onUpdateComplaint: (updated: Complaint) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  complaints,
  onSelectComplaint,
  onUpdateComplaint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Stats
  const totalComplaints = complaints.length;
  const newReports = complaints.filter((c) => c.status === 'Reported').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'All' || c.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesPriority;
  });

  const handleQuickStatusChange = (complaint: Complaint, status: ComplaintStatus) => {
    const nowIso = new Date().toISOString();
    const updatedHistory = [
      ...complaint.statusHistory,
      {
        status,
        timestamp: nowIso,
        note: `Status updated to ${status} via Admin Quick Action.`
      }
    ];

    const updated: Complaint = {
      ...complaint,
      status,
      updatedAt: nowIso,
      resolvedAt: status === 'Resolved' ? nowIso : complaint.resolvedAt,
      statusHistory: updatedHistory
    };

    onUpdateComplaint(updated);
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Reported':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-900 shadow font-extrabold">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold">Municipal Admin Authority Portal</h1>
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/30">
                ADMIN ROLE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Control center to manage citizen reports, reassign departments, and update work order status.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Admin Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Complaints</span>
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <span className="mt-2 block text-3xl font-extrabold text-slate-900">
            {totalComplaints}
          </span>
          <span className="text-xs text-slate-500">All logged city complaints</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">New Reports</span>
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <span className="mt-2 block text-3xl font-extrabold text-amber-600">{newReports}</span>
          <span className="text-xs text-slate-500">Awaiting initial review</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">In Progress</span>
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <span className="mt-2 block text-3xl font-extrabold text-purple-600">{inProgress}</span>
          <span className="text-xs text-slate-500">Field work dispatched</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Resolved</span>
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="mt-2 block text-3xl font-extrabold text-emerald-600">{resolved}</span>
          <span className="text-xs text-slate-500">Closed & verified</span>
        </div>
      </div>

      {/* Admin Filters & Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Complaint ID, Title, Citizen Name, Address..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Filter Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
            >
              <option value="All">All Departments</option>
              <option value="Electricity">Electricity</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Street Lights">Street Lights</option>
              <option value="Roads">Roads</option>
              <option value="Drainage">Drainage</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Filter Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Filter Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin Table View */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">ID & Title</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Citizen</th>
              <th className="px-4 py-3">Current Status</th>
              <th className="px-4 py-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No records match admin filter parameters.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3">
                    <span className="font-mono font-extrabold text-blue-700">{item.id}</span>
                    <p className="font-bold text-slate-900 mt-0.5 line-clamp-1">{item.title}</p>
                    <span className="text-[10px] text-slate-400">{item.area}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{item.department}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : item.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800">{item.userName}</span>
                    <p className="text-[10px] text-slate-400">{item.userMobile}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleQuickStatusChange(item, e.target.value as ComplaintStatus)
                      }
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 shadow-xs focus:outline-none"
                    >
                      <option value="Reported">Reported</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => onSelectComplaint(item)}
                      className="inline-flex items-center space-x-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 border border-blue-200"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
