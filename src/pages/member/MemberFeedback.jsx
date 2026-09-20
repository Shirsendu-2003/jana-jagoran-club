import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import { memberApi } from '../../api/endpoints';
import Loader from '../../components/Loader';

export default function MemberFeedback() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { type: 'SUGGESTION' } });
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const load = () => {
    memberApi.myFeedback().then((res) => setMine(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setMessage('');
    try {
      await memberApi.submitFeedback(data);
      setMessage('Thank you! Your feedback has been submitted.');
      reset({ type: 'SUGGESTION', message: '' });
      load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Feedback & Suggestions</h1>
      <p className="text-gray-500 mb-6">Help us improve the club — share a suggestion or report an issue.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="card max-w-xl mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select className="input-field mt-1" {...register('type')}>
              <option value="SUGGESTION">Suggestion</option>
              <option value="ISSUE">Report an Issue</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Message</label>
            <textarea rows="4" className="input-field mt-1" placeholder="Tell us more..." {...register('message', { required: true })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <h3 className="font-semibold text-gray-800 mb-3">Your Previous Feedback</h3>
      {loading ? <Loader /> : mine.length === 0 ? (
        <p className="text-sm text-gray-400">You haven't submitted any feedback yet.</p>
      ) : (
        <div className="space-y-3">
          {mine.map((f) => (
            <div key={f.id} className="card">
              <div className="flex justify-between items-start mb-1">
                <span className="badge-gray">{f.type}</span>
                <span className={f.status === 'RESOLVED' ? 'badge-green' : f.status === 'REVIEWED' ? 'badge-yellow' : 'badge-red'}>
                  {f.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{f.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(f.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
