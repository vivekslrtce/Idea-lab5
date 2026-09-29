import React, { useState, useEffect } from 'react';
import { Complaint, Department, User } from './types';
import {
  initializeStorage,
  DEMO_CITIZEN,
  DEMO_ADMIN
} from './utils/initialData';
import { HeaderNavbar } from './components/HeaderNavbar';
import { SidebarNav } from './components/SidebarNav';
import { LoginModal } from './components/LoginModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { DashboardView } from './components/DashboardView';
import { DepartmentsView } from './components/DepartmentsView';
import { ReportProblemView } from './components/ReportProblemView';
import { SubmittedProblemsView } from './components/SubmittedProblemsView';
import { LiveIssuesView } from './components/LiveIssuesView';
import { SolvedIssuesView } from './components/SolvedIssuesView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ProfileView } from './components/ProfileView';
import { ComplaintDetailsModal } from './components/ComplaintDetailsModal';
import { ActivityLogsView } from './components/ActivityLogsView';
import { logActivity } from './utils/activityLogger';

export default function App() {
  // Always start unauthenticated on fresh session / refresh so login page is presented
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [preselectedDept, setPreselectedDept] = useState<Department | null>(null);
  const [deptFilter, setDeptFilter] = useState<string | null>(null);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true); // Open login on refresh
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    initializeStorage();

    const storedRegUsers = localStorage.getItem('ufr_registered_users');
    if (storedRegUsers) {
      try {
        setRegisteredUsers(JSON.parse(storedRegUsers));
      } catch (e) {
        setRegisteredUsers([DEMO_CITIZEN, DEMO_ADMIN]);
      }
    } else {
      setRegisteredUsers([DEMO_CITIZEN, DEMO_ADMIN]);
    }

    const storedComplaints = localStorage.getItem('ufr_complaints');
    if (storedComplaints) {
      try {
        setComplaints(JSON.parse(storedComplaints));
      } catch (e) {
        console.error('Failed to parse complaints', e);
      }
    }
  }, []);

  // Save complaints to localStorage whenever updated
  const saveComplaints = (updatedComplaints: Complaint[]) => {
    setComplaints(updatedComplaints);
    localStorage.setItem('ufr_complaints', JSON.stringify(updatedComplaints));
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);

    logActivity({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'USER_LOGIN',
      title: `${user.role === 'admin' ? 'Admin Authority' : 'Citizen'} Signed In`,
      description: `${user.name} (${user.email}) logged into the civic portal.`
    });

    if (user.role === 'admin') {
      setActiveView('admin-dashboard');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      logActivity({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userRole: currentUser.role,
        action: 'USER_LOGOUT',
        title: 'User Signed Out',
        description: `${currentUser.name} signed out of the session.`
      });
    }

    setCurrentUser(null);
    setActiveView('dashboard');
    setIsAuthModalOpen(true);
  };

  const handleRegisterUser = (newUser: User) => {
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem('ufr_registered_users', JSON.stringify(updated));

    logActivity({
      userId: newUser.id,
      userName: newUser.name,
      userEmail: newUser.email,
      userRole: 'citizen',
      action: 'USER_REGISTER',
      title: 'New Citizen Registered',
      description: `New citizen registration for ${newUser.name} (${newUser.email}, ${newUser.mobile}).`
    });
  };

  const handleAdminAuthSuccess = (adminUser: User) => {
    setCurrentUser(adminUser);
    setIsAdminAuthOpen(false);

    logActivity({
      userId: adminUser.id,
      userName: adminUser.name,
      userEmail: adminUser.email,
      userRole: 'admin',
      action: 'USER_LOGIN',
      title: 'Admin Verification Passed',
      description: 'Admin credentials successfully verified for municipal authority portal access.'
    });

    setActiveView('admin-dashboard');
  };

  const handleSwitchRole = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (currentUser.role === 'citizen') {
      // Require Admin credentials to become Admin
      setIsAdminAuthOpen(true);
    } else {
      // Admin switching back to Citizen
      setCurrentUser(DEMO_CITIZEN);
      setActiveView('dashboard');
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);

    logActivity({
      userId: updatedUser.id,
      userName: updatedUser.name,
      userEmail: updatedUser.email,
      userRole: updatedUser.role,
      action: 'PROFILE_UPDATED',
      title: 'Profile Details Updated',
      description: `${updatedUser.name} updated their personal profile and contact information.`
    });
  };

  const handleSubmitComplaint = (newComplaint: Complaint) => {
    const updated = [newComplaint, ...complaints];
    saveComplaints(updated);

    logActivity({
      userId: newComplaint.userId,
      userName: newComplaint.userName,
      userEmail: currentUser?.email || 'citizen@example.com',
      userRole: 'citizen',
      action: 'COMPLAINT_CREATED',
      title: `Complaint Lodged: ${newComplaint.id}`,
      description: `Citizen ${newComplaint.userName} lodged complaint for ${newComplaint.department}: "${newComplaint.title}" at ${newComplaint.area}, ${newComplaint.city}.`,
      targetId: newComplaint.id,
      metadata: {
        complaintId: newComplaint.id,
        department: newComplaint.department,
        priority: newComplaint.priority,
        area: newComplaint.area,
        city: newComplaint.city
      }
    });
  };

  const handleUpdateComplaint = (updated: Complaint) => {
    const previous = complaints.find((c) => c.id === updated.id);
    const updatedList = complaints.map((c) => (c.id === updated.id ? updated : c));
    saveComplaints(updatedList);
    if (selectedComplaint && selectedComplaint.id === updated.id) {
      setSelectedComplaint(updated);
    }

    const actorId = currentUser?.id || 'usr-admin-01';
    const actorName = currentUser?.name || 'Municipal Admin';
    const actorEmail = currentUser?.email || 'admin@gov.in';
    const actorRole = currentUser?.role || 'admin';

    if (previous && previous.status !== updated.status) {
      logActivity({
        userId: actorId,
        userName: actorName,
        userEmail: actorEmail,
        userRole: actorRole,
        action: 'COMPLAINT_STATUS_UPDATED',
        title: `Status Changed: ${updated.id} ➔ ${updated.status}`,
        description: `${actorName} updated status of ${updated.id} from "${previous.status}" to "${updated.status}". ${
          updated.adminRemark ? `Remark: "${updated.adminRemark}"` : ''
        }`,
        targetId: updated.id,
        metadata: {
          complaintId: updated.id,
          previousStatus: previous.status,
          newStatus: updated.status,
          department: updated.department
        }
      });
    } else {
      logActivity({
        userId: actorId,
        userName: actorName,
        userEmail: actorEmail,
        userRole: actorRole,
        action: 'COMPLAINT_UPDATED',
        title: `Complaint Modified: ${updated.id}`,
        description: `${actorName} updated complaint ${updated.id} details (Department: ${updated.department}, Priority: ${updated.priority}).`,
        targetId: updated.id,
        metadata: {
          complaintId: updated.id,
          department: updated.department,
          priority: updated.priority
        }
      });
    }
  };

  const handleNavigate = (view: string, departmentParam?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    // Intercept Admin views access if not currently Admin
    if ((view === 'admin-dashboard' || view === 'activity-logs') && currentUser.role !== 'admin') {
      setIsAdminAuthOpen(true);
      return;
    }

    setActiveView(view);
    if (departmentParam) {
      setDeptFilter(departmentParam);
    }
  };

  const handleReportForDepartment = (dept: Department) => {
    setPreselectedDept(dept);
    setActiveView('report-problem');
  };

  const handleFilterByDepartment = (dept: Department) => {
    setDeptFilter(dept);
    setActiveView('submitted-problems');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* Header */}
      <HeaderNavbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1 mx-auto w-full max-w-7xl">
        {/* Sidebar */}
        <SidebarNav
          activeView={activeView}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Dynamic View Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeView === 'dashboard' && (
            <DashboardView
              complaints={complaints}
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onSelectComplaint={(c) => setSelectedComplaint(c)}
            />
          )}

          {activeView === 'departments' && (
            <DepartmentsView
              complaints={complaints}
              onReportForDepartment={handleReportForDepartment}
              onFilterByDepartment={handleFilterByDepartment}
            />
          )}

          {activeView === 'report-problem' && (
            <ReportProblemView
              currentUser={currentUser}
              preselectedDepartment={preselectedDept}
              onSubmitComplaint={handleSubmitComplaint}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'submitted-problems' && (
            <SubmittedProblemsView
              complaints={complaints}
              onSelectComplaint={(c) => setSelectedComplaint(c)}
              onNavigate={handleNavigate}
              initialDeptFilter={deptFilter}
            />
          )}

          {activeView === 'live-issues' && (
            <LiveIssuesView
              complaints={complaints}
              onSelectComplaint={(c) => setSelectedComplaint(c)}
            />
          )}

          {activeView === 'solved-issues' && (
            <SolvedIssuesView
              complaints={complaints}
              onSelectComplaint={(c) => setSelectedComplaint(c)}
            />
          )}

          {activeView === 'admin-dashboard' && (
            <AdminDashboardView
              complaints={complaints}
              onSelectComplaint={(c) => setSelectedComplaint(c)}
              onUpdateComplaint={handleUpdateComplaint}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'activity-logs' && (
            <ActivityLogsView
              currentUser={currentUser}
              complaints={complaints}
              onSelectComplaint={(c) => setSelectedComplaint(c)}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              complaints={complaints}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              onSwitchRole={handleSwitchRole}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4">
          Urban Utility Problem Reporting Platform • Municipal Civic Portal
        </div>
      </footer>

      {/* Mandatory Login / Register Gate Modal */}
      <LoginModal
        isOpen={isAuthModalOpen || currentUser === null}
        onClose={() => {
          if (currentUser !== null) {
            setIsAuthModalOpen(false);
          }
        }}
        onLoginSuccess={handleLoginSuccess}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
        canClose={currentUser !== null}
      />

      {/* Admin Credentials Verification Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAdminSuccess={handleAdminAuthSuccess}
      />

      {/* Complaint Details Modal */}
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        currentUser={currentUser}
        onClose={() => setSelectedComplaint(null)}
        onUpdateComplaint={handleUpdateComplaint}
      />
    </div>
  );
}
