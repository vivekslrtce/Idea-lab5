import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Eye, Search } from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

interface LiveIssuesViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export const LiveIssuesView: React.FC<LiveIssuesViewProps> = ({
  complaints,
  onSelectComplaint
}) => {
  const [activeTab, setActiveTab] = useState<string>('All Live');
  const [searchTerm, setSearchTerm] = useState('');

  // Unresolved complaints only
  const liveComplaints = complaints.filter(
    (c) => c.status === 'Reported' || c.status === 'Under Review' || c.status === 'In Progress'
  );

  const filtered = liveComplaints.filter((c) => {
    const matchesTab = activeTab === 'All Live' || c.status === activeTab;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getBadgeStyle = (status: ComplaintStatus) => {
    switch (status) {
      case 'Reported':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <h1 className="text-2xl font-extrabold text-slate-900">Live Active Issues</h1>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          Real-time tracking of pending municipal utility problems requiring inspection or repair.
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex space-x-2">
          {['All Live', 'Reported', 'Under Review', 'In Progress'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === tab
                  ? 'bg-amber-500 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search live issues..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Grid of Live Issue Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-bold text-slate-700">No active issues found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-amber-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-blue-700">{item.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${getBadgeStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.description}</p>

                <div className="mt-4 space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center space-x-1.5 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {item.address}, {item.area}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Reported on {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {item.priority} Priority
                </span>
                <button
                  type="button"
                  onClick={() => onSelectComplaint(item)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Timeline & Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
