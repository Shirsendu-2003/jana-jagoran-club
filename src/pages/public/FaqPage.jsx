import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { publicApi } from '../../api/endpoints';

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    publicApi.faqs().then((res) => setFaqs(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf7f2]">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/" className="text-sm text-maroon-700 hover:underline inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-display font-bold text-maroon-800 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500 mb-8">Answers to common questions about Jana Jagoran Club.</p>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : faqs.length === 0 ? (
          <p className="text-sm text-gray-400">No FAQs published yet.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="card cursor-pointer" onClick={() => setOpenId(openId === f.id ? null : f.id)}>
                <div className="flex justify-between items-center gap-3">
                  <p className="font-medium text-gray-800">{f.question}</p>
                  <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform ${openId === f.id ? 'rotate-180' : ''}`} />
                </div>
                {openId === f.id && <p className="text-sm text-gray-600 mt-3">{f.answer}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
