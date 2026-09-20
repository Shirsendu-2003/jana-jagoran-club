import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';

const EXPECTED = [
  'Treat every member, guest and neighbour with respect, regardless of background or belief.',
  'Take part honestly — pay your subscription on time and keep to commitments you make.',
  'Respect club property, funds and shared spaces as if they were your own.',
  'Raise concerns through the committee rather than through rumour or confrontation.',
  'Only share photos you took yourself, or have clear permission to share.',
  'Ask before photographing someone closely, especially children.',
];

const NOT_TOLERATED = [
  'Harassment, intimidation, or abusive language toward any member or guest.',
  'Discrimination on the basis of religion, caste, gender, or background.',
  'Misuse of club funds, or spending outside an approved budget.',
  'Uploading photos that are obscene, misleading, or of people who have objected.',
  'Using club platforms for political campaigning or commercial advertising.',
  'Sharing another member\u2019s personal details outside the club without consent.',
];

export default function CodeOfConductPage() {
  return (
    <PublicLayout
      title="Code of Conduct"
      subtitle="How we treat each other at Jana Jagoran Club."
    >
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-8">

        <div className="card text-sm text-gray-600 leading-relaxed">
          <p>
            Jana Jagoran Club exists to bring our community together. That only works if everyone
            feels safe and welcome here. This code applies to club events, meetings, our premises,
            and everything posted through this website — including photos shared on the public wall.
          </p>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-maroon-800 text-lg mb-4">What we expect</h2>
          <ul className="space-y-3">
            {EXPECTED.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-gray-600">
                <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-maroon-800 text-lg mb-4">What is not tolerated</h2>
          <ul className="space-y-3">
            {NOT_TOLERATED.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-gray-600">
                <X size={18} className="text-red-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-maroon-800 text-lg mb-3">Photo submissions</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every photo submitted through this website is reviewed by a club moderator before it
            appears publicly. Moderators may reject anything that breaches this code, and may
            remove a photo later if someone raises a valid objection. If a photo of you is on this
            site and you would like it taken down, email us and we will remove it.
          </p>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-maroon-800 text-lg mb-3">Raising a concern</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            If something here has been breached, speak to any committee member, or email{' '}
            <a href="mailto:info@janajagoranclub.org" className="text-maroon-700 hover:underline">
              info@janajagoranclub.org
            </a>. Members can also raise it privately through the Feedback section after signing in.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Concerns are reviewed by the committee. Depending on what is found, outcomes can range
            from a conversation, to a formal warning, to suspension of membership. Any change to a
            member's status is recorded with a written reason.
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center">
          See also our <Link to="/privacy-policy" className="text-maroon-700 hover:underline">Privacy Policy</Link>.
        </p>
      </section>
    </PublicLayout>
  );
}
