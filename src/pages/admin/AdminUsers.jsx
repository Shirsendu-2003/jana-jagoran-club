import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { adminApi } from '../../api/endpoints';
import { Trash2, ShieldOff, ShieldCheck, KeyRound } from 'lucide-react';

const ROLES = ['MEMBER', 'SECRETARY', 'PRESIDENT', 'ADMIN', 'SUPER_ADMIN'];

export default function AdminUsers() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { role: 'MEMBER' } });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [resetResult, setResetResult] = useState(null);

  const load = () => {
    adminApi.allUsers().then((res) => setUsers(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMessage(m); setTimeout(() => setMessage(''), 3000); };

  const onCreate = async (data) => {
    try {
      await adminApi.createUser(data);
      showMsg('User created successfully.');
      reset({ role: 'MEMBER' });
      load();
    } catch (err) {
      showMsg(err?.response?.data?.message || 'Failed to create user.');
    }
  };

  const onRoleChange = async (id, role) => {
    await adminApi.updateUserRole(id, role);
    load();
  };

  const onToggleActive = async (id, active) => {
    await adminApi.setUserStatus(id, !active);
    load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    await adminApi.deleteUser(id);
    load();
  };

  const onResetPassword = async (id) => {
    if (!confirm("Reset this user's password? They will be required to set a new one on next login.")) return;
    const res = await adminApi.resetUserPassword(id);
    setResetResult(res.data.data);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">User Management</h1>
      <p className="text-gray-500 mb-6">Create accounts, manage roles, and reset passwords.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      {resetResult && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-4 py-3 mb-4 flex justify-between items-start gap-4">
          <div>
            <p className="font-medium">Temporary password for {resetResult.email}:</p>
            <p className="font-mono text-base mt-1">{resetResult.temporaryPassword}</p>
            <p className="text-xs mt-1">Share this through a trusted channel -- they'll be forced to set their own password on next login.</p>
          </div>
          <button onClick={() => setResetResult(null)} className="text-yellow-700 hover:text-yellow-900 text-xs shrink-0">Dismiss</button>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="card lg:col-span-1 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4">Create User</h3>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-3">
            <input className="input-field" placeholder="Full Name" {...register('name', { required: true })} />
            <input className="input-field" type="email" placeholder="Email" {...register('email', { required: true })} />
            <input className="input-field" placeholder="Phone" {...register('phone')} />
            <input className="input-field" type="password" placeholder="Temporary Password" {...register('password', { required: true })} />
            <select className="input-field" {...register('role')}>
              {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
            <input className="input-field" placeholder="Address (if Member)" {...register('address')} />
            <button className="btn-primary w-full">Create User</button>
            <p className="text-xs text-gray-400">The user will be required to set their own password on first login.</p>
          </form>
        </div>

        <div className="lg:col-span-3">
          {loading ? <Loader /> : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 pr-4 font-medium text-gray-700">{u.name}</td>
                      <td className="py-2 pr-4 text-gray-500">{u.email}</td>
                      <td className="py-2 pr-4">
                        <select
                          className="border border-gray-200 rounded px-2 py-1 text-xs"
                          value={u.role.name}
                          onChange={(e) => onRoleChange(u.id, e.target.value)}
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td className="py-2 pr-4">
                        <span className={u.isActive ? 'badge-green' : 'badge-red'}>{u.isActive ? 'Active' : 'Inactive'}</span>
                        {u.mustChangePassword && <span className="badge-yellow ml-1">Pending Reset</span>}
                      </td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <button onClick={() => onResetPassword(u.id)} title="Reset Password" className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                            <KeyRound size={14} />
                          </button>
                          <button onClick={() => onToggleActive(u.id, u.isActive)} title={u.isActive ? 'Deactivate' : 'Activate'} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200">
                            {u.isActive ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                          </button>
                          <button onClick={() => onDelete(u.id)} title="Delete" className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
