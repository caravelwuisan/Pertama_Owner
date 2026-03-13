import { useState } from 'react';
import { mockCameras } from '../../store/mockData';
import { Maximize2, Video } from 'lucide-react';
import './Cameras.css';

export const Cameras = () => {
  const [fullscreenCamera, setFullscreenCamera] = useState<string | null>(null);

  if (fullscreenCamera) {
    const cam = mockCameras.find(c => c.id === fullscreenCamera);
    return (
      <div className="fullscreen-view animate-fade-in">
        <div className="fullscreen-header flex justify-between items-center mb-4">
          <h2>{cam?.name}</h2>
          <button className="btn btn-secondary" onClick={() => setFullscreenCamera(null)}>Exit Fullscreen</button>
        </div>
        <div className="fullscreen-video-container">
          <img src={cam?.streamUrl} alt={cam?.name} className="live-feed-full" />
          <div className="live-indicator"><span className="dot"></span> LIVE</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cameras-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Live Construction Cameras</h1>
        <p className="page-subtitle">Monitor your villa's progress in real-time.</p>
      </div>

      <div className="cameras-grid">
        {mockCameras.map(cam => (
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
                  <img src={cam.streamUrl} alt={cam.name} className="camera-feed-img" />
                  <button 
                    className="fullscreen-btn" 
                    onClick={() => setFullscreenCamera(cam.id)}
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
        ))}
      </div>
    </div>
  );
};
