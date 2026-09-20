import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Send,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { publicApi } from "../api/endpoints";

/**
 * Shared public header
 */
export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="Jana Jagoran Club Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <span className="font-display font-bold text-maroon-800 text-lg">
              Jana Jagoran Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition-colors"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition-colors"
            >
              About Us
            </Link>

            <Link
              to="/register"
              className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition-colors"
            >
              Membership
            </Link>

            <Link
              to="/faqs"
              className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition-colors"
            >
              FAQs
            </Link>

            <Link
              to="/login"
              className="text-sm font-medium text-maroon-700 hover:text-maroon-900 transition-colors"
            >
              Sign In
            </Link>

            <Link to="/register" className="btn-primary text-sm">
              Join the Club
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-maroon-800 hover:bg-maroon-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 mt-3 pt-3 pb-2">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800 transition-colors"
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800 transition-colors"
              >
                About Us
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800 transition-colors"
              >
                Membership
              </Link>

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800 transition-colors"
              >
                Events
              </Link>

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800 transition-colors"
              >
                Gallery
              </Link>

              <Link
                to="/faqs"
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800 transition-colors"
              >
                FAQs
              </Link>

              <div className="border-t border-gray-100 my-2" />

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-maroon-700 hover:bg-maroon-50 transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="btn-primary text-sm text-center mt-1"
              >
                Join the Club
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Shared public footer
 */
export function PublicFooter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState({
    type: "",
    message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  const subscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubmitting(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      const res = await publicApi.subscribeNewsletter(email.trim());

      setStatus({
        type: "success",
        message: res.data.message,
      });

      setEmail("");
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Subscription failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-maroon-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ================= CLUB INFORMATION ================= */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Jana Jagoran Club Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="font-display font-bold text-lg">
                  Jana Jagoran Club
                </h3>

                <p className="text-xs text-brand-200">Estd. 2016</p>
              </div>
            </div>

            <p className="text-sm text-brand-100 leading-relaxed mb-5">
              A community-driven club dedicated to bringing people together
              through cultural activities, social events, celebrations and
              community development.
            </p>

            <div className="space-y-3 text-sm text-brand-100">
              {/* Address */}
              {/* Address + Google Maps */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="text-brand-300 mt-0.5 flex-shrink-0"
                />

                <div>
                  <p>
                    Jana Jagoran Club
                    <br />
                    Gokarna, Kandi
                    <br />
                    Murshidabad, West Bengal
                  </p>

                  <a
                    href="https://maps.app.goo.gl/HTgXurJpq6sn72Sf8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-sm text-brand-300 hover:text-brand-200 transition-colors"
                  >
                    View on Google Maps
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-brand-300 flex-shrink-0" />

                <a
                  href="mailto:janajagoranclub@gmail.com"
                  className="hover:text-brand-300 transition-colors"
                >
                  janajagoranclub@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone size={17} className="text-brand-300 flex-shrink-0" />

                <a
                  href="tel:+91XXXXXXXXXX"
                  className="hover:text-brand-300 transition-colors"
                >
                  +91 XXXXXXXXXX
                </a>
              </div>

              {/* Meeting */}
              <div className="flex items-start gap-3">
                <Clock
                  size={17}
                  className="text-brand-300 mt-0.5 flex-shrink-0"
                />

                <span>
                  Club Meeting: Every Sunday
                  <br />
                  6:00 PM – 8:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h3 className="font-display font-bold text-lg mb-5">Quick Links</h3>

            <ul className="space-y-3 text-sm text-brand-100">
              <li>
                <Link to="/" className="hover:text-brand-300 transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-brand-300 transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="hover:text-brand-300 transition-colors"
                >
                  Membership
                </Link>
              </li>

              <li>
                <Link to="/" className="hover:text-brand-300 transition-colors">
                  Events Calendar
                </Link>
              </li>

              <li>
                <Link to="/" className="hover:text-brand-300 transition-colors">
                  Photo Gallery
                </Link>
              </li>

              <li>
                <Link
                  to="/faqs"
                  className="hover:text-brand-300 transition-colors"
                >
                  FAQs
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="hover:text-brand-300 transition-colors"
                >
                  Member / Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= SOCIAL MEDIA ================= */}
          <div>
            <h3 className="font-display font-bold text-lg mb-5">
              Connect With Us
            </h3>

            <p className="text-sm text-brand-100 mb-5 leading-relaxed">
              Follow Jana Jagoran Club for announcements, events, puja
              celebrations and community updates.
            </p>

            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1HjRRPeFrk/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jana Jagoran Club on Facebook"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-400 hover:text-maroon-900 flex items-center justify-center transition-colors"
              >
                <Facebook size={19} />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jana Jagoran Club on Instagram"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-400 hover:text-maroon-900 flex items-center justify-center transition-colors"
              >
                <Instagram size={19} />
              </a>

              {/* X */}
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jana Jagoran Club on X"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-400 hover:text-maroon-900 flex items-center justify-center transition-colors"
              >
                <Twitter size={19} />
              </a>
            </div>

            <div className="mt-6">
              <p className="text-xs text-brand-200 mb-2">
                Follow us for the latest updates
              </p>

              <a
                href="https://www.facebook.com/share/1HjRRPeFrk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200"
              >
                Visit our Facebook page
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* ================= NEWSLETTER ================= */}
          <div>
            <h3 className="font-display font-bold text-lg mb-5">
              Stay Updated
            </h3>

            <p className="text-sm text-brand-100 leading-relaxed mb-5">
              Subscribe to receive club announcements, upcoming events and
              important community updates.
            </p>

            {/* Status */}
            {status.message && (
              <div
                className={`text-xs rounded-lg px-3 py-2 mb-3 ${
                  status.type === "success"
                    ? "bg-green-500/20 text-green-100"
                    : "bg-red-500/20 text-red-100"
                }`}
              >
                {status.message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={subscribe} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-400"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-400 hover:bg-brand-300 text-maroon-900 font-semibold px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                <Send size={16} />

                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            <p className="text-[11px] text-brand-300 mt-3">
              We respect your privacy. You can unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-maroon-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-brand-200 text-center md:text-left">
              © {new Date().getFullYear()} Jana Jagoran Club. All rights
              reserved.
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-brand-300 font-medium">
  v0.1
</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-brand-200">
              <Link
                to="/privacy-policy"
                className="hover:text-brand-300 transition-colors"
              >
                Privacy Policy
              </Link>

              <span className="text-maroon-600">|</span>

              <Link
                to="/code-of-conduct"
                className="hover:text-brand-300 transition-colors"
              >
                Code of Conduct
              </Link>

              <span className="text-maroon-600">|</span>

              <Link
                to="/faqs"
                className="hover:text-brand-300 transition-colors"
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Wrapper for simple public content pages
 */
export default function PublicLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#fdf7f2] flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {title && (
          <div className="bg-gradient-to-br from-maroon-800 via-maroon-700 to-brand-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                {title}
              </h1>

              {subtitle && <p className="text-brand-100">{subtitle}</p>}
            </div>
          </div>
        )}

        {children}
      </main>

      <PublicFooter />
    </div>
  );
}
