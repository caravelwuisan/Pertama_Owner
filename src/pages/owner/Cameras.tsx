import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Maximize2, Video } from 'lucide-react';
import './Cameras.css';

export const Cameras = () => {
  const [cameras, setCameras] = useState<any[]>([]);
  const [fullscreenCamera, setFullscreenCamera] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        // Step 1: get owner's property
        const { data: propData } = await supabase.from('properties').select('*').limit(1).maybeSingle();
        if (propData) {
          // Step 2: get cameras for property
          const { data: camData } = await supabase.from('cameras').select('*').eq('property_id', propData.id);
          
          if (camData && camData.length > 0) {
            setCameras(camData);
          } else {
            // Generate fictitious cameras for the UI demo based on the property
            const mockCameras = [
              {
                id: 'mock-cam-1',
                property_id: propData.id,
                name: `${propData.name || 'Site'} - Overview (Live)`,
                status: 'online',
                streamUrl: 'https://images.unsplash.com/photo-1541888081682-1ddccb1bf4bc?auto=format&fit=crop&q=80',
                created_at: new Date().toISOString()
              },
              {
                id: 'mock-cam-2',
                property_id: propData.id,
                name: `${propData.name || 'Site'} - Interior Sector A`,
                status: 'online',
                streamUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80',
                created_at: new Date().toISOString()
              }
            ];
            setCameras(mockCameras);
          }
        }
      } catch (err) {
        console.error('Error fetching cameras:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400 fade-in">Loading cameras...</div>;
  }

  if (fullscreenCamera) {
    return (
      <div className="fullscreen-view animate-fade-in">
        <div className="fullscreen-header flex justify-between items-center mb-4">
          <h2>{fullscreenCamera.name}</h2>
          <button className="btn btn-secondary" onClick={() => setFullscreenCamera(null)}>Exit Fullscreen</button>
        </div>
        <div className="fullscreen-video-container">
           {/* Fallback to original src if streamUrl is missing/empty, just for demo purposes (like mock data) */}
          <img src={fullscreenCamera.streamUrl || "https://images.unsplash.com/photo-1541888081682-1ddccb1bf4bc?auto=format&fit=crop&q=80"} alt={fullscreenCamera.name} className="live-feed-full" />
          <div className="live-indicator"><span className="dot"></span> LIVE</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cameras-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Live Construction Cameras</h1>
        <p className="page-subtitle">Monitor your property's progress in real-time.</p>
      </div>

      <div className="cameras-grid">
        {cameras.length === 0 ? (
          <div className="text-gray-400 py-8 col-span-2 text-center">No cameras installed yet.</div>
        ) : (
          cameras.map(cam => (
            <div key={cam.id} className="card camera-card">
              <div className="camera-header flex justify-between items-center">
                <h3 className="camera-title flex items-center gap-2">
                  <Video size={18} className="text-gold" />
                  {cam.name}
                </h3>
                {cam.status === 'online' ? (
                  <span className="badge badge-success">Online</span>
                ) : (
                  <span className="badge badge-neutral">Offline</span>
                )}
              </div>
              <div className="camera-feed-container">
                {cam.status === 'online' ? (
                  <>
                    <img src={cam.streamUrl || "https://images.unsplash.com/photo-1541888081682-1ddccb1bf4bc?auto=format&fit=crop&q=80"} alt={cam.name} className="camera-feed-img" />
                    <button 
                      className="fullscreen-btn" 
                      onClick={() => setFullscreenCamera(cam)}
                      aria-label="View Fullscreen"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </>
                ) : (
                  <div className="camera-offline">
                    <Video size={32} className="text-tertiary" />
                    <p>Camera is currently offline</p>
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
