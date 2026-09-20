import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, CalendarDays, ArrowRight } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import { publicApi } from '../../api/endpoints';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.allEvents()
      .then((res) => setEvents(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.eventDate >= today);
  const past = events.filter((e) => e.eventDate < today);

  return (
    <PublicLayout
      title="Events Calendar"
      subtitle="Pujas, cultural programmes, meetings and community gatherings."
    >
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        {loading ? (
          <p className="text-sm text-gray-400">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="card text-center py-14">
            <CalendarDays className="mx-auto text-brand-300 mb-3" size={36} />
            <p className="text-gray-500">No events scheduled yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-display font-bold text-maroon-800 mb-5">
              Upcoming Events {upcoming.length > 0 && <span className="badge-green ml-2">{upcoming.length}</span>}
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400 mb-12">Nothing on the calendar right now — check back soon.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5 mb-14">
                {upcoming.map((ev) => <EventCard key={ev.id} ev={ev} upcoming />)}
              </div>
            )}

            {past.length > 0 && (
              <>
                <h2 className="text-xl font-display font-bold text-maroon-800 mb-5">Past Events</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {past.map((ev) => <EventCard key={ev.id} ev={ev} />)}
                </div>
              </>
            )}
          </>
        )}

        <div className="text-center mt-14 pt-10 border-t border-gray-100">
          <p className="text-gray-500 mb-4">Members can register for events once signed in.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Join the Club <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

function EventCard({ ev, upcoming }) {
  return (
    <div className="card flex flex-col">
      {ev.imageUrl && (
        <img src={ev.imageUrl} alt={ev.title} className="w-full h-40 object-cover rounded-lg mb-3" />
      )}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-gray-800">{ev.title}</h3>
        {upcoming && <span className="badge-green shrink-0">Upcoming</span>}
      </div>
      {ev.description && <p className="text-sm text-gray-500 mb-3 flex-1">{ev.description}</p>}
      <div className="text-xs text-gray-500 space-y-1 mt-auto">
        <p className="flex items-center gap-1">
          <Clock size={12} /> {ev.eventDate}{ev.eventTime ? ` · ${ev.eventTime}` : ''}
        </p>
        {ev.location && <p className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</p>}
      </div>
    </div>
  );
}
