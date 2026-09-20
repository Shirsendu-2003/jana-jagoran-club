import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { adminApi, memberApi } from '../../api/endpoints';
import { Trash2 } from 'lucide-react';

export default function AdminNotices() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { type: 'GENERAL' } });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    memberApi.notices().then((res) => setNotices(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    await adminApi.createNotice(data);
    setMessage('Notice published and members notified.');
    reset({ type: 'GENERAL' });
    load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    await adminApi.deleteNotice(id);
    load();
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Notice Management</h1>
      <p className="text-gray-500 mb-6">Publish announcements to all club members.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-4">New Notice</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input className="input-field" placeholder="Title" {...register('title', { required: true })} />
            <select className="input-field" {...register('type')}>
              <option value="GENERAL">General</option>
              <option value="IMPORTANT">Important</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="MEETING">Meeting</option>
              <option value="EVENT">Event</option>
            </select>
            <textarea className="input-field" placeholder="Content" rows="4" {...register('content', { required: true })} />
            <input className="input-field" placeholder="Attachment URL (optional)" {...register('attachmentUrl')} />
            <button className="btn-primary w-full">Publish Notice</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {loading ? <Loader /> : notices.length === 0 ? (
            <p className="text-sm text-gray-400">No notices yet.</p>
          ) : notices.map((n) => (
            <div key={n.id} className="card flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-800">{n.title}</p>
                  <span className="badge-gray">{n.type}</span>
                </div>
                <p className="text-sm text-gray-600">{n.content}</p>
              </div>
              <button onClick={() => onDelete(n.id)} className="text-red-500 hover:text-red-700 shrink-0 ml-3">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
