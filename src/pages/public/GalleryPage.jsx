import React, { useEffect, useState } from 'react';
import { Camera, MapPin, UserCircle2, X } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import PhotoUploadModal from '../../components/PhotoUploadModal';
import { publicApi } from '../../api/endpoints';

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [community, setCommunity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    Promise.all([
      publicApi.allGallery().catch(() => ({ data: { data: [] } })),
      publicApi.approvedPhotos(60).catch(() => ({ data: { data: [] } })),
    ]).then(([g, c]) => {
      setGallery(g.data.data);
      setCommunity(c.data.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout
      title="Photo Gallery"
      subtitle="Moments from our pujas, events and everyday club life."
    >
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex justify-end mb-8">
          <button onClick={() => setUploadOpen(true)} className="btn-primary flex items-center gap-2">
            <Camera size={18} /> Share a Photo
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading photos...</p>
        ) : (
          <>
            {gallery.length > 0 && (
              <>
                <h2 className="text-xl font-display font-bold text-maroon-800 mb-5">Club Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
                  {gallery.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setLightbox({ url: img.imageUrl })}
                      className="rounded-xl overflow-hidden shadow-sm aspect-square group"
                    >
                      <img
                        src={img.imageUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-xl font-display font-bold text-maroon-800 mb-2">Community Photo Wall</h2>
            <p className="text-gray-500 text-sm mb-5">
              Shared by members and neighbours. Anyone can contribute — photos appear once a
              club moderator approves them.
            </p>

            {community.length === 0 ? (
              <div className="card text-center py-12">
                <Camera className="mx-auto text-brand-300 mb-3" size={36} />
                <p className="text-gray-500 mb-4">No community photos yet — be the first!</p>
                <button onClick={() => setUploadOpen(true)} className="btn-secondary">Upload a Photo</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {community.map((p) => (
                  <figure key={p.id} className="card p-0 overflow-hidden flex flex-col">
                    <button onClick={() => setLightbox({ url: p.imageUrl, caption: p.caption })}>
                      <img
                        src={p.imageUrl}
                        alt={p.caption || 'Community photo'}
                        className="w-full h-52 object-cover"
                      />
                    </button>
                    <figcaption className="p-4 flex-1 flex flex-col">
                      {p.caption && <p className="text-sm text-gray-700 mb-2">{p.caption}</p>}
                      <div className="mt-auto space-y-1">
                        <p className="text-xs text-maroon-700 flex items-center gap-1 font-medium">
                          <UserCircle2 size={12} /> {p.photographerName}
                        </p>
                        {p.location && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin size={12} /> {p.location}
                          </p>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <PhotoUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X size={28} />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl">
            <img src={lightbox.url} alt="" className="max-h-[80vh] w-auto rounded-lg" />
            {lightbox.caption && (
              <figcaption className="text-white text-sm text-center mt-3">{lightbox.caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </PublicLayout>
  );
}
