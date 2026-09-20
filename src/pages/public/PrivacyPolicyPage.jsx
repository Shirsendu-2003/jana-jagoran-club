import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/PublicLayout';

/**
 * This describes what the application actually collects, based on the real schema
 * (members, payments, photo_submissions, audit_logs, newsletter_subscribers).
 * It is a plain-language starting point, NOT legal advice -- have someone qualified
 * review it before relying on it, especially regarding India's DPDP Act 2023.
 */
export default function PrivacyPolicyPage() {
  return (
    <PublicLayout title="Privacy Policy" subtitle="What we collect, why, and what you can ask us to do about it.">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="card space-y-8 text-sm text-gray-600 leading-relaxed">

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-xs">
            <strong>Note for club administrators:</strong> this is a plain-language template
            describing what this software actually stores. It has not been reviewed by a lawyer.
            Please have it checked against India's Digital Personal Data Protection Act, 2023
            before publishing it as your official policy.
          </div>

          <Section title="Who we are">
            Jana Jagoran Club, Gokarna, Kandi, Murshidabad, West Bengal. For any question about
            your data, contact us at{' '}
            <a href="mailto:info@janajagoranclub.org" className="text-maroon-700 hover:underline">
              info@janajagoranclub.org
            </a>.
          </Section>

          <Section title="What we collect">
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>If you register as a member:</strong> your name, email address, phone number, postal address, profile photo (if you upload one), and your membership ID.</li>
              <li><strong>Subscription records:</strong> which months you have paid, the amount, the payment method, and who recorded the payment.</li>
              <li><strong>If you submit a photo:</strong> the image itself, the photographer name you give us, any caption and location you enter, an optional contact email, and the IP address the upload came from.</li>
              <li><strong>If you subscribe to the newsletter:</strong> your email address and the IP address used to subscribe.</li>
              <li><strong>Activity records:</strong> logins, password changes, profile edits, approvals and role changes are written to an audit log along with the time, the IP address, and the browser user-agent.</li>
            </ul>
          </Section>

          <Section title="Why we collect it">
            To run the club: to manage membership and subscriptions, to organise events, to publish
            notices, to display the photo gallery, and to keep an accurate, accountable record of
            administrative decisions (who approved what, and when).
          </Section>

          <Section title="Why we keep an audit log">
            Club funds and committee positions are involved, so decisions need to be traceable.
            Audit records are kept permanently and are not deleted, even when a member leaves.
            Only Admins and Super Admins can view them.
          </Section>

          <Section title="Who can see your information">
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Your profile and payment history are visible to you, and to club Admins, the Secretary and the President.</li>
              <li>Approved photos are public, shown with the photographer name, caption and location you provided. Your contact email and IP address are never shown publicly.</li>
              <li>We do not sell your data and we do not share it with advertisers.</li>
            </ul>
          </Section>

          <Section title="Photos">
            Photos you submit are reviewed by a club moderator before appearing publicly. If you
            want a photo of you removed, email us and we will take it down.
          </Section>

          <Section title="Newsletter">
            You can unsubscribe at any time using the link in any newsletter email, or by emailing
            us. Unsubscribing stops the emails; we keep the record that you were once subscribed.
          </Section>

          <Section title="Your rights">
            You can ask us to show you what we hold about you, correct anything inaccurate, or
            delete your personal information. Note that we cannot delete audit and financial
            records, as the club needs them for accountability — but we can remove your profile
            details, photos and newsletter subscription. Email us to make a request.
          </Section>

          <Section title="Security">
            Passwords are stored hashed, never in plain text. Access to member data is restricted
            by role. That said, no system is perfectly secure — please use a strong, unique password.
          </Section>

          <Section title="Changes to this policy">
            If we change this policy we will update this page. Significant changes will also be
            posted as a club notice.
          </Section>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
            See also our <Link to="/code-of-conduct" className="text-maroon-700 hover:underline">Code of Conduct</Link>.
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-display font-bold text-maroon-800 text-lg mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
