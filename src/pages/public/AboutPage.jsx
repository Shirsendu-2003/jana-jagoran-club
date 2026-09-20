import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarDays, Camera, Heart, ArrowRight } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import { publicApi } from '../../api/endpoints';

const VALUES = [
  { icon: Users, title: 'Community First', desc: 'Everything we do starts with the people of Gokarna and the neighbourhoods around us.' },
  { icon: Heart, title: 'Culture & Tradition', desc: 'Pujas, festivals and cultural programmes that keep our shared traditions alive.' },
  { icon: CalendarDays, title: 'Year-Round Activity', desc: 'Not just festival season — events, meetings and initiatives throughout the year.' },
  { icon: Camera, title: 'Shared Memories', desc: 'A growing photo record of the club, contributed by members and neighbours alike.' },
];

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    publicApi.homepage().then((res) => {
      const section = res.data.data.find((s) => s.sectionKey === 'ABOUT');
      setAbout(section || null);
    }).catch(() => {});
    publicApi.stats().then((res) => setStats(res.data.data)).catch(() => {});
  }, []);

  return (
    <PublicLayout
      title="About Jana Jagoran Club"
      subtitle="Bringing our community together since 2016."
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {about?.imageUrl && (
          <img src={about.imageUrl} alt="" className="w-full max-h-80 object-cover rounded-2xl mb-8" />
        )}

        <div className="prose prose-sm max-w-none">
          <h2 className="text-2xl font-display font-bold text-maroon-800 mb-4">
            {about?.title || 'Who We Are'}
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {about?.body || `Jana Jagoran Club is a community-driven club based in Gokarna, Kandi, Murshidabad.
Since our founding, we have worked to bring neighbours together through cultural
activities, social events, festival celebrations and community development work.

Our members contribute a modest monthly subscription which funds our pujas, cultural
programmes, and the upkeep of the club. Every rupee is tracked openly, and our budgets
are reviewed and approved by the committee before being spent.

Whether you have lived here all your life or have just moved to the area, you are
welcome to join us.`}
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-4 mt-10">
            <StatCard value={stats.activeMembers} label="Active Members" />
            <StatCard value={stats.totalEvents} label="Events Held" />
            <StatCard value={stats.photosShared} label="Photos Shared" />
          </div>
        )}
      </section>

      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-display font-bold text-maroon-800 text-center mb-10">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
        <h2 className="text-2xl font-display font-bold text-maroon-800 mb-3">Want to be part of it?</h2>
        <p className="text-gray-500 mb-6">
          Membership is ₹50 a month. Register online and a club Admin will review your application.
        </p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2">
          Become a Member <ArrowRight size={18} />
        </Link>
      </section>
    </PublicLayout>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="card text-center">
      <p className="text-2xl font-display font-bold text-maroon-800">{value ?? '—'}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
