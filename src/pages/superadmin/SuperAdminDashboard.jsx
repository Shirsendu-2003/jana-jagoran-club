import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { superAdminApi } from '../../api/endpoints';
import { Users, UserCheck, Wallet, CalendarDays, TrendingUp, TrendingDown } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    superAdminApi.dashboard().then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">System Overview</h1>
      <p className="text-gray-500 mb-6">Complete visibility into Jana Jagoran Club operations.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} />
        <StatCard icon={UserCheck} label="Active Members" value={stats.activeMembers} />
        <StatCard icon={Wallet} label="Pending Payments" value={stats.pendingPayments} />
        <StatCard icon={CalendarDays} label="Total Events" value={stats.totalEvents} />
        <StatCard icon={TrendingUp} label="Total Income (YTD)" value={`₹${stats.totalIncome}`} />
        <StatCard icon={TrendingDown} label="Total Expense (YTD)" value={`₹${stats.totalExpense}`} />
      </div>

      <div className="card mt-8 bg-maroon-50 border-maroon-100">
        <h3 className="font-semibold text-maroon-800 mb-2">System Administration</h3>
        <p className="text-sm text-maroon-700">
          Database backups: use <code className="bg-white px-1 rounded">mysqldump scms_db &gt; backup.sql</code> on a schedule (cron/Task Scheduler).
          Restore with <code className="bg-white px-1 rounded">mysql scms_db &lt; backup.sql</code>. See the README for a recommended daily backup script.
        </p>
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
