import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

const roleHome = {
  MEMBER: '/member/dashboard',
  SECRETARY: '/secretary/dashboard',
  PRESIDENT: '/president/dashboard',
  ADMIN: '/admin/dashboard',
  SUPER_ADMIN: '/super-admin/dashboard',
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const user = await login(data.email, data.password);

      if (user.mustChangePassword) {
        navigate('/force-password-change');
      } else {
        navigate(roleHome[user.role] || '/member/dashboard');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-800 via-maroon-700 to-brand-600">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
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

              <span className="text-sm font-semibold text-maroon-800">
                Sign In
              </span>

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
                  to="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50"
                >
                  Events
                </Link>

                <Link
                  to="/gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50"
                >
                  Gallery
                </Link>

                <Link
                  to="/faqs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-maroon-50"
                >
                  FAQs
                </Link>

                <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">

                  <span className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-maroon-800 bg-maroon-50">
                    Sign In
                  </span>

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


      {/* ================= LOGIN CONTENT ================= */}
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          {/* Logo / Title */}
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
              Society Club Management System
            </p>

          </div>


          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">

            <h2 className="text-xl font-display font-bold text-maroon-800 mb-6">
              Sign in to your account
            </h2>


            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">
                {error}
              </div>
            )}


            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* Email */}
              <div>

                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  className="input-field mt-1"
                  placeholder="you@example.com"
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


              {/* Password */}
              <div>

                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  className="input-field mt-1"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                />

                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}

              </div>


              {/* Forgot Password */}
              <div className="flex justify-end">

                <Link
                  to="/forgot-password"
                  className="text-xs text-maroon-600 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

            </form>


            {/* Register */}
            <p className="text-center text-sm text-gray-500 mt-6">

              New member?{' '}

              <Link
                to="/register"
                className="text-maroon-700 font-medium hover:underline"
              >
                Create an account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}