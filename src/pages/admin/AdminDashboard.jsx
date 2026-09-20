import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { adminApi } from '../../api/endpoints';
import { Users, UserCheck, Wallet, CalendarDays, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard().then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">Manage users, members, notices, events, and gallery.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} />
        <StatCard icon={UserCheck} label="Active Members" value={stats.activeMembers} />
        <StatCard icon={UserPlus} label="Pending Registrations" value={stats.pendingRegistrations} highlight={stats.pendingRegistrations > 0} />
        <StatCard icon={Wallet} label="Pending Payments" value={stats.pendingPayments} />
        <StatCard icon={CalendarDays} label="Total Events" value={stats.totalEvents} />
      </div>

      {stats.pendingRegistrations > 0 && (
        <div className="card flex items-center justify-between bg-yellow-50 border-yellow-200">
          <div>
            <h3 className="font-semibold text-yellow-800">
              {stats.pendingRegistrations} new member{stats.pendingRegistrations > 1 ? 's' : ''} waiting for approval
            </h3>
            <p className="text-sm text-yellow-700">Review and approve or reject new registrations.</p>
          </div>
          <Link to="/admin/members" className="btn-primary">Review Now</Link>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`stat-card ${highlight ? 'ring-2 ring-yellow-300' : ''}`}>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-maroon-800">{value}</p>
      </div>
      <Icon className="text-brand-500" size={26} />
    </div>
  );
}
