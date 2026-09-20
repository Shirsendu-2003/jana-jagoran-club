import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { designationApi, adminApi } from '../../api/endpoints';
import { Check, X, Settings, UserMinus } from 'lucide-react';

const MENU_KEYS = [
  'BUDGET_FINANCE', 'EVENTS', 'GALLERY', 'NOTICES', 'USER_MANAGEMENT',
  'MEMBER_MANAGEMENT', 'REPORTS', 'HOMEPAGE_EDIT', 'FAQ_MANAGEMENT', 'APPROVALS',
];

const TABS = ['Designations', 'Assign / Release'];

export default function AdminDesignations() {
  const [tab, setTab] = useState('Designations');
  const [designations, setDesignations] = useState([]);
  const [postDetails, setPostDetails] = useState({}); // designationId -> post detail
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [menuModal, setMenuModal] = useState(null); // { id, title, selected: Set }
  const [releaseModal, setReleaseModal] = useState(null); // { id, name }
  const [releaseReason, setReleaseReason] = useState('');

  const proposeForm = useForm({ defaultValues: { level: 'LOWER_LEVEL' } });
  const assignForm = useForm();

  const load = async () => {
    setLoading(true);
    const [d, pa, aa, m] = await Promise.all([
      designationApi.all(),
      designationApi.pendingAssignments(),
      designationApi.activeAssignments(),
      adminApi.searchMembers(''),
    ]);
    setDesignations(d.data.data);
    setPendingAssignments(pa.data.data);
    setActiveAssignments(aa.data.data);
    setMembers(m.data.data);

    const details = await Promise.all(d.data.data.map((des) => designationApi.postDetail(des.id)));
    const map = {};
    d.data.data.forEach((des, i) => { map[des.id] = details[i].data.data; });
    setPostDetails(map);

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMessage(m); setTimeout(() => setMessage(''), 3000); };

  const onPropose = async (data) => {
    try {
      await designationApi.propose(data);
      showMsg('Designation proposed -- pending Admin approval.');
      proposeForm.reset({ level: 'LOWER_LEVEL' });
      load();
    } catch (err) {
      showMsg(err?.response?.data?.message || 'Failed to propose designation.');
    }
  };

  const decideDesignation = async (id, approve) => {
    await designationApi.decide(id, approve);
    showMsg(approve ? 'Designation approved and active.' : 'Designation rejected.');
    load();
  };

  const retireDesignation = async (id) => {
    if (!confirm('Retire this designation? It will no longer be assignable.')) return;
    try {
      await designationApi.retire(id);
      showMsg('Designation retired.');
      load();
    } catch (err) {
      showMsg(err?.response?.data?.message || 'Failed to retire.');
    }
  };

  const openMenuModal = async (designation) => {
    const res = await designationApi.getMenuPermissions(designation.id);
    const selected = new Set(res.data.data.map((p) => p.menuKey));
    setMenuModal({ id: designation.id, title: designation.title, selected });
  };

  const toggleMenuKey = (key) => {
    setMenuModal((prev) => {
      const next = new Set(prev.selected);
      next.has(key) ? next.delete(key) : next.add(key);
      return { ...prev, selected: next };
    });
  };

  const saveMenuPermissions = async () => {
    await designationApi.setMenuPermissions(menuModal.id, Array.from(menuModal.selected));
    showMsg('Menu permissions updated.');
    setMenuModal(null);
  };

  const onRequestAssign = async (data) => {
    try {
      await designationApi.requestAssignment(Number(data.memberId), Number(data.designationId));
      showMsg('Assignment requested -- pending approval.');
      assignForm.reset();
      load();
    } catch (err) {
      showMsg(err?.response?.data?.message || 'Failed to request assignment.');
    }
  };

  const decideAssignment = async (id, approve) => {
    await designationApi.decideAssignment(id, approve);
    showMsg(approve ? 'Assignment approved.' : 'Assignment rejected.');
    load();
  };

  const openReleaseModal = (assignment) => {
    setReleaseModal({ id: assignment.id, name: assignment.member.user.name });
    setReleaseReason('');
  };

  const confirmRelease = async () => {
    // Request + immediately decide (Admin releasing directly counts as both steps for convenience)
    await designationApi.requestRelease(releaseModal.id, releaseReason);
    await designationApi.decideRelease(releaseModal.id, true, releaseReason);
    showMsg('Member released from designation.');
    setReleaseModal(null);
    load();
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Designation Management</h1>
      <p className="text-gray-500 mb-6">Create posts (e.g. President, Secretary), assign members, and control menu access per position.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${tab === t ? 'bg-maroon-600 text-white border-maroon-600' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <>
          {tab === 'Designations' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-1 h-fit">
                <h3 className="font-semibold text-gray-800 mb-4">Propose Designation</h3>
                <form onSubmit={proposeForm.handleSubmit(onPropose)} className="space-y-3">
                  <input className="input-field" placeholder="Title (e.g. Cultural Secretary)" {...proposeForm.register('title', { required: true })} />
                  <textarea className="input-field" rows="2" placeholder="Description" {...proposeForm.register('description')} />
                  <select className="input-field" {...proposeForm.register('level')}>
                    <option value="LOWER_LEVEL">Lower Level (e.g. President/Secretary tier)</option>
                    <option value="CHAIR">Chair (top committee seat)</option>
                  </select>
                  <button className="btn-primary w-full">Submit for Approval</button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-3">
                {designations.length === 0 ? (
                  <p className="text-sm text-gray-400">No designations created yet.</p>
                ) : designations.map((d) => {
                  const detail = postDetails[d.id];
                  return (
                    <div key={d.id} className="card flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{d.title}</p>
                        <p className="text-xs text-gray-500">{d.description}</p>
                        <span className="badge-gray mt-1 inline-block">{d.level === 'CHAIR' ? 'Chair' : 'Lower Level'}</span>
                      </div>

                      {!detail ? null : detail.status === 'CREATION' ? (
                        <div className="flex gap-2 items-center shrink-0">
                          <span className="badge-yellow">Awaiting Approval</span>
                          <button onClick={() => decideDesignation(d.id, true)} className="p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200">
                            <Check size={14} />
                          </button>
                          <button onClick={() => decideDesignation(d.id, false)} className="p-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200">
                            <X size={14} />
                          </button>
                        </div>
                      ) : detail.status === 'ACTIVE' ? (
                        <div className="flex gap-2 items-center shrink-0">
                          <span className="badge-green">Active</span>
                          <button onClick={() => openMenuModal(d)} className="text-xs text-maroon-600 hover:underline flex items-center gap-1">
                            <Settings size={12} /> Menu
                          </button>
                          <button onClick={() => retireDesignation(d.id)} className="text-xs text-red-600 hover:underline">Retire</button>
                        </div>
                      ) : (
                        <span className="badge-red shrink-0">Inactive</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'Assign / Release' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-1 h-fit">
                <h3 className="font-semibold text-gray-800 mb-4">Assign Designation</h3>
                <form onSubmit={assignForm.handleSubmit(onRequestAssign)} className="space-y-3">
                  <select className="input-field" {...assignForm.register('memberId', { required: true })}>
                    <option value="">Select member</option>
                    {members.map((m) => <option key={m.id} value={m.id}>{m.user.name} ({m.membershipId})</option>)}
                  </select>
                  <select className="input-field" {...assignForm.register('designationId', { required: true })}>
                    <option value="">Select designation</option>
                    {designations
                      .filter((d) => postDetails[d.id]?.status === 'ACTIVE')
                      .map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
                  </select>
                  <button className="btn-primary w-full">Request Assignment</button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Pending Assignment Requests</h3>
                  {pendingAssignments.length === 0 ? (
                    <p className="text-sm text-gray-400">Nothing pending.</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingAssignments.map((a) => (
                        <div key={a.id} className="card flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{a.member.user.name}</p>
                            <p className="text-xs text-gray-500">→ {a.designation.title}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => decideAssignment(a.id, true)} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200">
                              <Check size={16} />
                            </button>
                            <button onClick={() => decideAssignment(a.id, false)} className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Current Holders</h3>
                  {activeAssignments.length === 0 ? (
                    <p className="text-sm text-gray-400">No active designation holders yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeAssignments.map((a) => (
                        <div key={a.id} className="card flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{a.member.user.name}</p>
                            <p className="text-xs text-gray-500">{a.designation.title}</p>
                          </div>
                          <button onClick={() => openReleaseModal(a)} className="btn-secondary text-xs flex items-center gap-1">
                            <UserMinus size={14} /> Release
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Menu Allotment modal */}
      {menuModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2"><Settings size={16} /> Menu Allotment -- {menuModal.title}</h3>
            <p className="text-sm text-gray-500 mb-4">Choose which app sections this position can access.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {MENU_KEYS.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={menuModal.selected.has(key)} onChange={() => toggleMenuKey(key)} />
                  {key.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={saveMenuPermissions} className="btn-primary flex-1">Save</button>
              <button onClick={() => setMenuModal(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Release modal */}
      {releaseModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-800 mb-1">Release {releaseModal.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for the record.</p>
            <textarea className="input-field" rows="3" placeholder="Reason for release" value={releaseReason} onChange={(e) => setReleaseReason(e.target.value)} />
            <div className="flex gap-2 mt-4">
              <button disabled={!releaseReason.trim()} onClick={confirmRelease} className="btn-primary flex-1 disabled:opacity-50">Confirm Release</button>
              <button onClick={() => setReleaseModal(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
