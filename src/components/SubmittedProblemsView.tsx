import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Eye, PlusCircle } from 'lucide-react';
import { Complaint, Department, Priority, ComplaintStatus } from '../types';

interface SubmittedProblemsViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigate: (view: string) => void;
  initialDeptFilter?: string | null;
}

export const SubmittedProblemsView: React.FC<SubmittedProblemsViewProps> = ({
  complaints,
  onSelectComplaint,
  onNavigate,
  initialDeptFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDeptFilter || 'All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.area.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDepartment === 'All' || item.department === selectedDepartment;
    const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

    return matchesSearch && matchesDept && matchesPriority && matchesStatus;
  });

  const getStatusStyle = (status: ComplaintStatus) => {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Submitted Complaints</h1>
          <p className="text-sm text-slate-500">
            View, track, and search registered utility breakdown complaints.
          </p>
        </div>
        <button
          onClick={() => onNavigate('report-problem')}
          className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Complaint ID (e.g. UFR-2026-0001), Title, Address..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
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
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
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
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
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

      {/* Complaints List / Table */}
      {filteredComplaints.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-bold text-slate-700">No complaints match your filters.</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting search or category filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md gap-4"
            >
              <div className="flex items-start space-x-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-14 w-14 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shrink-0 font-extrabold text-sm">
                    {item.department.substring(0, 2)}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-blue-700">
                      {item.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {item.department}
                    </span>
                  </div>
                  <h3 className="mt-0.5 text-base font-bold text-slate-900">{item.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {item.address}, {item.area}
                    </span>
                    <span className="inline-flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold border ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

                <button
                  onClick={() => onSelectComplaint(item)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
