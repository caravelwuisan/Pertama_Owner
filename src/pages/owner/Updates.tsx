import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import './Updates.css';

export const Updates = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('updates')
          .select('*, property:properties(name)')
          .order('date', { ascending: false });

        if (error) throw error;
        setUpdates(data || []);
      } catch (err) {
        console.error('Error fetching updates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400 fade-in">Loading updates...</div>;
  }

  return (
    <div className="updates-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Activity Feed</h1>
        <p className="page-subtitle">Stay connected with the progress on site.</p>
      </div>

      <div className="feed-container">
        {updates.length === 0 ? (
          <div className="text-gray-400 py-8">No recent updates available.</div>
        ) : (
          updates.map(update => (
            <div key={update.id} className="card update-feed-card">
              <div className="update-header">
                <div className="update-meta">
                  <span className="update-author text-secondary uppercase text-xs font-bold tracking-wider">{update.type}</span>
                  <span className="update-dot">•</span>
                  <span className="update-time">
                    {new Date(update.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <div className="update-body mt-4">
                <h3 className="text-lg font-bold text-white mb-2">{update.title}</h3>
                <p className="update-content text-gray-300">{update.description}</p>
                
                {update.photos && update.photos.length > 0 && (
                  <div className="update-gallery mt-4">
                    {update.photos.map((photo: string, i: number) => (
                      <div key={i} className="gallery-item rounded-lg overflow-hidden border border-gray-800">
                        <img src={photo} alt="Construction progress" className="w-full h-auto object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
