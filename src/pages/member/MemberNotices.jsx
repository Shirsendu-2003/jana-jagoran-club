import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { memberApi } from '../../api/endpoints';
import { Paperclip } from 'lucide-react';

const typeStyles = {
  EMERGENCY: 'badge-red',
  IMPORTANT: 'badge-yellow',
  MEETING: 'badge-gray',
  EVENT: 'badge-green',
  GENERAL: 'badge-gray',
};

export default function MemberNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberApi.notices().then((res) => setNotices(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Notice Board</h1>
      <p className="text-gray-500 mb-6">Stay updated with the latest club announcements.</p>

      {notices.length === 0 ? (
        <p className="text-sm text-gray-400">No notices published yet.</p>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-gray-800">{n.title}</h3>
                <span className={typeStyles[n.type] || 'badge-gray'}>{n.type}</span>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line">{n.content}</p>
              {n.attachmentUrl && (
                <a href={n.attachmentUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-maroon-600 hover:underline">
                  <Paperclip size={12} /> Download attachment
                </a>
              )}
              <p className="text-xs text-gray-400 mt-3">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
