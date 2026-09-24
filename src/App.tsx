import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store';
import { ToastContainer } from '@/components/ui/Toast';
import { LoginPage } from '@/pages/auth/LoginPage';
import { CreateAccountPage } from '@/pages/auth/CreateAccountPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { LandingPage } from '@/pages/LandingPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminApprovals } from '@/pages/admin/AdminApprovals';
import { AdminPurchaseOrders } from '@/pages/admin/AdminPurchaseOrders';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminTasks } from '@/pages/admin/AdminTasks';
import { AdminReports } from '@/pages/admin/AdminReports';
import { AdminAudit } from '@/pages/admin/AdminAudit';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { ReqDashboard } from '@/pages/requisitioner/ReqDashboard';
import { ReqRequests } from '@/pages/requisitioner/ReqRequests';
import { ReqNewRequest } from '@/pages/requisitioner/ReqNewRequest';
import { ReqTasks } from '@/pages/requisitioner/ReqTasks';
import { ReqNotifications } from '@/pages/requisitioner/ReqNotifications';
import { OfficerDashboard } from '@/pages/officer/OfficerDashboard';
import { OfficerApproved } from '@/pages/officer/OfficerApproved';
import { OfficerInventory } from '@/pages/officer/OfficerInventory';
import { OfficerPurchaseRequests } from '@/pages/officer/OfficerPurchaseRequests';
import { OfficerPurchaseOrders } from '@/pages/officer/OfficerPurchaseOrders';
import { OfficerSuppliers } from '@/pages/officer/OfficerSuppliers';
import { OfficerDispatch } from '@/pages/officer/OfficerDispatch';
import type { BackendRole } from '@/types';
import type { JSX } from 'react';

function homeForRole(role: BackendRole): string {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'RECEIVER') return '/req/dashboard';
  return '/officer/dashboard';
}

function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles: BackendRole[] }) {
  const currentUser = useStore(s => s.currentUser);
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to={homeForRole(currentUser.role)} replace />;
  return children;
}

export default function App() {
  const currentUser = useStore(s => s.currentUser);

  useEffect(() => {
    void useStore.getState().initAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      void useStore.getState().fetchAllRequests();
      void useStore.getState().fetchPurchaseOrders();
      void useStore.getState().fetchInventory();
      void useStore.getState().fetchVendors();
      void useStore.getState().fetchNotifications();
      if (currentUser.role === 'ADMIN') {
        void useStore.getState().fetchUsers();
        void useStore.getState().fetchAuditLogs();
      }
    }
  }, [currentUser]);

  const adminRoutes = (
    <Route path="/admin">
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="approvals" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminApprovals /></ProtectedRoute>} />
      <Route path="purchase-orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPurchaseOrders /></ProtectedRoute>} />
      <Route path="users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
      <Route path="tasks" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTasks /></ProtectedRoute>} />
      <Route path="reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReports /></ProtectedRoute>} />
      <Route path="audit" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAudit /></ProtectedRoute>} />
      <Route path="settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSettings /></ProtectedRoute>} />
    </Route>
  );

  const reqRoutes = (
    <Route path="/req">
      <Route index element={<Navigate to="/req/dashboard" replace />} />
      <Route path="dashboard" element={<ProtectedRoute allowedRoles={['RECEIVER']}><ReqDashboard /></ProtectedRoute>} />
      <Route path="requests" element={<ProtectedRoute allowedRoles={['RECEIVER']}><ReqRequests /></ProtectedRoute>} />
      <Route path="new-request" element={<ProtectedRoute allowedRoles={['RECEIVER']}><ReqNewRequest /></ProtectedRoute>} />
      <Route path="tasks" element={<ProtectedRoute allowedRoles={['RECEIVER']}><ReqTasks /></ProtectedRoute>} />
      <Route path="notifications" element={<ProtectedRoute allowedRoles={['RECEIVER']}><ReqNotifications /></ProtectedRoute>} />
    </Route>
  );

  const officerRoutes = (
    <Route path="/officer">
      <Route index element={<Navigate to="/officer/dashboard" replace />} />
      <Route path="dashboard" element={<ProtectedRoute allowedRoles={['PROCUREMENT']}><OfficerDashboard /></ProtectedRoute>} />
      <Route path="approved" element={<ProtectedRoute allowedRoles={['PROCUREMENT']}><OfficerApproved /></ProtectedRoute>} />
      <Route path="inventory" element={<ProtectedRoute allowedRoles={['PROCUREMENT']}><OfficerInventory /></ProtectedRoute>} />
      <Route path="purchase-requests" element={<ProtectedRoute allowedRoles={['PROCUREMENT']}><OfficerPurchaseRequests /></ProtectedRoute>} />
      <Route path="purchase-orders" element={<ProtectedRoute allowedRoles={['PROCUREMENT']}><OfficerPurchaseOrders /></ProtectedRoute>} />
      <Route path="suppliers" element={<ProtectedRoute allowedRoles={['PROCUREMENT']}><OfficerSuppliers /></ProtectedRoute>} />
      <Route path="dispatch" element={<ProtectedRoute allowedRoles={['PROCUREMENT']}><OfficerDispatch /></ProtectedRoute>} />
    </Route>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to={homeForRole(currentUser.role)} replace /> : <LandingPage />} />
        <Route path="/login" element={currentUser ? <Navigate to={homeForRole(currentUser.role)} replace /> : <LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {adminRoutes}
        {reqRoutes}
        {officerRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
