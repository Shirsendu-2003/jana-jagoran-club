import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { memberApi } from '../../api/endpoints';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MemberPayments() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([memberApi.paymentHistory(), memberApi.paymentSummary()])
      .then(([h, s]) => {
        setHistory(h.data.data);
        setSummary(s.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Payments</h1>
      <p className="text-gray-500 mb-6">Fixed monthly membership fee: ₹50</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <p className="text-xs text-gray-500">Total Due</p>
          <p className="text-2xl font-display font-bold text-maroon-800">₹{summary.totalDue}</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500">Pending Months</p>
          <p className="text-2xl font-display font-bold text-maroon-800">{summary.pendingMonthsCount}</p>
        </div>
      </div>

      {summary.pendingMonthsCount > 0 && (
        <div className="card mb-6 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Pending:</strong> {summary.pendingMonths.join(', ')}
          </p>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Payment History</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No payment records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4">Month</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Paid On</th>
                  <th className="py-2">Mode</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .sort((a, b) => b.paymentYear - a.paymentYear || b.paymentMonth - a.paymentMonth)
                  .map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 pr-4">{MONTHS[p.paymentMonth - 1]} {p.paymentYear}</td>
                      <td className="py-2 pr-4">₹{p.amount}</td>
                      <td className="py-2 pr-4">
                        <span className={p.status === 'PAID' ? 'badge-green' : 'badge-red'}>{p.status}</span>
                      </td>
                      <td className="py-2 pr-4">{p.paidOn ? new Date(p.paidOn).toLocaleDateString() : '-'}</td>
                      <td className="py-2">{p.paymentMode || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
