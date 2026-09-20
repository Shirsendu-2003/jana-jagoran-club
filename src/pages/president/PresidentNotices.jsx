import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { presidentApi } from '../../api/endpoints';

export default function PresidentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    presidentApi.notices().then((res) => setNotices(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Notices</h1>
      <p className="text-gray-500 mb-6">All notices published to club members.</p>

      {notices.length === 0 ? <p className="text-sm text-gray-400">No notices yet.</p> : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{n.title}</h3>
                <span className="badge-gray">{n.type}</span>
              </div>
              <p className="text-sm text-gray-600">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
