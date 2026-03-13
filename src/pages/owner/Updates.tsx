import { mockUpdates } from '../../store/mockData';
import './Updates.css';

export const Updates = () => {
  return (
    <div className="updates-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Daily Activity Feed</h1>
        <p className="page-subtitle">Stay connected with the daily progress on site.</p>
      </div>

      <div className="feed-container">
        {mockUpdates.map(update => (
          <div key={update.id} className="card update-feed-card">
            <div className="update-header">
              <div className="update-meta">
                <span className="update-author">{update.author}</span>
                <span className="update-dot">•</span>
                <span className="update-time">
                  {new Date(update.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="update-body">
              <p className="update-content">{update.text}</p>
              
              {update.photos && update.photos.length > 0 && (
                <div className="update-gallery">
                  {update.photos.map((photo, i) => (
                    <div key={i} className="gallery-item">
                      <img src={photo} alt="Construction progress" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
