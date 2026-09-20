import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Menu, X } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const res = await registerUser(data);
      setResult(res);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Registration success screen
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-800 via-maroon-700 to-brand-600">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
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
                  className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition"
                >
                  About Us
                </Link>

                <Link
                  to="/register"
                  className="text-sm font-medium text-maroon-800"
                >
                  Membership
                </Link>

               

                <Link
                  to="/faqs"
                  className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition"
                >
                  FAQs
                </Link>

                <Link
                  to="/login"
                  className="text-sm font-medium text-maroon-700 hover:text-maroon-900 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Join the Club
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className="md:hidden p-2 text-maroon-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={26} />
                ) : (
                  <Menu size={26} />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-100 mt-3 pt-3 pb-2">
                <nav className="flex flex-col gap-1">

                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800"
                  >
                    Home
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800"
                  >
                    About Us
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-maroon-800 bg-maroon-50"
                  >
                    Membership
                  </Link>

                 

                  <Link
                    to="/faqs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800"
                  >
                    FAQs
                  </Link>

                  <div className="border-t border-gray-100 my-2" />

                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-maroon-700"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-sm text-center mt-1"
                  >
                    Join the Club
                  </Link>

                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Success Content */}
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">

            <CheckCircle2
              className="mx-auto text-green-500 mb-4"
              size={48}
            />

            <h2 className="text-xl font-display font-bold text-maroon-800 mb-2">
              Registration received!
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              {result.message}
            </p>

            {result.membershipId && (
              <p className="text-xs text-gray-400 mb-6">
                Your membership ID:{' '}
                <span className="font-medium text-maroon-700">
                  {result.membershipId}
                </span>
              </p>
            )}

            <Link
              to="/login"
              className="btn-primary inline-block"
            >
              Back to Sign In
            </Link>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-800 via-maroon-700 to-brand-600">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
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
                className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition"
              >
                About Us
              </Link>

              <Link
                to="/register"
                className="text-sm font-medium text-maroon-800"
              >
                Membership
              </Link>

              

              <Link
                to="/faqs"
                className="text-sm font-medium text-gray-700 hover:text-maroon-800 transition"
              >
                FAQs
              </Link>

              <Link
                to="/login"
                className="text-sm font-medium text-maroon-700 hover:text-maroon-900 transition"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="btn-primary text-sm"
              >
                Join the Club
              </Link>

            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 text-maroon-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={26} />
              ) : (
                <Menu size={26} />
              )}
            </button>

          </div>

          {/* ================= MOBILE NAV ================= */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 mt-3 pt-3 pb-2">

              <nav className="flex flex-col gap-1">

                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800"
                >
                  About Us
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-maroon-800 bg-maroon-50"
                >
                  Membership
                </Link>

               

                <Link
                  to="/faqs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50 hover:text-maroon-800"
                >
                  FAQs
                </Link>

                <div className="border-t border-gray-100 my-2" />

                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-maroon-700"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-sm text-center mt-1"
                >
                  Join the Club
                </Link>

              </nav>

            </div>
          )}

        </div>
      </header>

      {/* ================= REGISTER CONTENT ================= */}
      <main className="px-4 py-10">

        <div className="w-full max-w-md mx-auto">

          {/* Club Logo */}
          <div className="text-center mb-6 text-white">

            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-white flex items-center justify-center mb-3 shadow-lg">
              <img
                src="/logo.png"
                alt="Jana Jagoran Club Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-display font-bold">
              Jana Jagoran Club
            </h1>

            <p className="text-brand-100 text-sm mt-1">
              Join the club as a Member
            </p>

          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">

            <h2 className="text-xl font-display font-bold text-maroon-800 mb-2">
              Create your account
            </h2>

            <p className="text-xs text-gray-500 mb-6">
              New member accounts are reviewed by a club Admin before you can sign in.
            </p>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  className="input-field mt-1"
                  {...register('name', {
                    required: 'Name is required'
                  })}
                />

                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  className="input-field mt-1"
                  {...register('email', {
                    required: 'Email is required'
                  })}
                />

                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  className="input-field mt-1"
                  {...register('phone')}
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>

                <input
                  className="input-field mt-1"
                  {...register('address')}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  className="input-field mt-1"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'At least 6 characters'
                    }
                  })}
                />

                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  className="input-field mt-1"
                  {...register('confirmPassword', {
                    validate: (val) =>
                      val === watch('password') ||
                      'Passwords do not match',
                  })}
                />

                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Submitting...' : 'Register'}
              </button>

            </form>

            {/* Login */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already a member?{' '}
              <Link
                to="/login"
                className="text-maroon-700 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}