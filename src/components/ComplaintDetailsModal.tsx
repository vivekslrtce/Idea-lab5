import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Shield,
  User as UserIcon,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Send,
  Edit3
} from 'lucide-react';
import { Complaint, ComplaintStatus, Department, Priority, User } from '../types';

interface ComplaintDetailsModalProps {
  complaint: Complaint | null;
  currentUser: User | null;
  onClose: () => void;
  onUpdateComplaint: (updated: Complaint) => void;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  complaint,
  currentUser,
  onClose,
  onUpdateComplaint
}) => {
  if (!complaint) return null;

  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint.status);
  const [newDepartment, setNewDepartment] = useState<Department>(complaint.department);
  const [newPriority, setNewPriority] = useState<Priority>(complaint.priority);
  const [adminRemark, setAdminRemark] = useState(complaint.adminRemark || '');
  const [isZoomingImage, setIsZoomingImage] = useState(false);

  const statusesOrder: ComplaintStatus[] = ['Reported', 'Under Review', 'In Progress', 'Resolved'];
  const currentStatusIndex = statusesOrder.indexOf(complaint.status);

  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();

    const isStatusChanged = newStatus !== complaint.status;
    const nowIso = new Date().toISOString();

    let updatedHistory = [...complaint.statusHistory];
    if (isStatusChanged) {
      updatedHistory.push({
        status: newStatus,
        timestamp: nowIso,
        note: adminRemark.trim() || `Status updated to ${newStatus} by admin.`
      });
    }

    const updated: Complaint = {
      ...complaint,
      status: newStatus,
      department: newDepartment,
      priority: newPriority,
      adminRemark: adminRemark.trim() || complaint.adminRemark,
      updatedAt: nowIso,
      resolvedAt: newStatus === 'Resolved' ? nowIso : complaint.resolvedAt,
      statusHistory: updatedHistory
    };

    onUpdateComplaint(updated);
    setIsAdminEditing(false);
  };

  const getStatusColor = (status: ComplaintStatus) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 p-5">
          <div className="flex items-center space-x-3">
            <span className="rounded-xl bg-blue-600 px-3 py-1 font-mono text-xs font-extrabold text-white shadow">
              {complaint.id}
            </span>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold border ${getStatusColor(
                complaint.status
              )}`}
            >
              {complaint.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Title & Department */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>{complaint.department}</span>
              <span>•</span>
              <span className="text-rose-600">{complaint.priority} Priority</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">{complaint.title}</h2>
          </div>

          {/* Interactive Status Timeline Bar */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
              Status Flow Timeline
            </h3>
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {statusesOrder.map((st, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={st} className="flex flex-col items-center text-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span
                      className={`mt-1.5 text-[11px] font-bold ${
                        isCurrent ? 'text-blue-700 font-extrabold' : 'text-slate-600'
                      }`}
                    >
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description & Image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </h4>
                <p className="mt-1 text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {complaint.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Location & Address
                </h4>
                <div className="mt-1 flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{complaint.address}</p>
                    <p className="text-slate-500">
                      {complaint.area}, {complaint.city}
                      {complaint.landmark ? ` (Near ${complaint.landmark})` : ''}
                    </p>
                    {complaint.latitude && (
                      <p className="font-mono text-[10px] text-slate-400 mt-1">
                        GPS: Lat {complaint.latitude.toFixed(4)}, Long {complaint.longitude?.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Image */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Evidence Photo
              </h4>
              {complaint.image ? (
                <div
                  onClick={() => setIsZoomingImage(true)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 group relative"
                >
                  <img
                    src={complaint.image}
                    alt={complaint.title}
                    className="h-36 w-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                    Click to Zoom
                  </div>
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center rounded-xl bg-slate-100 text-slate-400 text-xs italic">
                  No image attached
                </div>
              )}
            </div>
          </div>

          {/* Citizen & Time Details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="font-semibold text-slate-400">Reported By:</span>
              <p className="font-bold text-slate-800">{complaint.userName}</p>
              <p className="text-slate-500">{complaint.userMobile}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-400">Date Logged:</span>
              <p className="font-bold text-slate-800">
                {new Date(complaint.createdAt).toLocaleString()}
              </p>
              {complaint.resolvedAt && (
                <p className="text-emerald-700 font-semibold mt-0.5">
                  Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Admin Remark / Resolution Note */}
          {complaint.adminRemark && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs">
              <span className="block font-bold text-blue-900 uppercase tracking-wider mb-1">
                Authority Resolution Remark
              </span>
              <p className="text-blue-800">{complaint.adminRemark}</p>
            </div>
          )}

          {/* Admin Management Section (If Admin or Testing) */}
          {(currentUser?.role === 'admin' || isAdminEditing) && (
            <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-900">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span>Authority Admin Controls</span>
                </span>
                {!isAdminEditing && (
                  <button
                    type="button"
                    onClick={() => setIsAdminEditing(true)}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-purple-700 hover:underline"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Complaint Status</span>
                  </button>
                )}
              </div>

              {isAdminEditing && (
                <form onSubmit={handleAdminSave} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        <option value="Reported">Reported</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Department
                      </label>
                      <select
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value as Department)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                      >
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
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as Priority)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Admin Remarks / Action Note
                    </label>
                    <textarea
                      rows={2}
                      value={adminRemark}
                      onChange={(e) => setAdminRemark(e.target.value)}
                      placeholder="Add official resolution update or dispatch details..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAdminEditing(false)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1 rounded-xl bg-purple-700 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-purple-800"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Update Complaint</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Urban Utility Reporting Platform • Official Record
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900"
          >
            Close Window
          </button>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomingImage && complaint.image && (
        <div
          onClick={() => setIsZoomingImage(false)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4"
        >
          <img
            src={complaint.image}
            alt={complaint.title}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
