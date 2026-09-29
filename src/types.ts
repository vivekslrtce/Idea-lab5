export type Department =
  | 'Electricity'
  | 'Water Supply'
  | 'Street Lights'
  | 'Roads'
  | 'Drainage'
  | 'Waste Management'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High';

export type ComplaintStatus = 'Reported' | 'Under Review' | 'In Progress' | 'Resolved';

export type UserRole = 'citizen' | 'admin';

export type ActivityActionType =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_REGISTER'
  | 'COMPLAINT_CREATED'
  | 'COMPLAINT_STATUS_UPDATED'
  | 'COMPLAINT_UPDATED'
  | 'PROFILE_UPDATED';

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  action: ActivityActionType;
  title: string;
  description: string;
  targetId?: string;
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
}

export interface StatusHistoryItem {
  status: ComplaintStatus;
  timestamp: string;
  note?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  title: string;
  department: Department;
  problemType: string;
  priority: Priority;
  address: string;
  area: string;
  city: string;
  landmark: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  statusHistory: StatusHistoryItem[];
  adminRemark?: string;
}
