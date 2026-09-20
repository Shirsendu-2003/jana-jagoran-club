import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { profileApi, authApi } from '../../api/endpoints';
import { Camera, Bell, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [pwMode, setPwMode] = useState('current'); // 'current' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const pwForm = useForm();
  const otpForm = useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await profileApi.getMe();
      setProfile(res.data.data);
      reset({ name: res.data.data.name, phone: res.data.data.phone, email: res.data.data.email, address: res.data.data.address });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    setMessage('');
    try {
      await profileApi.updateMe(data);
      setMessage('Profile updated successfully.');
      load();
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const onPictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await profileApi.uploadPicture(formData);
    load();
  };

  const onChangePassword = async (data) => {
    setMessage('');
    try {
      await authApi.changePassword(data);
      setMessage('Password changed successfully.');
      pwForm.reset();
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to change password.');
    }
  };

  const requestOtp = async () => {
    setMessage('');
    try {
      const res = await authApi.requestPasswordOtp();
      setOtpSent(true);
      setMessage(res.data.data.message);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const confirmOtp = async (data) => {
    setMessage('');
    try {
      await authApi.confirmPasswordOtp(data);
      setMessage('Password changed successfully via OTP.');
      otpForm.reset();
      setOtpSent(false);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to verify OTP.');
    }
  };

  if (loading || !profile) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">My Profile</h1>
      <p className="text-gray-500 mb-6">View and update your account details.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-maroon-100 text-maroon-700 flex items-center justify-center text-3xl font-semibold overflow-hidden">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} className="w-full h-full object-cover" alt="avatar" />
              ) : profile.name?.[0]?.toUpperCase()}
            </div>
            <label className="absolute bottom-0 right-0 bg-maroon-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-maroon-700">
              <Camera size={14} />
              <input type="file" accept="image/*" className="hidden" onChange={onPictureChange} />
            </label>
          </div>
          <h3 className="mt-4 font-semibold text-gray-800">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.role}</p>
          {profile.membershipId && (
            <span className="badge-yellow mt-2">{profile.membershipId}</span>
          )}
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Account Details</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input className="input-field mt-1" {...register('name')} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="input-field mt-1" {...register('email')} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone / Mobile</label>
                <input className="input-field mt-1" {...register('phone')} />
              </div>
              {profile.membershipId && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <input className="input-field mt-1" {...register('address')} />
                </div>
              )}
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <div className="card mt-6 max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Change Password</h3>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPwMode('current')}
              className={`px-3 py-1 rounded text-xs font-medium ${pwMode === 'current' ? 'bg-white shadow-sm text-maroon-700' : 'text-gray-500'}`}
            >
              <ShieldCheck size={12} className="inline mr-1" /> Current Password
            </button>
            <button
              onClick={() => setPwMode('otp')}
              className={`px-3 py-1 rounded text-xs font-medium ${pwMode === 'otp' ? 'bg-white shadow-sm text-maroon-700' : 'text-gray-500'}`}
            >
              <Bell size={12} className="inline mr-1" /> OTP Verification
            </button>
          </div>
        </div>

        {pwMode === 'current' && (
          <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="space-y-4">
            <input
              type="password"
              placeholder="Current password"
              className="input-field"
              {...pwForm.register('currentPassword', { required: true })}
            />
            <input
              type="password"
              placeholder="New password"
              className="input-field"
              {...pwForm.register('newPassword', { required: true, minLength: 6 })}
            />
            <button type="submit" className="btn-secondary">Update Password</button>
          </form>
        )}

        {pwMode === 'otp' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              We'll send a one-time code to your Notifications (bell icon). No SMS/email gateway is
              wired in yet, so check the app's notification panel for the code.
            </p>
            {!otpSent ? (
              <button onClick={requestOtp} className="btn-secondary">Send OTP</button>
            ) : (
              <form onSubmit={otpForm.handleSubmit(confirmOtp)} className="space-y-4">
                <input
                  placeholder="6-digit OTP"
                  className="input-field"
                  maxLength={6}
                  {...otpForm.register('otpCode', { required: true })}
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="input-field"
                  {...otpForm.register('newPassword', { required: true, minLength: 6 })}
                />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">Confirm & Update</button>
                  <button type="button" onClick={requestOtp} className="btn-secondary text-sm">Resend OTP</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
