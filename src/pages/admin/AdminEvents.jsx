import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { adminApi, memberApi } from '../../api/endpoints';
import { Trash2 } from 'lucide-react';

export default function AdminEvents() {
  const { register, handleSubmit, reset } = useForm();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    memberApi.events().then((res) => setEvents(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    await adminApi.createEvent(data);
    setMessage('Event created.');
    reset();
    load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await adminApi.deleteEvent(id);
    load();
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Event Management</h1>
      <p className="text-gray-500 mb-6">Create and manage club-wide events.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-4">Create Event</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input className="input-field" placeholder="Title" {...register('title', { required: true })} />
            <textarea className="input-field" placeholder="Description" rows="2" {...register('description')} />
            <input className="input-field" placeholder="Location" {...register('location')} />
            <input className="input-field" type="date" {...register('eventDate', { required: true })} />
            <input className="input-field" type="time" {...register('eventTime')} />
            <input className="input-field" placeholder="Image URL" {...register('imageUrl')} />
            <button className="btn-primary w-full">Create Event</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {loading ? <Loader /> : events.length === 0 ? (
            <p className="text-sm text-gray-400">No events yet.</p>
          ) : events.map((ev) => (
            <div key={ev.id} className="card flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{ev.title}</p>
                <p className="text-xs text-gray-500">{ev.eventDate} {ev.eventTime || ''} · {ev.location}</p>
              </div>
              <button onClick={() => onDelete(ev.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
