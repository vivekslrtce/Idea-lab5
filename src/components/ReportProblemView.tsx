import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Department, Priority, Complaint, User } from '../types';
import { suggestDepartment } from '../utils/departmentSuggester';
import { CameraModal } from './CameraModal';

interface ReportProblemViewProps {
  currentUser: User | null;
  preselectedDepartment?: Department | null;
  onSubmitComplaint: (complaint: Complaint) => void;
  onNavigate: (view: string) => void;
}

export const ReportProblemView: React.FC<ReportProblemViewProps> = ({
  currentUser,
  preselectedDepartment,
  onSubmitComplaint,
  onNavigate
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>(
    preselectedDepartment || 'Street Lights'
  );
  const [problemType, setProblemType] = useState('Broken / Non-functional');
  const [priority, setPriority] = useState<Priority>('Medium');

  // Location State
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Metropolis');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Image State
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Description
  const [description, setDescription] = useState('');

  // Feature #5: Smart Suggestion State
  const [suggestedDept, setSuggestedDept] = useState<Department | null>(null);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);

  // Success Modal State
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedDepartment) {
      setDepartment(preselectedDepartment);
    }
  }, [preselectedDepartment]);

  // Real-time Keyword Department Suggestion Trigger
  useEffect(() => {
    const combinedText = `${title} ${description}`;
    const result = suggestDepartment(combinedText);
    if (result.suggestedDepartment && result.suggestedDepartment !== department) {
      setSuggestedDept(result.suggestedDepartment);
      setMatchedKeywords(result.matchedKeywords);
      setSuggestionAccepted(false);
    } else if (result.suggestedDepartment === department) {
      setSuggestedDept(null);
    }
  }, [title, description, department]);

  const handleAcceptSuggestion = () => {
    if (suggestedDept) {
      setDepartment(suggestedDept);
      setSuggestedDept(null);
      setSuggestionAccepted(true);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        if (!address) {
          setAddress(`GPS Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`);
        }
        if (!area) {
          setArea('Sector 12 Public Zone');
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        // Fallback default coordinates
        setLatitude(28.6139);
        setLongitude(77.2090);
        if (!address) setAddress('Civil Center Main Gate Road');
        if (!area) setArea('Central Zone');
      },
      { timeout: 8000 }
    );
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Please provide a Problem Title.');
      return;
    }
    if (!address.trim()) {
      setValidationError('Please enter the Address or use Current Location.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setValidationError('Please enter a detailed problem description (at least 10 characters).');
      return;
    }

    // Generate Complaint ID e.g. UFR-2026-0007
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `UFR-${year}-${randomSeq}`;

    const newComplaint: Complaint = {
      id: complaintId,
      userId: currentUser ? currentUser.id : 'usr-guest',
      userName: currentUser ? currentUser.name : 'Citizen User',
      userMobile: currentUser ? currentUser.mobile : '+91 9876543210',
      title: title.trim(),
      department,
      problemType: problemType.trim(),
      priority,
      address: address.trim(),
      area: area.trim() || 'Central Zone',
      city: city.trim() || 'Metropolis',
      landmark: landmark.trim(),
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      image: image || undefined,
      description: description.trim(),
      status: 'Reported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Reported',
          timestamp: new Date().toISOString(),
          note: 'Complaint registered successfully by citizen.'
        }
      ]
    };

    onSubmitComplaint(newComplaint);
    setSubmittedId(complaintId);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Report a Utility Problem</h1>
        <p className="text-sm text-slate-500">
          Lodge an official public utility complaint with municipal authorities for rapid resolution.
        </p>
      </div>

      {validationError && (
        <div className="flex items-center space-x-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-md font-extrabold text-slate-800">1. Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Problem Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Street light not working near Metro Station"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Problem Type
              </label>
              <input
                type="text"
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}
                placeholder="e.g. Broken Lamp, Pipeline Leak, Pothole"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Low', 'Medium', 'High'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`rounded-xl py-2.5 text-xs font-bold transition border ${
                      priority === p
                        ? p === 'High'
                          ? 'bg-rose-600 text-white border-rose-600 shadow'
                          : p === 'Medium'
                          ? 'bg-amber-500 text-white border-amber-500 shadow'
                          : 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p} Priority
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature #5: Intelligent Department Suggestion Box */}
        {suggestedDept && (
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 shadow-sm animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 shadow">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-900">
                    Smart Department Suggestion
                  </h3>
                  <p className="mt-0.5 text-xs text-indigo-700">
                    Based on your description keywords{' '}
                    <span className="font-semibold text-indigo-900">
                      ({matchedKeywords.join(', ')})
                    </span>
                    , we suggest:
                  </p>
                  <p className="mt-1 text-base font-extrabold text-indigo-900">
                    Suggested Department: <span className="underline decoration-indigo-400">{suggestedDept}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAcceptSuggestion}
                className="inline-flex items-center space-x-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Accept Suggestion</span>
              </button>
            </div>
          </div>
        )}

        {suggestionAccepted && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Department updated to suggested selection! You can still manually change it above.</span>
          </div>
        )}

        {/* Section 2: Location Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-md font-extrabold text-slate-800">2. Location Details</h2>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
            >
              <Compass className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Fetching GPS...' : 'Use Current Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Plot 42, Metro Station Road"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Area / Locality
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Sector 4, Connaught Place"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Metropolis"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Central Park Gate 2"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {(latitude !== null || longitude !== null) && (
              <div className="sm:col-span-2 rounded-xl bg-slate-100 p-3 text-xs font-mono text-slate-700 flex items-center space-x-2 border border-slate-200">
                <Compass className="h-4 w-4 text-blue-600 shrink-0" />
                <span>
                  Captured Coordinates: <strong>Lat {latitude?.toFixed(4)}</strong>,{' '}
                  <strong>Long {longitude?.toFixed(4)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Image Upload / Camera Snapshot */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Camera className="h-5 w-5 text-blue-600" />
            <h2 className="text-md font-extrabold text-slate-800">3. Image Evidence</h2>
          </div>

          {!image ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-6 text-center hover:bg-blue-100/50 transition group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow group-hover:scale-105 transition">
                  <Camera className="h-6 w-6" />
                </div>
                <span className="mt-3 text-sm font-bold text-slate-800">Camera Snapshot</span>
                <span className="mt-0.5 text-xs text-slate-500">Take a photo using device camera</span>
              </button>

              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center cursor-pointer hover:bg-slate-100 transition group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-white shadow group-hover:scale-105 transition">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="mt-3 text-sm font-bold text-slate-800">Upload Photo File</span>
                <span className="mt-0.5 text-xs text-slate-500">JPG, PNG or WEBP from gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative inline-block overflow-hidden rounded-2xl border border-slate-300 shadow-sm">
              <img src={image} alt="Uploaded preview" className="h-48 w-full max-w-md object-cover" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 rounded-full bg-slate-900/80 p-1.5 text-white hover:bg-slate-900"
                title="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Detailed Description */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <ShieldAlert className="h-5 w-5 text-blue-600" />
            <h2 className="text-md font-extrabold text-slate-800">4. Problem Description</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem in detail (e.g. location specifics, duration of problem, hazard level)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition"
          >
            <span>Submit Complaint</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setImage(img)}
      />

      {/* Success Modal */}
      {submittedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-800">Complaint Lodged Successfully!</h3>
            <p className="mt-1 text-xs text-slate-500">
              Your utility report has been registered with the municipal department.
            </p>

            <div className="my-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-blue-600">
                Generated Complaint ID
              </span>
              <span className="block text-2xl font-mono font-extrabold text-blue-900 mt-1">
                {submittedId}
              </span>
              <span className="mt-2 inline-block rounded-md bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-300">
                Status: Reported
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSubmittedId(null);
                  onNavigate('submitted-problems');
                }}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow hover:bg-blue-700"
              >
                Track My Complaints
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedId(null);
                  onNavigate('dashboard');
                }}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
