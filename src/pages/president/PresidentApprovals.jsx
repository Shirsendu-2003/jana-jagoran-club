import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { presidentApi } from '../../api/endpoints';
import { Check, X } from 'lucide-react';

export default function PresidentApprovals() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    presidentApi.budgets().then((res) => setBudgets(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const decide = async (id, approve) => {
    await presidentApi.approveBudget(id, approve);
    setMessage(approve ? 'Budget approved.' : 'Budget rejected.');
    load();
  };

  const pending = budgets.filter((b) => b.status === 'PENDING_APPROVAL');
  const decided = budgets.filter((b) => b.status !== 'PENDING_APPROVAL');

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Budget Approvals</h1>
      <p className="text-gray-500 mb-6">Review budgets submitted by the Secretary.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <h3 className="font-semibold text-gray-800 mb-3">Pending Decisions</h3>
      {pending.length === 0 ? (
        <p className="text-sm text-gray-400 mb-6">No budgets awaiting approval.</p>
      ) : (
        <div className="space-y-3 mb-8">
          {pending.map((b) => (
            <div key={b.id} className="card flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{b.title} ({b.fiscalYear})</p>
                <p className="text-sm text-gray-500">{b.description}</p>
                <p className="text-sm font-semibold text-maroon-700 mt-1">₹{b.totalAmount}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => decide(b.id, true)} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200">
                  <Check size={18} />
                </button>
                <button onClick={() => decide(b.id, false)} className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-semibold text-gray-800 mb-3">Decision History</h3>
      <div className="space-y-2">
        {decided.map((b) => (
          <div key={b.id} className="card flex justify-between items-center">
            <p className="text-sm text-gray-700">{b.title} ({b.fiscalYear})</p>
            <span className={b.status === 'APPROVED' ? 'badge-green' : 'badge-red'}>{b.status}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
