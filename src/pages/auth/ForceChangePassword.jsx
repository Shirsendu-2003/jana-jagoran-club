import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/endpoints';

const roleHome = {
  MEMBER: '/member/dashboard',
  SECRETARY: '/secretary/dashboard',
  PRESIDENT: '/president/dashboard',
  ADMIN: '/admin/dashboard',
  SUPER_ADMIN: '/super-admin/dashboard',
};

export default function ForceChangePassword() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { user, loading: authLoading, clearMustChangePassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login', { replace: true });
  }, [authLoading, user, navigate]);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authApi.firstLoginPassword({ newPassword: data.newPassword });
      clearMustChangePassword();
      navigate(roleHome[user?.role] || '/member/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maroon-800 via-maroon-700 to-brand-600 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="w-12 h-12 rounded-full bg-maroon-50 text-maroon-700 flex items-center justify-center mb-4">
          <KeyRound size={22} />
        </div>
        <h2 className="text-xl font-display font-bold text-maroon-800 mb-2">Set a new password</h2>
        <p className="text-sm text-gray-500 mb-6">
          For your security, you need to set your own password before continuing.
          {user?.name && ` Welcome, ${user.name}!`}
        </p>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              className="input-field mt-1"
              {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
            />
            {errors.newPassword && <p className="text-xs text-red-600 mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              className="input-field mt-1"
              {...register('confirmPassword', { validate: (val) => val === watch('newPassword') || 'Passwords do not match' })}
            />
            {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving...' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
