import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Complaint, Department, ComplaintStatus } from '../types';
import { MapPin, Eye, Filter, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface MapVisualizerProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

// Fallback base coordinates for Metropolis city center
const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.2090;

export const MapVisualizer: React.FC<MapVisualizerProps> = ({
  complaints,
  onSelectComplaint
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [statusFilter, setStatusFilter] = useState<'Active' | 'All' | 'Resolved'>('Active');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [selectedPinCount, setSelectedPinCount] = useState<number>(0);

  // Filter complaints for map view
  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter === 'Active' && c.status === 'Resolved') return false;
    if (statusFilter === 'Resolved' && c.status !== 'Resolved') return false;
    if (departmentFilter !== 'All' && c.department !== departmentFilter) return false;
    return true;
  });

  // Helper to compute pin color
  const getMarkerColor = (complaint: Complaint) => {
    if (complaint.status === 'Resolved') return '#10b981'; // Green
    if (complaint.status === 'In Progress') return '#a855f7'; // Purple
    if (complaint.priority === 'High') return '#ef4444'; // Red
    return '#f59e0b'; // Amber
  };

  // Helper to generate coordinates with slight deterministic offset if missing
  const getCoordinates = (complaint: Complaint, index: number): [number, number] => {
    if (complaint.latitude && complaint.longitude) {
      return [complaint.latitude, complaint.longitude];
    }
    // Slight spread based on index
    const angle = (index * 2 * Math.PI) / 8;
    const radius = 0.015 + (index % 3) * 0.008;
    return [DEFAULT_LAT + Math.sin(angle) * radius, DEFAULT_LNG + Math.cos(angle) * radius];
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [DEFAULT_LAT, DEFAULT_LNG],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      markersGroupRef.current = markersGroup;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
      }
    };
  }, []);

  // Update Markers whenever complaints or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    setSelectedPinCount(filteredComplaints.length);

    if (filteredComplaints.length === 0) return;

    const bounds = L.latLngBounds([]);

    filteredComplaints.forEach((complaint, idx) => {
      const [lat, lng] = getCoordinates(complaint, idx);
      const color = getMarkerColor(complaint);

      bounds.extend([lat, lng]);

      // Create SVG pin icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup Content
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-1 text-slate-800 font-sans max-w-xs';
      popupDiv.innerHTML = `
        <div style="font-size: 11px; font-weight: 800; color: #2563eb; margin-bottom: 2px;">${complaint.id} • ${complaint.department}</div>
        <div style="font-size: 13px; font-weight: 700; line-height: 1.3; margin-bottom: 6px; color: #0f172a;">${complaint.title}</div>
        <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 6px;">
          <span style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: 800;">
            ${complaint.status}
          </span>
          <span style="background-color: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
            ${complaint.priority} Priority
          </span>
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">📍 ${complaint.address || complaint.area}</div>
        <button id="map-btn-${complaint.id}" style="
          width: 100%;
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        ">
          View Complaint Details →
        </button>
      `;

      marker.bindPopup(popupDiv);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-btn-${complaint.id}`);
        if (btn) {
          btn.onclick = () => onSelectComplaint(complaint);
        }
      });

      markersGroup.addLayer(marker);
    });

    if (filteredComplaints.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [filteredComplaints, onSelectComplaint]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([DEFAULT_LAT, DEFAULT_LNG], 13);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <MapPin className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-800">Live Active Reports Map Visualizer</h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
              {selectedPinCount} Pins
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial visualization of reported utility breakdowns and municipal repair orders.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('Active')}
              className={`rounded-lg px-2.5 py-1 transition ${
                statusFilter === 'Active'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('All')}
              className={`rounded-lg px-2.5 py-1 transition ${
                statusFilter === 'All'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setStatusFilter('Resolved')}
              className={`rounded-lg px-2.5 py-1 transition ${
                statusFilter === 'Resolved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Department Select */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Departments</option>
            <option value="Electricity">⚡ Electricity</option>
            <option value="Water Supply">💧 Water Supply</option>
            <option value="Street Lights">💡 Street Lights</option>
            <option value="Roads">🛣️ Roads</option>
            <option value="Drainage">🌊 Drainage</option>
            <option value="Waste Management">🗑️ Waste Management</option>
            <option value="Other">Other</option>
          </select>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className="inline-flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            title="Recenter Map"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Map Element */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} className="h-80 w-full z-0 bg-slate-100" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 right-3 z-10 rounded-xl bg-white/95 p-2.5 shadow-lg backdrop-blur-xs border border-slate-200 text-[11px] font-bold space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 mb-1">Map Key</div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-slate-700">High Priority / Urgent</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700">Reported / Under Review</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-700">In Progress</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
