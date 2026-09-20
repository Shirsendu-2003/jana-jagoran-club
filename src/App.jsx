import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/public/LandingPage';
import FaqPage from './pages/public/FaqPage';
import AboutPage from './pages/public/AboutPage';
import EventsPage from './pages/public/EventsPage';
import GalleryPage from './pages/public/GalleryPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import CodeOfConductPage from './pages/public/CodeOfConductPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ForceChangePassword from './pages/auth/ForceChangePassword';
import Unauthorized from './pages/misc/Unauthorized';
import NotFound from './pages/misc/NotFound';

import Profile from './pages/shared/Profile';
import PhotoModeration from './pages/shared/PhotoModeration';

import MemberDashboard from './pages/member/MemberDashboard';
import MemberPayments from './pages/member/MemberPayments';
import MemberEvents from './pages/member/MemberEvents';
import MemberNotices from './pages/member/MemberNotices';
import MemberGallery from './pages/member/MemberGallery';
import MemberFeedback from './pages/member/MemberFeedback';

import SecretaryDashboard from './pages/secretary/SecretaryDashboard';
import SecretaryBudget from './pages/secretary/SecretaryBudget';
import SecretaryEvents from './pages/secretary/SecretaryEvents';
import SecretaryGallery from './pages/secretary/SecretaryGallery';

import PresidentDashboard from './pages/president/PresidentDashboard';
import PresidentApprovals from './pages/president/PresidentApprovals';
import PresidentNotices from './pages/president/PresidentNotices';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMembers from './pages/admin/AdminMembers';
import AdminNotices from './pages/admin/AdminNotices';
import AdminEvents from './pages/admin/AdminEvents';
import AdminGallery from './pages/admin/AdminGallery';
import AdminReports from './pages/admin/AdminReports';
import AdminDesignations from './pages/admin/AdminDesignations';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminFaqs from './pages/admin/AdminFaqs';

import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import SuperAdminUsers from './pages/superadmin/SuperAdminUsers';
import SuperAdminAuditLogs from './pages/superadmin/SuperAdminAuditLogs';

const ALL_ROLES = ['MEMBER', 'SECRETARY', 'PRESIDENT', 'ADMIN', 'SUPER_ADMIN'];
const STAFF_ROLES = ['SECRETARY', 'PRESIDENT', 'ADMIN', 'SUPER_ADMIN'];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/faqs" element={<FaqPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/code-of-conduct" element={<CodeOfConductPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/force-password-change" element={<ForceChangePassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Shared profile page, available to every role */}
      <Route path="/member/profile" element={
        <ProtectedRoute allowedRoles={ALL_ROLES}><Profile /></ProtectedRoute>
      } />

      {/* Member routes */}
      <Route path="/member/dashboard" element={
        <ProtectedRoute allowedRoles={ALL_ROLES}><MemberDashboard /></ProtectedRoute>
      } />
      <Route path="/member/payments" element={
        <ProtectedRoute allowedRoles={ALL_ROLES}><MemberPayments /></ProtectedRoute>
      } />
      <Route path="/member/events" element={
        <ProtectedRoute allowedRoles={ALL_ROLES}><MemberEvents /></ProtectedRoute>
      } />
      <Route path="/member/notices" element={
        <ProtectedRoute allowedRoles={ALL_ROLES}><MemberNotices /></ProtectedRoute>
      } />
      <Route path="/member/gallery" element={
        <ProtectedRoute allowedRoles={ALL_ROLES}><MemberGallery /></ProtectedRoute>
      } />
      <Route path="/member/feedback" element={
        <ProtectedRoute allowedRoles={ALL_ROLES}><MemberFeedback /></ProtectedRoute>
      } />

      {/* Secretary routes */}
      <Route path="/secretary/dashboard" element={
        <ProtectedRoute allowedRoles={['SECRETARY', 'ADMIN', 'SUPER_ADMIN']}><SecretaryDashboard /></ProtectedRoute>
      } />
      <Route path="/secretary/budget" element={
        <ProtectedRoute allowedRoles={['SECRETARY', 'ADMIN', 'SUPER_ADMIN']}><SecretaryBudget /></ProtectedRoute>
      } />
      <Route path="/secretary/events" element={
        <ProtectedRoute allowedRoles={['SECRETARY', 'ADMIN', 'SUPER_ADMIN']}><SecretaryEvents /></ProtectedRoute>
      } />
      <Route path="/secretary/gallery" element={
        <ProtectedRoute allowedRoles={['SECRETARY', 'ADMIN', 'SUPER_ADMIN']}><SecretaryGallery /></ProtectedRoute>
      } />

      {/* President routes */}
      <Route path="/president/dashboard" element={
        <ProtectedRoute allowedRoles={['PRESIDENT', 'ADMIN', 'SUPER_ADMIN']}><PresidentDashboard /></ProtectedRoute>
      } />
      <Route path="/president/approvals" element={
        <ProtectedRoute allowedRoles={['PRESIDENT', 'ADMIN', 'SUPER_ADMIN']}><PresidentApprovals /></ProtectedRoute>
      } />
      <Route path="/president/notices" element={
        <ProtectedRoute allowedRoles={['PRESIDENT', 'ADMIN', 'SUPER_ADMIN']}><PresidentNotices /></ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminUsers /></ProtectedRoute>
      } />
      <Route path="/admin/members" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminMembers /></ProtectedRoute>
      } />
      <Route path="/admin/notices" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminNotices /></ProtectedRoute>
      } />
      <Route path="/admin/events" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminEvents /></ProtectedRoute>
      } />
      <Route path="/admin/gallery" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminGallery /></ProtectedRoute>
      } />
      <Route path="/photo-submissions" element={
        <ProtectedRoute allowedRoles={STAFF_ROLES}><PhotoModeration /></ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={STAFF_ROLES}><AdminReports /></ProtectedRoute>
      } />
      <Route path="/admin/designations" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminDesignations /></ProtectedRoute>
      } />
      <Route path="/admin/homepage" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminHomepage /></ProtectedRoute>
      } />
      <Route path="/admin/faqs" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminFaqs /></ProtectedRoute>
      } />

      {/* Super Admin routes */}
      <Route path="/super-admin/dashboard" element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>
      } />
      <Route path="/super-admin/users" element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminUsers /></ProtectedRoute>
      } />
      <Route path="/super-admin/audit-logs" element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminAuditLogs /></ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
