import api from './axios';

// ---------------- Public (landing page, unauthenticated) ----------------
export const publicApi = {
  upcomingEvents: () => api.get('/public/events/upcoming'),
  pastEvents: () => api.get('/public/events/past'),
  latestNotices: () => api.get('/public/notices/latest'),
  galleryShowcase: () => api.get('/public/gallery/showcase'),
  stats: () => api.get('/public/stats'),
  homepage: () => api.get('/public/homepage'),
  faqs: () => api.get('/public/faqs'),
  approvedPhotos: (limit = 12) => api.get(`/public/photos?limit=${limit}`),
  submitPhoto: (formData) => api.post('/public/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ---------------- Photo Submission Moderation (Secretary/President/Admin/Super Admin) ----------------
export const photoSubmissionApi = {
  pending: () => api.get('/photo-submissions/pending'),
  approved: () => api.get('/photo-submissions/approved'),
  review: (id, approve, rejectionReason) =>
    api.patch(`/photo-submissions/${id}/review?approve=${approve}${rejectionReason ? `&rejectionReason=${encodeURIComponent(rejectionReason)}` : ''}`),
  setFeatured: (id, featured) => api.patch(`/photo-submissions/${id}/featured?featured=${featured}`),
  remove: (id) => api.delete(`/photo-submissions/${id}`),
};

// ---------------- Auth ----------------
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  firstLoginPassword: (data) => api.post('/auth/first-login-password', data),
  requestPasswordOtp: () => api.post('/auth/password-otp/request'),
  confirmPasswordOtp: (data) => api.post('/auth/password-otp/confirm', data),
};

// ---------------- Profile (shared) ----------------
export const profileApi = {
  getMe: () => api.get('/profile/me'),
  updateMe: (data) => api.put('/profile/me', data),
  uploadPicture: (formData) => api.post('/profile/me/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ---------------- Member ----------------
export const memberApi = {
  dashboard: () => api.get('/member/dashboard'),
  paymentHistory: () => api.get('/member/payments/history'),
  paymentSummary: () => api.get('/member/payments/summary'),
  events: () => api.get('/member/events'),
  registerForEvent: (eventId) => api.post(`/member/events/${eventId}/register`),
  notices: () => api.get('/member/notices'),
  albums: () => api.get('/member/gallery/albums'),
  albumImages: (albumId) => api.get(`/member/gallery/albums/${albumId}/images`),
  uploadPhoto: (albumId, formData) => api.post(`/member/gallery/albums/${albumId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePhoto: (imageId) => api.delete(`/member/gallery/images/${imageId}`),
  submitFeedback: (data) => api.post('/member/feedback', data),
  myFeedback: () => api.get('/member/feedback/mine'),
  notifications: () => api.get('/member/notifications'),
  markNotificationRead: (id) => api.patch(`/member/notifications/${id}/read`),
};

// ---------------- Secretary ----------------
export const secretaryApi = {
  dashboard: () => api.get('/secretary/dashboard'),
  createBudget: (data) => api.post('/secretary/budgets', data),
  updateBudget: (id, data) => api.put(`/secretary/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/secretary/budgets/${id}`),
  budgets: () => api.get('/secretary/budgets'),
  addIncome: (data) => api.post('/secretary/income', data),
  income: () => api.get('/secretary/income'),
  addExpense: (data) => api.post('/secretary/expenses', data),
  approveExpense: (id, approve) => api.patch(`/secretary/expenses/${id}/approve?approve=${approve}`),
  expenses: () => api.get('/secretary/expenses'),
  createEvent: (data) => api.post('/secretary/events', data),
  updateEvent: (id, data) => api.put(`/secretary/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/secretary/events/${id}`),
  eventRegistrations: (id) => api.get(`/secretary/events/${id}/registrations`),
  createAlbum: (title, eventId) => api.post(`/secretary/gallery/albums?title=${encodeURIComponent(title)}${eventId ? `&eventId=${eventId}` : ''}`),
  pendingPaymentSummary: () => api.get('/secretary/payments/pending-summary'),
};

// ---------------- President ----------------
export const presidentApi = {
  dashboard: () => api.get('/president/dashboard'),
  budgets: () => api.get('/president/budgets'),
  approveBudget: (id, approve) => api.patch(`/president/budgets/${id}/approve?approve=${approve}`),
  notices: () => api.get('/president/notices'),
  albums: () => api.get('/president/gallery/albums'),
};

// ---------------- Admin ----------------
export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  createUser: (data) => api.post('/admin/users', data),
  allUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role?role=${role}`),
  setUserStatus: (id, active) => api.patch(`/admin/users/${id}/status?active=${active}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  resetUserPassword: (id) => api.post(`/admin/users/${id}/reset-password`),
  searchMembers: (keyword) => api.get(`/admin/members/search${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`),
  setMemberStatus: (id, status) => api.patch(`/admin/members/${id}/status?status=${status}`),
  toggleMemberStatus: (id, active, reason) => api.patch(`/admin/members/${id}/toggle-status`, { active, reason }),
  pendingMembers: () => api.get('/admin/members/pending'),
  approveMember: (id) => api.post(`/admin/members/${id}/approve`),
  rejectMember: (id) => api.post(`/admin/members/${id}/reject`),
  createNotice: (data) => api.post('/admin/notices', data),
  updateNotice: (id, data) => api.put(`/admin/notices/${id}`, data),
  deleteNotice: (id) => api.delete(`/admin/notices/${id}`),
  createEvent: (data) => api.post('/admin/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  pendingImages: () => api.get('/admin/gallery/pending'),
  approvedImages: () => api.get('/admin/gallery/approved'),
  approveImage: (id, approve) => api.patch(`/admin/gallery/${id}/approve?approve=${approve}`),
  setFeatured: (id, featured) => api.patch(`/admin/gallery/${id}/featured?featured=${featured}`),
  deleteImage: (id) => api.delete(`/admin/gallery/${id}`),
  allFeedback: () => api.get('/admin/feedback'),
  updateFeedbackStatus: (id, status) => api.patch(`/admin/feedback/${id}/status?status=${status}`),
};

// ---------------- Super Admin ----------------
export const superAdminApi = {
  dashboard: () => api.get('/super-admin/dashboard'),
  allUsers: () => api.get('/super-admin/users'),
  assignRole: (id, role) => api.patch(`/super-admin/users/${id}/role?role=${role}`),
  setUserStatus: (id, active) => api.patch(`/super-admin/users/${id}/status?active=${active}`),
  deleteUser: (id) => api.delete(`/super-admin/users/${id}`),
  auditLogs: (page = 0, size = 50) => api.get(`/super-admin/audit-logs?page=${page}&size=${size}`),
};

// ---------------- Reports ----------------
export const reportsApi = {
  memberReportPdf: () => api.get('/reports/members/pdf', { responseType: 'blob' }),
  memberReportExcel: () => api.get('/reports/members/excel', { responseType: 'blob' }),
  paymentReportExcel: (month, year) => api.get(`/reports/payments/excel${month && year ? `?month=${month}&year=${year}` : ''}`, { responseType: 'blob' }),
};

// Payment recording -- Secretary (and Admin/Super Admin, who share the /secretary/** role rule) can record manual payments.
export const paymentRecordApi = {
  record: (data) => api.post('/secretary/payments/record', data),
};

// ---------------- Designation Management ----------------
export const designationApi = {
  all: () => api.get('/designations'),
  postDetail: (id) => api.get(`/designations/${id}/post-detail`),
  propose: (data) => api.post('/designations', data),
  decide: (id, approve) => api.patch(`/designations/${id}/decide?approve=${approve}`),
  retire: (id) => api.patch(`/designations/${id}/retire`),
  getMenuPermissions: (id) => api.get(`/designations/${id}/menu-permissions`),
  setMenuPermissions: (id, menuKeys) => api.put(`/designations/${id}/menu-permissions`, { menuKeys }),
  requestAssignment: (memberId, designationId) => api.post('/designations/assign', { memberId, designationId }),
  decideAssignment: (id, approve) => api.patch(`/designations/assignments/${id}/decide?approve=${approve}`),
  requestRelease: (id, reason) => api.post(`/designations/assignments/${id}/request-release`, { reason }),
  decideRelease: (id, approve, reason) => api.patch(`/designations/assignments/${id}/decide-release?approve=${approve}${reason ? `&reason=${encodeURIComponent(reason)}` : ''}`),
  pendingAssignments: () => api.get('/designations/assignments/pending'),
  activeAssignments: () => api.get('/designations/assignments/active'),
  memberDesignations: (memberId) => api.get(`/designations/members/${memberId}`),
  memberHistory: (memberId) => api.get(`/designations/members/${memberId}/history`),
};

// ---------------- Homepage CMS ----------------
export const homepageApi = {
  allSections: () => api.get('/admin/homepage'),
  upsertSection: (data) => api.put('/admin/homepage', data),
};

// ---------------- FAQ Management ----------------
export const faqApi = {
  allFaqs: () => api.get('/admin/faqs'),
  createFaq: (data) => api.post('/admin/faqs', data),
  updateFaq: (id, data) => api.put(`/admin/faqs/${id}`, data),
  toggleActive: (id, active) => api.patch(`/admin/faqs/${id}/active?active=${active}`),
  deleteFaq: (id) => api.delete(`/admin/faqs/${id}`),
};
