import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { presidentApi } from '../../api/endpoints';
import { Users, Wallet, CalendarDays, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PresidentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    presidentApi.dashboard().then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">President's Overview</h1>
      <p className="text-gray-500 mb-6">A bird's-eye view of the club's finances and activities.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} />
        <StatCard icon={Wallet} label="Net Balance" value={`₹${stats.netBalance}`} />
        <StatCard icon={CalendarDays} label="Total Events" value={stats.totalEvents} />
        <StatCard icon={ClipboardList} label="Pending Payments" value={stats.pendingPayments} />
      </div>

      <div className="card flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Budgets awaiting your decision</h3>
          <p className="text-sm text-gray-500">Review and approve pending budgets submitted by the Secretary.</p>
        </div>
        <Link to="/president/approvals" className="btn-primary">Review Now</Link>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-maroon-800">{value}</p>
      </div>
      <Icon className="text-brand-500" size={26} />
    </div>
  );
}
