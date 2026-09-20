import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { secretaryApi, paymentRecordApi } from '../../api/endpoints';

const TABS = ['Budgets', 'Income', 'Expenses', 'Record Payment'];

export default function SecretaryBudget() {
  const [tab, setTab] = useState('Budgets');
  const [budgets, setBudgets] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const budgetForm = useForm();
  const incomeForm = useForm({ defaultValues: { category: 'MEMBERSHIP_FEE' } });
  const expenseForm = useForm({ defaultValues: { category: 'PUJA' } });
  const paymentForm = useForm();

  const loadAll = () => {
    setLoading(true);
    Promise.all([secretaryApi.budgets(), secretaryApi.income(), secretaryApi.expenses()])
      .then(([b, i, e]) => {
        setBudgets(b.data.data);
        setIncome(i.data.data);
        setExpenses(e.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const submitBudget = async (data) => {
    await secretaryApi.createBudget({ ...data, fiscalYear: Number(data.fiscalYear), totalAmount: Number(data.totalAmount || 0) });
    showMsg('Budget submitted for approval.');
    budgetForm.reset();
    loadAll();
  };

  const submitIncome = async (data) => {
    await secretaryApi.addIncome({ ...data, amount: Number(data.amount) });
    showMsg('Income recorded.');
    incomeForm.reset({ category: 'MEMBERSHIP_FEE' });
    loadAll();
  };

  const submitExpense = async (data) => {
    await secretaryApi.addExpense({ ...data, amount: Number(data.amount) });
    showMsg('Expense submitted for approval.');
    expenseForm.reset({ category: 'PUJA' });
    loadAll();
  };

  const submitPayment = async (data) => {
    await paymentRecordApi.record({ ...data, memberId: Number(data.memberId), month: Number(data.month), year: Number(data.year) });
    showMsg('Payment recorded and receipt generated.');
    paymentForm.reset();
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Budget & Finance</h1>
      <p className="text-gray-500 mb-6">Manage budgets, income, expenses, and member payments.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              tab === t ? 'bg-maroon-600 text-white border-maroon-600' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <>
          {tab === 'Budgets' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-1">
                <h3 className="font-semibold text-gray-800 mb-4">New Budget</h3>
                <form onSubmit={budgetForm.handleSubmit(submitBudget)} className="space-y-3">
                  <input className="input-field" placeholder="Title" {...budgetForm.register('title', { required: true })} />
                  <textarea className="input-field" placeholder="Description" rows="2" {...budgetForm.register('description')} />
                  <input className="input-field" type="number" placeholder="Fiscal Year" {...budgetForm.register('fiscalYear', { required: true })} />
                  <input className="input-field" type="number" step="0.01" placeholder="Total Amount" {...budgetForm.register('totalAmount')} />
                  <button className="btn-primary w-full">Submit for Approval</button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-3">
                {budgets.map((b) => (
                  <div key={b.id} className="card flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{b.title} ({b.fiscalYear})</p>
                      <p className="text-sm text-gray-500">₹{b.totalAmount}</p>
                    </div>
                    <span className={
                      b.status === 'APPROVED' ? 'badge-green' : b.status === 'REJECTED' ? 'badge-red' : 'badge-yellow'
                    }>{b.status}</span>
                  </div>
                ))}
                {budgets.length === 0 && <p className="text-sm text-gray-400">No budgets yet.</p>}
              </div>
            </div>
          )}

          {tab === 'Income' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-1">
                <h3 className="font-semibold text-gray-800 mb-4">Record Income</h3>
                <form onSubmit={incomeForm.handleSubmit(submitIncome)} className="space-y-3">
                  <select className="input-field" {...incomeForm.register('category')}>
                    <option value="MEMBERSHIP_FEE">Membership Fee</option>
                    <option value="DONATION">Donation</option>
                    <option value="SPONSORSHIP">Sponsorship</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input className="input-field" type="number" step="0.01" placeholder="Amount" {...incomeForm.register('amount', { required: true })} />
                  <input className="input-field" type="date" {...incomeForm.register('incomeDate', { required: true })} />
                  <textarea className="input-field" placeholder="Description" rows="2" {...incomeForm.register('description')} />
                  <button className="btn-primary w-full">Add Income</button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-2">
                {income.map((i) => (
                  <div key={i.id} className="card flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{i.category}</p>
                      <p className="text-xs text-gray-500">{i.incomeDate} — {i.description}</p>
                    </div>
                    <p className="font-semibold text-green-600">+₹{i.amount}</p>
                  </div>
                ))}
                {income.length === 0 && <p className="text-sm text-gray-400">No income recorded yet.</p>}
              </div>
            </div>
          )}

          {tab === 'Expenses' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-1">
                <h3 className="font-semibold text-gray-800 mb-4">Add Expense</h3>
                <form onSubmit={expenseForm.handleSubmit(submitExpense)} className="space-y-3">
                  <select className="input-field" {...expenseForm.register('category')}>
                    <option value="PUJA">Puja</option>
                    <option value="DECORATION">Decoration</option>
                    <option value="FOOD">Food</option>
                    <option value="ELECTRICITY">Electricity</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="MISCELLANEOUS">Miscellaneous</option>
                  </select>
                  <input className="input-field" type="number" step="0.01" placeholder="Amount" {...expenseForm.register('amount', { required: true })} />
                  <input className="input-field" type="date" {...expenseForm.register('expenseDate', { required: true })} />
                  <textarea className="input-field" placeholder="Description" rows="2" {...expenseForm.register('description')} />
                  <button className="btn-primary w-full">Submit for Approval</button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-2">
                {expenses.map((e) => (
                  <div key={e.id} className="card flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{e.category}</p>
                      <p className="text-xs text-gray-500">{e.expenseDate} — {e.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">-₹{e.amount}</p>
                      <span className={
                        e.status === 'APPROVED' ? 'badge-green' : e.status === 'REJECTED' ? 'badge-red' : 'badge-yellow'
                      }>{e.status}</span>
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && <p className="text-sm text-gray-400">No expenses recorded yet.</p>}
              </div>
            </div>
          )}

          {tab === 'Record Payment' && (
            <div className="card max-w-md">
              <h3 className="font-semibold text-gray-800 mb-4">Manual Payment Entry</h3>
              <form onSubmit={paymentForm.handleSubmit(submitPayment)} className="space-y-3">
                <input className="input-field" type="number" placeholder="Member ID" {...paymentForm.register('memberId', { required: true })} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" type="number" min="1" max="12" placeholder="Month (1-12)" {...paymentForm.register('month', { required: true })} />
                  <input className="input-field" type="number" placeholder="Year" {...paymentForm.register('year', { required: true })} />
                </div>
                <input className="input-field" type="number" step="0.01" placeholder="Amount (default ₹50)" {...paymentForm.register('amount')} />
                <select className="input-field" {...paymentForm.register('paymentMode')}>
                  <option value="CASH">Cash</option>
                  <option value="ONLINE">Online</option>
                  <option value="MANUAL">Manual</option>
                </select>
                <button className="btn-primary w-full">Record Payment</button>
              </form>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
