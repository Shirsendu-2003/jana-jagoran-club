import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { memberApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { Upload, Trash2 } from 'lucide-react';

export default function MemberGallery() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const loadAlbums = () => {
    memberApi.albums().then((res) => {
      setAlbums(res.data.data);
      if (res.data.data.length) selectAlbum(res.data.data[0].id);
    }).finally(() => setLoading(false));
  };

  const selectAlbum = (id) => {
    setSelected(id);
    memberApi.albumImages(id).then((res) => setImages(res.data.data));
  };

  useEffect(() => { loadAlbums(); }, []);

  const onUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selected) return;
    setUploading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await memberApi.uploadPhoto(selected, formData);
      setMessage('Photo uploaded! It will appear once approved by an Admin.');
      selectAlbum(selected);
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (imageId) => {
    if (!confirm('Delete this photo?')) return;
    await memberApi.deletePhoto(imageId);
    selectAlbum(selected);
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Photo Gallery</h1>
      <p className="text-gray-500 mb-6">Browse event albums and share your photos.</p>

      {message && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{message}</div>}

      {albums.length === 0 ? (
        <p className="text-sm text-gray-400">No albums created yet.</p>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap mb-6">
            {albums.map((a) => (
              <button
                key={a.id}
                onClick={() => selectAlbum(a.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  selected === a.id ? 'bg-maroon-600 text-white border-maroon-600' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {a.title}
              </button>
            ))}
          </div>

          <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer mb-6">
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
          </label>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative rounded-xl overflow-hidden group card p-0">
                <img src={img.imageUrl} alt="" className="w-full h-40 object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={img.status === 'APPROVED' ? 'badge-green' : img.status === 'REJECTED' ? 'badge-red' : 'badge-yellow'}>
                    {img.status}
                  </span>
                </div>
                {img.uploadedBy?.id === user?.userId && img.status === 'PENDING' && (
                  <button
                    onClick={() => onDelete(img.id)}
                    className="absolute bottom-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            {images.length === 0 && <p className="text-sm text-gray-400 col-span-full">No photos in this album yet.</p>}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
