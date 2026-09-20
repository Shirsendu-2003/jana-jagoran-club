import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { faqApi } from '../../api/endpoints';
import { Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminFaqs() {
  const { register, handleSubmit, reset } = useForm();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    faqApi.allFaqs().then((res) => setFaqs(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMessage(m); setTimeout(() => setMessage(''), 3000); };

  const onCreate = async (data) => {
    await faqApi.createFaq({ ...data, displayOrder: Number(data.displayOrder || 0) });
    showMsg('FAQ added.');
    reset();
    load();
  };

  const toggleActive = async (id, active) => {
    await faqApi.toggleActive(id, !active);
    load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    await faqApi.deleteFaq(id);
    load();
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">FAQ Management</h1>
      <p className="text-gray-500 mb-6">Manage frequently asked questions shown to members and visitors.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4">Add FAQ</h3>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-3">
            <input className="input-field" placeholder="Question" {...register('question', { required: true })} />
            <textarea className="input-field" rows="3" placeholder="Answer" {...register('answer', { required: true })} />
            <input className="input-field" placeholder="Category (optional)" {...register('category')} />
            <input className="input-field" type="number" placeholder="Display order" {...register('displayOrder')} />
            <button className="btn-primary w-full">Add FAQ</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {loading ? <Loader /> : faqs.length === 0 ? (
            <p className="text-sm text-gray-400">No FAQs added yet.</p>
          ) : faqs.map((f) => (
            <div key={f.id} className="card">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium text-gray-800">{f.question}</p>
                  <p className="text-sm text-gray-500 mt-1">{f.answer}</p>
                  {f.category && <span className="badge-gray mt-2 inline-block">{f.category}</span>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleActive(f.id, f.isActive)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200" title={f.isActive ? 'Hide' : 'Show'}>
                    {f.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => onDelete(f.id)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
