import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/endpoints';

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authApi.forgotPassword(data);
      setMessage('If an account exists with this email, password reset instructions have been sent.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maroon-800 via-maroon-700 to-brand-600 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-display font-bold text-maroon-800 mb-2">Forgot your password?</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you reset instructions.</p>

        {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="email" className="input-field" placeholder="you@example.com" {...register('email', { required: true })} />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-maroon-700 font-medium hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
