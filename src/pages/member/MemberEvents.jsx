import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { memberApi } from '../../api/endpoints';
import { MapPin, Clock } from 'lucide-react';

export default function MemberEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    memberApi.events().then((res) => setEvents(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    setMessage('');
    try {
      await memberApi.registerForEvent(eventId);
      setMessage('Successfully registered for the event!');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setRegistering(null);
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Club Events</h1>
      <p className="text-gray-500 mb-6">Browse and register for upcoming club events.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      {events.length === 0 ? (
        <p className="text-sm text-gray-400">No events scheduled yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => (
            <div key={ev.id} className="card flex flex-col">
              {ev.imageUrl && (
                <img src={ev.imageUrl} alt={ev.title} className="w-full h-36 object-cover rounded-lg mb-3" />
              )}
              <h3 className="font-semibold text-gray-800 mb-1">{ev.title}</h3>
              <p className="text-sm text-gray-500 mb-3 flex-1">{ev.description}</p>
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <p className="flex items-center gap-1"><Clock size={12} /> {ev.eventDate} {ev.eventTime || ''}</p>
                {ev.location && <p className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</p>}
              </div>
              <button
                onClick={() => handleRegister(ev.id)}
                disabled={registering === ev.id}
                className="btn-primary text-sm"
              >
                {registering === ev.id ? 'Registering...' : 'Register'}
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
