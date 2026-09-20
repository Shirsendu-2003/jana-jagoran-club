import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/endpoints';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { register, handleSubmit } = useForm({ defaultValues: { token: searchParams.get('token') || '' } });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError('');
    try {
      await authApi.resetPassword(data);
      setMessage('Password reset successfully. You can now sign in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Reset failed. The link may have expired.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maroon-800 via-maroon-700 to-brand-600 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-display font-bold text-maroon-800 mb-6">Reset your password</h2>
        {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input className="input-field" placeholder="Reset token" {...register('token', { required: true })} />
          <input type="password" className="input-field" placeholder="New password" {...register('newPassword', { required: true, minLength: 6 })} />
          <button type="submit" className="btn-primary w-full">Reset Password</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-maroon-700 font-medium hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
