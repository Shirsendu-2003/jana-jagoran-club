import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { superAdminApi } from '../../api/endpoints';
import { Trash2, ShieldOff, ShieldCheck } from 'lucide-react';

const ROLES = ['MEMBER', 'SECRETARY', 'PRESIDENT', 'ADMIN', 'SUPER_ADMIN'];

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    superAdminApi.allUsers().then((res) => setUsers(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onRoleChange = async (id, role) => {
    await superAdminApi.assignRole(id, role);
    load();
  };

  const onToggleActive = async (id, active) => {
    await superAdminApi.setUserStatus(id, !active);
    load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    await superAdminApi.deleteUser(id);
    load();
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">All Users</h1>
      <p className="text-gray-500 mb-6">Full control over every account in the system, including Admins and Presidents.</p>

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
                </td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button onClick={() => onToggleActive(u.id, u.isActive)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200">
                      {u.isActive ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    </button>
                    <button onClick={() => onDelete(u.id)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
