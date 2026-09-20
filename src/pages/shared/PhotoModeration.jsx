import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { photoSubmissionApi } from '../../api/endpoints';
import { Check, X, Star, Trash2, MapPin, UserCircle2, Mail } from 'lucide-react';

export default function PhotoModeration() {
  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([photoSubmissionApi.pending(), photoSubmissionApi.approved()])
      .then(([p, a]) => { setPending(p.data.data); setApproved(a.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMessage(m); setTimeout(() => setMessage(''), 3000); };

  const approve = async (id) => {
    await photoSubmissionApi.review(id, true);
    showMsg('Photo approved — it is now live on the home page.');
    load();
  };

  const confirmReject = async () => {
    await photoSubmissionApi.review(rejectModal.id, false, rejectReason);
    showMsg('Photo rejected.');
    setRejectModal(null);
    setRejectReason('');
    load();
  };

  const toggleFeatured = async (id, current) => {
    await photoSubmissionApi.setFeatured(id, !current);
    showMsg(!current ? 'Photo featured.' : 'Photo unfeatured.');
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this photo permanently? The image file will also be removed.')) return;
    await photoSubmissionApi.remove(id);
    showMsg('Photo deleted.');
    load();
  };

  const list = tab === 'pending' ? pending : approved;

  return (
    <DashboardLayout>
      <h1 className="page-title">Photo Submissions</h1>
      <p className="text-gray-500 mb-6">
        Photos shared from the public home page. Nothing appears publicly until you approve it.
      </p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${tab === 'pending' ? 'bg-maroon-600 text-white border-maroon-600' : 'bg-white text-gray-600 border-gray-200'}`}
        >
          Pending Review {pending.length > 0 && `(${pending.length})`}
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${tab === 'approved' ? 'bg-maroon-600 text-white border-maroon-600' : 'bg-white text-gray-600 border-gray-200'}`}
        >
          Approved ({approved.length})
        </button>
      </div>

      {loading ? <Loader /> : list.length === 0 ? (
        <p className="text-sm text-gray-400">
          {tab === 'pending' ? 'No photos awaiting review.' : 'No approved photos yet.'}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p) => (
            <div key={p.id} className="card p-0 overflow-hidden flex flex-col">
              <div className="relative">
                <img src={p.imageUrl} alt="" className="w-full h-48 object-cover" />
                {p.isFeatured && (
                  <span className="absolute top-2 right-2 badge-yellow flex items-center gap-1">
                    <Star size={10} /> Featured
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                {p.caption && <p className="text-sm text-gray-700 mb-2">{p.caption}</p>}
                <div className="space-y-1 mb-3">
                  <p className="text-xs text-maroon-700 flex items-center gap-1 font-medium">
                    <UserCircle2 size={12} /> {p.photographerName}
                    {!p.submittedByUser && <span className="badge-gray ml-1">Public</span>}
                  </p>
                  {p.location && (
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={12} /> {p.location}</p>
                  )}
                  {p.contactEmail && (
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={12} /> {p.contactEmail}</p>
                  )}
                  <p className="text-xs text-gray-300">
                    {new Date(p.submittedAt).toLocaleString()}
                    {p.submitterIp && ` · ${p.submitterIp}`}
                  </p>
                </div>

                <div className="flex gap-2 mt-auto">
                  {tab === 'pending' ? (
                    <>
                      <button onClick={() => approve(p.id)} className="flex-1 p-2 rounded bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center">
                        <Check size={14} />
                      </button>
                      <button onClick={() => { setRejectModal(p); setRejectReason(''); }} className="flex-1 p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleFeatured(p.id, p.isFeatured)}
                      className={`flex-1 p-2 rounded text-xs flex items-center justify-center gap-1 ${p.isFeatured ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <Star size={12} /> {p.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                  )}
                  <button onClick={() => remove(p.id)} className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-800 mb-1">Reject this photo</h3>
            <p className="text-sm text-gray-500 mb-4">A short reason is recorded in the audit log.</p>
            <textarea
              className="input-field"
              rows="3"
              placeholder="e.g. Not related to the club, poor quality, duplicate..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <button onClick={confirmReject} className="btn-primary flex-1">Reject</button>
              <button onClick={() => setRejectModal(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
