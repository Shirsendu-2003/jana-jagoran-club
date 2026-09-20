import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { secretaryApi } from '../../api/endpoints';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Users } from 'lucide-react';

const COLORS = ['#881337', '#ea580c', '#f97316', '#fdba74', '#9f1239', '#6b0f2b'];

export default function SecretaryDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    secretaryApi.dashboard().then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <DashboardLayout><Loader /></DashboardLayout>;

  const barData = [
    { name: 'Income', value: Number(stats.totalIncome) },
    { name: 'Expense', value: Number(stats.totalExpense) },
  ];

  return (
    <DashboardLayout>
      <h1 className="page-title">Secretary Dashboard</h1>
      <p className="text-gray-500 mb-6">Budget, income, expenses, and club operations overview.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} />
        <StatCard icon={Wallet} label="Collected This Month" value={`₹${stats.monthlyCollected}`} />
        <StatCard icon={TrendingUp} label="Total Income (YTD)" value={`₹${stats.totalIncome}`} />
        <StatCard icon={TrendingDown} label="Total Expense (YTD)" value={`₹${stats.totalExpense}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Income vs Expense (This Year)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-4">Net Balance</h3>
          <div className="flex-1 flex items-center justify-center">
            <p className={`text-4xl font-display font-bold ${Number(stats.netBalance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{stats.netBalance}
            </p>
          </div>
          <p className="text-xs text-gray-400 text-center">Pending payments: {stats.pendingPayments}</p>
        </div>
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
