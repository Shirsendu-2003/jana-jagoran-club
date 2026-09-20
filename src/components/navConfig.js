import {
  LayoutDashboard, User, Wallet, CalendarDays, Bell, Image, MessageSquare,
  Users, ClipboardList, ShieldCheck, FileBarChart, Settings, ScrollText,
  Award, FileEdit, HelpCircle, Camera
} from 'lucide-react';

export const navConfig = {
  MEMBER: [
    { to: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/member/profile', label: 'My Profile', icon: User },
    { to: '/member/payments', label: 'Payments', icon: Wallet },
    { to: '/member/events', label: 'Events', icon: CalendarDays },
    { to: '/member/notices', label: 'Notices', icon: Bell },
    { to: '/member/gallery', label: 'Gallery', icon: Image },
    { to: '/member/feedback', label: 'Feedback', icon: MessageSquare },
  ],
  SECRETARY: [
    { to: '/secretary/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/secretary/budget', label: 'Budget & Finance', icon: Wallet },
    { to: '/secretary/events', label: 'Events', icon: CalendarDays },
    { to: '/secretary/gallery', label: 'Gallery', icon: Image },
    { to: '/photo-submissions', label: 'Photo Submissions', icon: Camera },
    { to: '/member/profile', label: 'My Profile', icon: User },
  ],
  PRESIDENT: [
    { to: '/president/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/president/approvals', label: 'Approvals', icon: ClipboardList },
    { to: '/president/notices', label: 'Notices', icon: Bell },
    { to: '/photo-submissions', label: 'Photo Submissions', icon: Camera },
    { to: '/member/profile', label: 'My Profile', icon: User },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/members', label: 'Members', icon: ShieldCheck },
    { to: '/admin/designations', label: 'Designations', icon: Award },
    { to: '/admin/notices', label: 'Notices', icon: Bell },
    { to: '/admin/events', label: 'Events', icon: CalendarDays },
    { to: '/admin/gallery', label: 'Gallery Approval', icon: Image },
    { to: '/photo-submissions', label: 'Photo Submissions', icon: Camera },
    { to: '/admin/homepage', label: 'Homepage Editor', icon: FileEdit },
    { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
    { to: '/member/profile', label: 'My Profile', icon: User },
  ],
  SUPER_ADMIN: [
    { to: '/super-admin/dashboard', label: 'System Overview', icon: LayoutDashboard },
    { to: '/super-admin/users', label: 'All Users', icon: Users },
    { to: '/admin/members', label: 'Members', icon: ShieldCheck },
    { to: '/admin/designations', label: 'Designations', icon: Award },
    { to: '/admin/homepage', label: 'Homepage Editor', icon: FileEdit },
    { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    { to: '/photo-submissions', label: 'Photo Submissions', icon: Camera },
    { to: '/super-admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
    { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
    { to: '/member/profile', label: 'My Profile', icon: User },
  ],
};

export const roleLabels = {
  MEMBER: 'Member',
  SECRETARY: 'Secretary',
  PRESIDENT: 'President',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
};
