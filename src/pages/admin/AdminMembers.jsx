import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { adminApi } from '../../api/endpoints';
import { Search, Check, X } from 'lucide-react';

const statusBadge = (status) => {
  if (status === 'ACTIVE') return 'badge-green';
  if (status === 'PENDING') return 'badge-yellow';
  return 'badge-red';
};

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [pending, setPending] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [reasonModal, setReasonModal] = useState(null); // { memberId, name }
  const [reasonText, setReasonText] = useState('');

  const load = (kw = '') => {
    setLoading(true);
    Promise.all([adminApi.searchMembers(kw), adminApi.pendingMembers()])
      .then(([m, p]) => {
        setMembers(m.data.data);
        setPending(p.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMessage(m); setTimeout(() => setMessage(''), 3000); };

  const onSearch = (e) => {
    e.preventDefault();
    load(keyword);
  };

  // Switch toggled -> if turning Active, do it immediately; if turning Inactive, open the reason modal first.
  const onToggleSwitch = (member) => {
    if (member.status === 'ACTIVE') {
      setReasonModal({ memberId: member.id, name: member.user.name });
      setReasonText('');
    } else {
      confirmToggle(member.id, true, null);
    }
  };

  const confirmToggle = async (memberId, active, reason) => {
    await adminApi.toggleMemberStatus(memberId, active, reason);
    showMsg(active ? 'Member marked Active.' : 'Member marked Inactive.');
    setReasonModal(null);
    load(keyword);
  };

  const approve = async (id) => {
    await adminApi.approveMember(id);
    showMsg('Member approved -- they can now log in.');
    load(keyword);
  };

  const reject = async (id) => {
    if (!confirm('Reject this registration? The applicant will not be able to log in.')) return;
    await adminApi.rejectMember(id);
    showMsg('Registration rejected.');
    load(keyword);
  };

  const exportCsv = () => {
    const header = 'Membership ID,Name,Email,Phone,Status,Joined\n';
    const rows = members.map((m) =>
      [m.membershipId, m.user.name, m.user.email, m.user.phone || '', m.status, m.dateOfJoining].join(',')
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Member Management</h1>
      <p className="text-gray-500 mb-6">Approve new registrations, and search/filter existing members.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      {/* Pending registrations */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          Pending Registrations
          {pending.length > 0 && <span className="badge-yellow">{pending.length}</span>}
        </h3>
        {loading ? <Loader /> : pending.length === 0 ? (
          <p className="text-sm text-gray-400">No registrations awaiting approval.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((m) => (
              <div key={m.id} className="card flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{m.user.name}</p>
                  <p className="text-xs text-gray-500">{m.user.email} · {m.user.phone || 'No phone'}</p>
                  <p className="text-xs text-gray-400">{m.membershipId} · Applied {m.dateOfJoining}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(m.id)} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200">
                    <Check size={18} />
                  </button>
                  <button onClick={() => reject(m.id)} className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Existing members search */}
      <h3 className="font-semibold text-gray-800 mb-3">All Members</h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={onSearch} className="flex-1 flex gap-2">
          <input
            className="input-field"
            placeholder="Search by name, phone, email, or membership ID"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="btn-primary flex items-center gap-1"><Search size={16} /> Search</button>
        </form>
        <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
      </div>

      {loading ? <Loader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-2 pr-4">Membership ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 pr-4">{m.membershipId}</td>
                  <td className="py-2 pr-4 font-medium text-gray-700">{m.user.name}</td>
                  <td className="py-2 pr-4 text-gray-500">{m.user.email}</td>
                  <td className="py-2 pr-4 text-gray-500">{m.user.phone || '-'}</td>
                  <td className="py-2 pr-4">
                    <span className={statusBadge(m.status)}>{m.status}</span>
                    {m.deactivationReason && (
                      <p className="text-xs text-gray-400 mt-0.5">Reason: {m.deactivationReason}</p>
                    )}
                  </td>
                  <td className="py-2">
                    {(m.status === 'ACTIVE' || m.status === 'INACTIVE') && (
                      <button
                        onClick={() => onToggleSwitch(m)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${m.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${m.status === 'ACTIVE' ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr><td colSpan="6" className="py-4 text-center text-gray-400">No members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: reason required when switching a member to Inactive */}
      {reasonModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-800 mb-1">Mark {reasonModal.name} Inactive</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for the record.</p>
            <textarea
              className="input-field"
              rows="3"
              placeholder="e.g. Moved out of the area, requested by member, non-payment..."
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <button
                disabled={!reasonText.trim()}
                onClick={() => confirmToggle(reasonModal.memberId, false, reasonText.trim())}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Save
              </button>
              <button onClick={() => setReasonModal(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
