import React from 'react';
import {
  Zap,
  Droplets,
  Lightbulb,
  Construction,
  Waves,
  Trash2,
  HelpCircle,
  PlusCircle,
  ListFilter
} from 'lucide-react';
import { Department, Complaint } from '../types';

interface DepartmentsViewProps {
  complaints: Complaint[];
  onReportForDepartment: (dept: Department) => void;
  onFilterByDepartment: (dept: Department) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  complaints,
  onReportForDepartment,
  onFilterByDepartment
}) => {
  const departmentsList: {
    id: Department;
    title: string;
    description: string;
    icon: React.ElementType;
    bgGradient: string;
    iconColor: string;
    badgeBg: string;
    examples: string[];
  }[] = [
    {
      id: 'Electricity',
      title: 'Electricity',
      description: 'Power outages, line sparking, dangerous hanging wires, and feeder breakdowns.',
      icon: Zap,
      bgGradient: 'from-amber-500 to-yellow-600',
      iconColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800',
      examples: ['Pole sparking', 'Low voltage', 'Unannounced power cuts', 'Transformer faults']
    },
    {
      id: 'Water Supply',
      title: 'Water Supply',
      description: 'Pipeline leakages, low water pressure, contaminated supply, and tanker delays.',
      icon: Droplets,
      bgGradient: 'from-cyan-500 to-blue-600',
      iconColor: 'text-cyan-600',
      badgeBg: 'bg-cyan-100 text-cyan-800',
      examples: ['Underground pipe burst', 'No water supply', 'Dirty/smelly water', 'Valve leaks']
    },
    {
      id: 'Street Lights',
      title: 'Street Lights',
      description: 'Non-functional street lamps, damaged poles, dark stretches, and day-time glowing lights.',
      icon: Lightbulb,
      bgGradient: 'from-yellow-400 to-amber-500',
      iconColor: 'text-yellow-600',
      badgeBg: 'bg-yellow-100 text-yellow-800',
      examples: ['Broken LED fixture', 'Dark road risk', 'Flickering street lamp', 'Pole tilt']
    },
    {
      id: 'Roads',
      title: 'Roads',
      description: 'Potholes, surface cracks, damaged footpaths, missing dividers, and speed breaker repairs.',
      icon: Construction,
      bgGradient: 'from-slate-600 to-slate-800',
      iconColor: 'text-slate-700',
      badgeBg: 'bg-slate-100 text-slate-800',
      examples: ['Deep road potholes', 'Broken pavement', 'Unpaved road trench', 'Damaged manhole cover']
    },
    {
      id: 'Drainage',
      title: 'Drainage',
      description: 'Blocked gutters, waterlogging, overflowing sewage lines, and stagnant water hazards.',
      icon: Waves,
      bgGradient: 'from-blue-600 to-indigo-700',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-blue-100 text-blue-800',
      examples: ['Storm drain blockage', 'Sewage overflow', 'Street flooding', 'Foul odor from drain']
    },
    {
      id: 'Waste Management',
      title: 'Waste Management',
      description: 'Uncollected garbage, overflowing community bins, open littering, and sweeping complaints.',
      icon: Trash2,
      bgGradient: 'from-emerald-500 to-teal-700',
      iconColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      examples: ['Overflowing bin', 'Missed trash pickup', 'Illegal waste dumping', 'Street littering']
    },
    {
      id: 'Other',
      title: 'Other Utilities',
      description: 'Public park upkeep, animal control, stray hazards, and general civic infrastructure issues.',
      icon: HelpCircle,
      bgGradient: 'from-purple-500 to-indigo-600',
      iconColor: 'text-purple-600',
      badgeBg: 'bg-purple-100 text-purple-800',
      examples: ['Encroachments', 'Public park damage', 'Stray animal hazard', 'Noise pollution']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Municipal Departments</h1>
        <p className="text-sm text-slate-500">
          Select a utility department to report a problem or inspect active citizen reports.
        </p>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departmentsList.map((dept) => {
          const Icon = dept.icon;
          const totalDeptReports = complaints.filter((c) => c.department === dept.id).length;
          const activeDeptReports = complaints.filter(
            (c) => c.department === dept.id && c.status !== 'Resolved'
          ).length;

          return (
            <div
              key={dept.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${dept.bgGradient} text-white shadow-md`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${dept.badgeBg}`}
                  >
                    {activeDeptReports} Active / {totalDeptReports} Total
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-800">{dept.title}</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{dept.description}</p>

                {/* Common Issue Examples */}
                <div className="mt-4">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Common Issues
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.examples.map((ex, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onReportForDepartment(dept.id)}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Report Problem</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFilterByDepartment(dept.id)}
                  className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  title="View Reports"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span>Reports</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
