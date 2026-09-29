import { ActivityLog } from '../types';

export const ACTIVITY_LOGS_STORAGE_KEY = 'ufr_activity_logs';

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-seed-001',
    timestamp: '2026-08-08T09:15:00.000Z',
    userId: 'usr-citizen-01',
    userName: 'Rahul Sharma',
    userEmail: 'citizen@example.com',
    userRole: 'citizen',
    action: 'USER_REGISTER',
    title: 'Citizen Registration',
    description: 'Rahul Sharma registered as a citizen on the civic portal.'
  },
  {
    id: 'log-seed-002',
    timestamp: '2026-08-08T10:30:00.000Z',
    userId: 'usr-citizen-01',
    userName: 'Rahul Sharma',
    userEmail: 'citizen@example.com',
    userRole: 'citizen',
    action: 'COMPLAINT_CREATED',
    title: 'Complaint Lodged: UFR-2026-0001',
    description: 'Rahul Sharma reported "Street light not working near Metro Gate 2" in Street Lights department.',
    targetId: 'UFR-2026-0001',
    metadata: {
      complaintId: 'UFR-2026-0001',
      department: 'Street Lights',
      priority: 'High',
      area: 'Connaught Sector 4'
    }
  },
  {
    id: 'log-seed-003',
    timestamp: '2026-08-08T16:00:00.000Z',
    userId: 'usr-admin-01',
    userName: 'Admin Office (Civic Auth)',
    userEmail: 'admin@gov.in',
    userRole: 'admin',
    action: 'COMPLAINT_STATUS_UPDATED',
    title: 'Status Updated: Under Review',
    description: 'Admin updated UFR-2026-0001 status from "Reported" to "Under Review". Note: Assigned to Electrical Maintenance Team B.',
    targetId: 'UFR-2026-0001',
    metadata: {
      complaintId: 'UFR-2026-0001',
      previousStatus: 'Reported',
      newStatus: 'Under Review'
    }
  },
  {
    id: 'log-seed-004',
    timestamp: '2026-08-09T08:00:00.000Z',
    userId: 'usr-citizen-01',
    userName: 'Rahul Sharma',
    userEmail: 'citizen@example.com',
    userRole: 'citizen',
    action: 'COMPLAINT_CREATED',
    title: 'Complaint Lodged: UFR-2026-0002',
    description: 'Rahul Sharma reported "Major water pipeline leak in main market" in Water Supply department.',
    targetId: 'UFR-2026-0002',
    metadata: {
      complaintId: 'UFR-2026-0002',
      department: 'Water Supply',
      priority: 'High',
      area: 'Green Park Phase 1'
    }
  },
  {
    id: 'log-seed-005',
    timestamp: '2026-08-09T14:20:00.000Z',
    userId: 'usr-admin-01',
    userName: 'Admin Office (Civic Auth)',
    userEmail: 'admin@gov.in',
    userRole: 'admin',
    action: 'COMPLAINT_STATUS_UPDATED',
    title: 'Status Updated: In Progress',
    description: 'Admin updated UFR-2026-0001 status to "In Progress". Note: Electrician dispatched with replacement LED fixture.',
    targetId: 'UFR-2026-0001',
    metadata: {
      complaintId: 'UFR-2026-0001',
      previousStatus: 'Under Review',
      newStatus: 'In Progress'
    }
  },
  {
    id: 'log-seed-006',
    timestamp: '2026-08-09T18:45:00.000Z',
    userId: 'usr-admin-01',
    userName: 'Admin Office (Civic Auth)',
    userEmail: 'admin@gov.in',
    userRole: 'admin',
    action: 'COMPLAINT_UPDATED',
    title: 'Complaint Remark Added',
    description: 'Admin added remark to UFR-2026-0002: "Water distribution main line valve closed temporarily for repair."',
    targetId: 'UFR-2026-0002',
    metadata: {
      complaintId: 'UFR-2026-0002'
    }
  }
];

/**
 * Initializes 'ufr_activity_logs' in localStorage if not already present.
 */
export function initializeActivityLogs(): void {
  const existing = localStorage.getItem(ACTIVITY_LOGS_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(ACTIVITY_LOGS_STORAGE_KEY, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
}

/**
 * Retrieves all activity logs from 'ufr_activity_logs' in localStorage.
 * Automatically sorts newest first.
 */
export function getActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_LOGS_STORAGE_KEY);
    if (!raw) {
      initializeActivityLogs();
      return INITIAL_ACTIVITY_LOGS;
    }
    const parsed: ActivityLog[] = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      : [];
  } catch (error) {
    console.error('Failed to parse activity logs from localStorage:', error);
    return [];
  }
}

/**
 * Appends a new activity log entry to the 'ufr_activity_logs' localStorage array.
 */
export function logActivity(
  entry: Omit<ActivityLog, 'id' | 'timestamp'> & { timestamp?: string }
): ActivityLog {
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    userId: entry.userId || 'anonymous',
    userName: entry.userName || 'Unknown User',
    userEmail: entry.userEmail || 'unknown@domain.org',
    userRole: entry.userRole || 'citizen',
    action: entry.action,
    title: entry.title,
    description: entry.description,
    targetId: entry.targetId,
    metadata: entry.metadata
  };

  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(ACTIVITY_LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));

  // Dispatch a browser storage event so any mounted log viewer re-syncs
  window.dispatchEvent(new CustomEvent('ufr_activity_logs_updated', { detail: newLog }));

  return newLog;
}

/**
 * Clears the 'ufr_activity_logs' localStorage array.
 */
export function clearActivityLogs(): void {
  localStorage.setItem(ACTIVITY_LOGS_STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('ufr_activity_logs_updated'));
}

/**
 * Resets the activity logs back to default seed records.
 */
export function resetActivityLogs(): void {
  localStorage.setItem(ACTIVITY_LOGS_STORAGE_KEY, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  window.dispatchEvent(new CustomEvent('ufr_activity_logs_updated'));
}
