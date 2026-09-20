import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { secretaryApi, memberApi } from '../../api/endpoints';

export default function SecretaryGallery() {
  const { register, handleSubmit, reset } = useForm();
  const [albums, setAlbums] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    Promise.all([memberApi.albums(), memberApi.events()])
      .then(([a, e]) => { setAlbums(a.data.data); setEvents(e.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    await secretaryApi.createAlbum(data.title, data.eventId || null);
    setMessage('Album created.');
    reset();
    load();
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Gallery Management</h1>
      <p className="text-gray-500 mb-6">Create event-wise photo albums for members to contribute to.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-4">New Album</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input className="input-field" placeholder="Album Title" {...register('title', { required: true })} />
            <select className="input-field" {...register('eventId')}>
              <option value="">No linked event</option>
              {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
            </select>
            <button className="btn-primary w-full">Create Album</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-2">
          {loading ? <Loader /> : albums.length === 0 ? (
            <p className="text-sm text-gray-400">No albums yet.</p>
          ) : albums.map((a) => (
            <div key={a.id} className="card">
              <p className="font-medium text-gray-800">{a.title}</p>
              <p className="text-xs text-gray-500">Created {new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
