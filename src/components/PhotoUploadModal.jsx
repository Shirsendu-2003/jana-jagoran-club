import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, FileUp, X, CheckCircle2, Upload } from 'lucide-react';
import { publicApi } from '../api/endpoints';

/**
 * Public photo submission. Three capture paths, which differ only by the input attributes:
 *   - Camera:  capture="environment" -> opens the rear camera directly on mobile
 *   - Gallery: accept="image/*"      -> opens the photo library
 *   - Files:   no accept filter beyond images, opens the file browser
 * On desktop, all three fall back to the normal file picker, which is expected behaviour.
 */
export default function PhotoUploadModal({ open, onClose }) {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ photographerName: '', caption: '', location: '', contactEmail: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!open) return null;

  const onPick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;

    if (picked.size > 8 * 1024 * 1024) {
      setError('That image is larger than 8 MB. Please choose a smaller one.');
      return;
    }
    setError('');
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setForm({ photographerName: '', caption: '', location: '', contactEmail: '' });
    setError('');
    setDone(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please choose a photo first.'); return; }
    if (!form.photographerName.trim()) { setError('Please tell us who took the photo.'); return; }

    setSubmitting(true);
    setError('');
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('photographerName', form.photographerName);
      if (form.caption) data.append('caption', form.caption);
      if (form.location) data.append('location', form.location);
      if (form.contactEmail) data.append('contactEmail', form.contactEmail);

      await publicApi.submitPhoto(data);
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-display font-bold text-maroon-800">Share a Photo</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
            <h4 className="font-semibold text-gray-800 mb-2">Thank you!</h4>
            <p className="text-sm text-gray-600 mb-6">
              Your photo has been submitted. It will appear on the home page once a club
              moderator approves it.
            </p>
            <div className="flex gap-2">
              <button onClick={reset} className="btn-secondary flex-1">Submit Another</button>
              <button onClick={close} className="btn-primary flex-1">Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}

            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => { URL.revokeObjectURL(preview); setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-white/90 text-gray-700 p-1.5 rounded-full hover:bg-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <PickerButton icon={Camera} label="Camera" onClick={() => cameraRef.current?.click()} />
                <PickerButton icon={ImageIcon} label="Gallery" onClick={() => galleryRef.current?.click()} />
                <PickerButton icon={FileUp} label="Files" onClick={() => fileRef.current?.click()} />
              </div>
            )}

            {/* capture="environment" makes mobile browsers open the rear camera straight away */}
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick} />
            <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="hidden" onChange={onPick} />

            <div>
              <label className="text-sm font-medium text-gray-700">Photographer name <span className="text-red-500">*</span></label>
              <input
                className="input-field mt-1"
                placeholder="Who took this photo?"
                value={form.photographerName}
                onChange={(e) => setForm({ ...form, photographerName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Caption</label>
              <textarea
                className="input-field mt-1"
                rows="2"
                placeholder="What's happening in this photo?"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                className="input-field mt-1"
                placeholder="e.g. Club Grounds, Jangipur"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Your email (optional)</label>
              <input
                type="email"
                className="input-field mt-1"
                placeholder="So we can reach you if needed"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>

            <p className="text-xs text-gray-400">
              JPG, PNG, WEBP or HEIC, up to 8 MB. Your photo won't appear publicly until a club
              moderator reviews it.
            </p>

            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              <Upload size={16} /> {submitting ? 'Uploading...' : 'Submit Photo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function PickerButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 py-5 rounded-xl border-2 border-dashed border-brand-200 text-maroon-700 hover:border-maroon-400 hover:bg-brand-50 transition-colors"
    >
      <Icon size={22} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
