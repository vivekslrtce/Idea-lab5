import React, { useState } from 'react';
import { CheckCircle2, MapPin, Calendar, Eye, Search } from 'lucide-react';
import { Complaint } from '../types';

interface SolvedIssuesViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export const SolvedIssuesView: React.FC<SolvedIssuesViewProps> = ({
  complaints,
  onSelectComplaint
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved');

  const filtered = resolvedComplaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-extrabold text-slate-900">Solved Issues Archive</h1>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          Verified and successfully resolved public utility complaint records.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search solved complaints..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Solved List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-bold text-slate-700">No solved records match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/40 via-white to-white p-5 shadow-xs transition hover:border-emerald-300 hover:shadow-md gap-4"
            >
              <div className="flex items-start space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0 shadow-xs">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-blue-700">
                      {item.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">•</span>
                    <span className="text-xs font-semibold text-emerald-800 font-bold">
                      {item.department}
                    </span>
                  </div>
                  <h3 className="mt-0.5 text-base font-bold text-slate-900">{item.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {item.address}, {item.area}
                    </span>
                    <span className="inline-flex items-center text-slate-500">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      Reported: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center text-emerald-700 font-semibold">
                      Resolved: {item.resolvedAt ? new Date(item.resolvedAt).toLocaleDateString() : 'Yes'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                  Resolved
                </span>
                <button
                  type="button"
                  onClick={() => onSelectComplaint(item)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
