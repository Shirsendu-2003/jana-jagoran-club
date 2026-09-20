import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { homepageApi } from '../../api/endpoints';

const SECTIONS = [
  { key: 'HERO', label: 'Hero Banner', hint: 'The main headline and subtitle at the top of the landing page.' },
  { key: 'ABOUT', label: 'About the Club', hint: 'A short paragraph introducing the club to visitors.' },
  { key: 'ANNOUNCEMENT', label: 'Announcement Banner', hint: 'Optional -- shows a highlighted message if filled in.' },
];

export default function AdminHomepage() {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  const forms = {
    HERO: useForm(),
    ABOUT: useForm(),
    ANNOUNCEMENT: useForm(),
  };

  const load = () => {
    setLoading(true);
    homepageApi.allSections().then((res) => {
      const map = {};
      res.data.data.forEach((s) => { map[s.sectionKey] = s; });
      setSections(map);
      SECTIONS.forEach(({ key }) => {
        const s = map[key];
        forms[key].reset({ title: s?.title || '', body: s?.body || '', imageUrl: s?.imageUrl || '' });
      });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSave = async (key, data) => {
    setSaving(key);
    try {
      await homepageApi.upsertSection({ sectionKey: key, ...data });
      setMessage(`${key} section saved.`);
      setTimeout(() => setMessage(''), 3000);
      load();
    } finally {
      setSaving('');
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Homepage Editor</h1>
      <p className="text-gray-500 mb-6">Edit the content blocks shown on the public landing page.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      <div className="space-y-6">
        {SECTIONS.map(({ key, label, hint }) => (
          <div key={key} className="card">
            <h3 className="font-semibold text-gray-800 mb-1">{label}</h3>
            <p className="text-xs text-gray-500 mb-4">{hint}</p>
            <form onSubmit={forms[key].handleSubmit((data) => onSave(key, data))} className="space-y-3">
              <input className="input-field" placeholder="Title" {...forms[key].register('title')} />
              <textarea className="input-field" rows="3" placeholder="Body text" {...forms[key].register('body')} />
              <input className="input-field" placeholder="Image URL (optional)" {...forms[key].register('imageUrl')} />
              <button type="submit" disabled={saving === key} className="btn-primary">
                {saving === key ? 'Saving...' : 'Save Section'}
              </button>
            </form>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
