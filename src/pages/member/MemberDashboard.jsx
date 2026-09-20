import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { memberApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { Wallet, CalendarDays, Bell, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberApi.dashboard().then((res) => setData(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <DashboardLayout><Loader /></DashboardLayout>;

  const summary = data.paymentSummary;

  return (
    <DashboardLayout>
      <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}!</h1>
      <p className="text-gray-500 mb-6">Here's what's happening at Jana Jagoran Club.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div>
            <p className="text-xs text-gray-500">Membership ID</p>
            <p className="text-lg font-semibold text-maroon-800">{data.membershipId}</p>
            <span className={data.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}>{data.status}</span>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="text-xs text-gray-500">Amount Due</p>
            <p className="text-lg font-semibold text-maroon-800">₹{summary.totalDue}</p>
            <p className="text-xs text-gray-400">{summary.pendingMonthsCount} month(s) pending</p>
          </div>
          <Wallet className="text-brand-500" size={28} />
        </div>

        <div className="stat-card">
          <div>
            <p className="text-xs text-gray-500">Upcoming Events</p>
            <p className="text-lg font-semibold text-maroon-800">{data.upcomingEvents?.length || 0}</p>
          </div>
          <CalendarDays className="text-brand-500" size={28} />
        </div>
      </div>

      {summary.pendingMonthsCount > 0 && (
        <div className="card mb-8 border-yellow-200 bg-yellow-50 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-yellow-800">You have pending dues</p>
            <p className="text-sm text-yellow-700">
              Pending months: {summary.pendingMonths.join(', ')}. Please contact the Secretary to clear your dues.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><CalendarDays size={18} className="text-maroon-600" /> Upcoming Events</h3>
            <Link to="/member/events" className="text-xs text-maroon-600 hover:underline">View all</Link>
          </div>
          {data.upcomingEvents?.length ? (
            <ul className="space-y-3">
              {data.upcomingEvents.slice(0, 4).map((ev) => (
                <li key={ev.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                  <span className="font-medium text-gray-700">{ev.title}</span>
                  <span className="text-gray-400">{ev.eventDate}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-400">No upcoming events.</p>}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Bell size={18} className="text-maroon-600" /> Recent Notices</h3>
            <Link to="/member/notices" className="text-xs text-maroon-600 hover:underline">View all</Link>
          </div>
          {data.recentNotices?.length ? (
            <ul className="space-y-3">
              {data.recentNotices.map((n) => (
                <li key={n.id} className="text-sm border-b border-gray-100 pb-2 last:border-0">
                  <p className="font-medium text-gray-700">{n.title}</p>
                  <span className="badge-gray">{n.type}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-400">No notices yet.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
