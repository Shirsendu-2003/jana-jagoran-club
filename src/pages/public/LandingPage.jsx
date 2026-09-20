import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Wallet,
  CalendarDays,
  Image as ImageIcon,
  Bell,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Clock,
  Camera,
  UserCircle2,
  Menu,
  X
} from 'lucide-react';
import { publicApi } from '../../api/endpoints';
import PhotoUploadModal from '../../components/PhotoUploadModal';
import { PublicFooter } from '../../components/PublicLayout';

const FEATURES = [
  { icon: Users, title: 'Member Directory', desc: 'A single home for every member\u2019s profile, dues, and history.' },
  { icon: Wallet, title: 'Transparent Finances', desc: 'Budgets, income, and expenses tracked and approved openly.' },
  { icon: CalendarDays, title: 'Events & Attendance', desc: 'Browse events, register in a tap, and keep attendance on record.' },
  { icon: ImageIcon, title: 'Shared Photo Gallery', desc: 'Members contribute photos; Admins curate what goes live.' },
  { icon: Bell, title: 'Notices & Reminders', desc: 'Important announcements reach every member instantly.' },
  { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Member, Secretary, President, Admin, and Super Admin each see exactly what they need.' },
];

export default function LandingPage() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showcase, setShowcase] = useState([]);
  const [stats, setStats] = useState(null);
  const [homepage, setHomepage] = useState({});
  const [communityPhotos, setCommunityPhotos] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    publicApi.upcomingEvents().then((res) => setUpcoming(res.data.data)).catch(() => {});
    publicApi.pastEvents().then((res) => setPast(res.data.data)).catch(() => {});
    publicApi.latestNotices().then((res) => setNotices(res.data.data)).catch(() => {});
    publicApi.galleryShowcase().then((res) => setShowcase(res.data.data)).catch(() => {});
    publicApi.stats().then((res) => setStats(res.data.data)).catch(() => {});
    publicApi.approvedPhotos(12).then((res) => setCommunityPhotos(res.data.data)).catch(() => {});
    publicApi.homepage().then((res) => {
      const map = {};
      res.data.data.forEach((s) => { map[s.sectionKey] = s; });
      setHomepage(map);
    }).catch(() => {});
  }, []);

  // Prefer real event photos for the hero-adjacent stat strip once available,
  // but the app works fine before any photos/events exist yet.
  const pastEventsWithPhotos = past.filter((ev) => ev.imageUrl);

  const hero = homepage.HERO;
  const about = homepage.ABOUT;
  const announcement = homepage.ANNOUNCEMENT;

  return (
    <div className="min-h-screen bg-[#fdf7f2]">
      {/* Nav */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

    <div className="flex items-center justify-between">

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 flex-shrink-0"
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-sm">
          <img
            src="/logo.png"
            alt="Jana Jagoran Club Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="hidden sm:block">
          <span className="font-display font-bold text-maroon-800 block leading-tight">
            Jana Jagoran Club
          </span>
          <span className="text-[10px] text-gray-500">
            Estd. 2016
          </span>
        </div>
      </Link>


      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">

        <Link
          to="/"
          className="text-sm font-medium text-maroon-800 hover:text-maroon-600 transition-colors"
        >
          Home
        </Link>

        <Link
          to="/about"
          className="text-sm font-medium text-gray-600 hover:text-maroon-700 transition-colors"
        >
          About Us
        </Link>

        <Link
          to="/register"
          className="text-sm font-medium text-gray-600 hover:text-maroon-700 transition-colors"
        >
          Membership
        </Link>

       

        <Link
          to="/faqs"
          className="text-sm font-medium text-gray-600 hover:text-maroon-700 transition-colors"
        >
          FAQs
        </Link>

      </nav>


      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-3">

        <Link
          to="/login"
          className="text-sm font-medium text-maroon-700 hover:text-maroon-900 transition-colors"
        >
          Sign In
        </Link>

        <Link
          to="/register"
          className="btn-primary text-sm"
        >
          Join the Club
        </Link>

      </div>


      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-maroon-800 hover:bg-maroon-50 transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

    </div>


    {/* Mobile Navigation */}
    {mobileMenuOpen && (
      <div className="lg:hidden pt-4 pb-2 border-t border-gray-100 mt-3">

        <nav className="flex flex-col space-y-1">

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-maroon-800 hover:bg-maroon-50"
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50"
          >
            About Us
          </Link>

          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50"
          >
            Membership
          </Link>

         

          <Link
            to="/faqs"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50"
          >
            FAQs
          </Link>

          <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-maroon-700 border border-maroon-200 hover:bg-maroon-50"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-sm text-center"
            >
              Join the Club
            </Link>

          </div>

        </nav>

      </div>
    )}

  </div>
</header>

      {/* Announcement banner -- only shows if an Admin has filled in the ANNOUNCEMENT section */}
      {announcement && (announcement.title || announcement.body) && (
        <div className="bg-brand-500 text-maroon-900 text-sm text-center py-2 px-4 font-medium">
          {announcement.title && <span className="font-semibold">{announcement.title}: </span>}
          {announcement.body}
        </div>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-maroon-800 via-maroon-700 to-brand-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-white/10 text-brand-100 text-xs font-medium px-3 py-1 rounded-full mb-4">
              Society Club Management System
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold leading-tight mb-4">
              {hero?.title ? hero.title : (
                <>One home for everything <span className="text-brand-300">Jana Jagoran Club</span> does.</>
              )}
            </h1>
            <p className="text-brand-100 text-lg mb-8 max-w-lg">
              {hero?.body || 'Membership, monthly dues, budgets, events, notices, and photo galleries — all in one place, with the right access for every role.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="bg-brand-400 hover:bg-brand-300 text-maroon-900 font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors">
                Become a Member <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="bg-white/10 hover:bg-white/20 font-medium px-6 py-3 rounded-lg transition-colors">
                Member / Staff Sign In
              </Link>
              <button
                onClick={() => setUploadOpen(true)}
                className="bg-white/10 hover:bg-white/20 font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Camera size={18} /> Share a Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatBubble label="Fixed monthly fee" value="₹50" />
            <StatBubble label="Active members" value={stats ? stats.activeMembers : '—'} />
            <StatBubble label="Events held" value={stats ? stats.totalEvents : '—'} />
            <StatBubble label="Photos shared" value={stats ? stats.photosShared : '—'} />
          </div>
        </div>
      </section>

      {/* Photo showcase -- pulled from Admin-approved + featured gallery photos */}
      {showcase.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Camera size={20} className="text-maroon-600" />
            <h2 className="text-2xl font-display font-bold text-maroon-800">Moments from the Club</h2>
          </div>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            A glimpse of our pujas, events, and get-togethers — shared by members, curated by the Admin team.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {showcase.map((img) => (
              <div key={img.id} className="rounded-xl overflow-hidden shadow-sm aspect-square">
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About -- only shows if an Admin has filled in the ABOUT section */}
      {about && (about.title || about.body) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          {about.imageUrl && (
            <img src={about.imageUrl} alt="" className="w-full max-h-72 object-cover rounded-2xl mb-8" />
          )}
          <h2 className="text-2xl font-display font-bold text-maroon-800 mb-3">{about.title || 'About Us'}</h2>
          <p className="text-gray-600 whitespace-pre-line">{about.body}</p>
        </section>
      )}

      {/* Community photo wall -- public submissions, shown only after moderator approval */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Camera size={20} className="text-maroon-600" />
              <h2 className="text-2xl font-display font-bold text-maroon-800">Community Photo Wall</h2>
            </div>
            <p className="text-gray-500 max-w-xl">
              Shared by members and neighbours alike. Anyone can contribute — photos appear here
              once a club moderator approves them.
            </p>
          </div>
          <button onClick={() => setUploadOpen(true)} className="btn-primary flex items-center gap-2 shrink-0">
            <Camera size={18} /> Share a Photo
          </button>
        </div>

        {communityPhotos.length === 0 ? (
          <div className="card text-center py-12">
            <Camera className="mx-auto text-brand-300 mb-3" size={36} />
            <p className="text-gray-500 mb-4">No photos yet — be the first to share one!</p>
            <button onClick={() => setUploadOpen(true)} className="btn-secondary">Upload a Photo</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {communityPhotos.map((p) => (
              <figure key={p.id} className="card p-0 overflow-hidden flex flex-col">
                <img src={p.imageUrl} alt={p.caption || 'Community photo'} className="w-full h-52 object-cover" />
                <figcaption className="p-4 flex-1 flex flex-col">
                  {p.caption && <p className="text-sm text-gray-700 mb-2">{p.caption}</p>}
                  <div className="mt-auto space-y-1">
                    <p className="text-xs text-maroon-700 flex items-center gap-1 font-medium">
                      <UserCircle2 size={12} /> {p.photographerName}
                    </p>
                    {p.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={12} /> {p.location}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-display font-bold text-maroon-800 text-center mb-2">Everything the club needs</h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Built for Members, Secretary, President, Admin, and Super Admin alike.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div className="w-10 h-10 rounded-lg bg-maroon-50 text-maroon-700 flex items-center justify-center mb-3">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming + past events, and notices */}
      {(upcoming.length > 0 || pastEventsWithPhotos.length > 0 || notices.length > 0) && (
        <section className="bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10">
            {upcoming.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl text-maroon-800 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {upcoming.map((ev) => (
                    <div key={ev.id} className="card flex gap-3">
                      {ev.imageUrl && (
                        <img src={ev.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{ev.title}</p>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-3 mt-1">
                          <span className="flex items-center gap-1"><Clock size={12} /> {ev.eventDate}</span>
                          {ev.location && <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {upcoming.length === 0 && pastEventsWithPhotos.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl text-maroon-800 mb-4">Recent Events</h3>
                <div className="space-y-3">
                  {pastEventsWithPhotos.slice(0, 4).map((ev) => (
                    <div key={ev.id} className="card flex gap-3">
                      <img src={ev.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{ev.title}</p>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-3 mt-1">
                          <span className="flex items-center gap-1"><Clock size={12} /> {ev.eventDate}</span>
                          {ev.location && <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notices.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl text-maroon-800 mb-4">Latest Notices</h3>
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.id} className="card">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-gray-800">{n.title}</p>
                        <span className="badge-gray shrink-0">{n.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-maroon-800 mb-3">Ready to join?</h2>
        <p className="text-gray-500 mb-6">
          Registration takes a minute. A club Admin will review and approve your account
          before you can sign in.
        </p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2">
          Register Now <ArrowRight size={18} />
        </Link>
      </section>

      <PhotoUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

      <PublicFooter />
    </div>
  );
}

function StatBubble({ label, value }) {
  return (
    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
      <p className="text-2xl font-display font-bold text-brand-200">{value}</p>
      <p className="text-xs text-brand-100 mt-1">{label}</p>
    </div>
  );
}
