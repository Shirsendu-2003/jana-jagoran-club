import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { adminApi } from '../../api/endpoints';
import { Check, X, Star, Trash2 } from 'lucide-react';

export default function AdminGallery() {
  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.pendingImages(), adminApi.approvedImages()])
      .then(([p, a]) => { setPending(p.data.data); setApproved(a.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMessage(m); setTimeout(() => setMessage(''), 3000); };

  const decide = async (id, approve) => {
    await adminApi.approveImage(id, approve);
    showMsg(approve ? 'Photo approved.' : 'Photo rejected.');
    load();
  };

  const toggleFeatured = async (id, current) => {
    await adminApi.setFeatured(id, !current);
    showMsg(!current ? 'Added to public showcase.' : 'Removed from public showcase.');
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this photo?')) return;
    await adminApi.deleteImage(id);
    load();
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Gallery Management</h1>
      <p className="text-gray-500 mb-6">Approve member uploads, then feature your favorites on the public landing page.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${tab === 'pending' ? 'bg-maroon-600 text-white border-maroon-600' : 'bg-white text-gray-600 border-gray-200'}`}
        >
          Pending Approval {pending.length > 0 && `(${pending.length})`}
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${tab === 'approved' ? 'bg-maroon-600 text-white border-maroon-600' : 'bg-white text-gray-600 border-gray-200'}`}
        >
          Approved Photos ({approved.length})
        </button>
      </div>

      {tab === 'pending' && (
        pending.length === 0 ? (
          <p className="text-sm text-gray-400">No photos pending approval.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pending.map((img) => (
              <div key={img.id} className="card p-0 overflow-hidden">
                <img src={img.imageUrl} alt="" className="w-full h-40 object-cover" />
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-2">By {img.uploadedBy?.name || 'Member'}</p>
                  <div className="flex gap-2">
                    <button onClick={() => decide(img.id, true)} className="flex-1 p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center">
                      <Check size={14} />
                    </button>
                    <button onClick={() => decide(img.id, false)} className="flex-1 p-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center">
                      <X size={14} />
                    </button>
                    <button onClick={() => remove(img.id)} className="flex-1 p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'approved' && (
        approved.length === 0 ? (
          <p className="text-sm text-gray-400">No approved photos yet.</p>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-4">
              Photos marked <Star size={12} className="inline text-yellow-500 fill-yellow-500" /> Featured appear
              in the "Moments from the Club" section on the public landing page.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {approved.map((img) => (
                <div key={img.id} className="card p-0 overflow-hidden relative">
                  <img src={img.imageUrl} alt="" className="w-full h-40 object-cover" />
                  {img.isFeatured && (
                    <span className="absolute top-2 right-2 badge-yellow flex items-center gap-1">
                      <Star size={10} className="fill-yellow-700" /> Featured
                    </span>
                  )}
                  <div className="p-3">
                    <p className="text-xs text-gray-500 mb-2">By {img.uploadedBy?.name || 'Member'}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFeatured(img.id, img.isFeatured)}
                        className={`flex-1 p-1.5 rounded flex items-center justify-center gap-1 text-xs ${
                          img.isFeatured ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Star size={12} /> {img.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button onClick={() => remove(img.id)} className="flex-1 p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      )}
    </DashboardLayout>
  );
}
