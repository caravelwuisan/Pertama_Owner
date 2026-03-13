import { mockTimeline } from '../../store/mockData';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import './Timeline.css';

export const Timeline = () => {
  return (
    <div className="timeline-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Construction Timeline</h1>
        <p className="page-subtitle">Track the major milestones of your development.</p>
      </div>

      <div className="timeline-container">
        {mockTimeline.map((item, index) => {
          const isLast = index === mockTimeline.length - 1;
          const isCompleted = item.status === 'completed';
          const isInProgress = item.status === 'in-progress';

          return (
            <div key={item.id} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isInProgress ? 'in-progress' : ''}`}>
              <div className="timeline-indicator">
                <div className="indicator-icon">
                  {isCompleted ? <CheckCircle2 size={24} /> : isInProgress ? <Clock size={24} /> : <Circle size={24} />}
                </div>
                {!isLast && <div className="timeline-line"></div>}
              </div>
              <div className="timeline-content card">
                <div className="timeline-header flex justify-between items-center">
                  <h3 className="timeline-title">{item.title}</h3>
                  <span className="timeline-date">{new Date(item.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
                <p className="timeline-desc">{item.description}</p>
                {isInProgress && (
                  <div className="timeline-progress mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-secondary">Progress</span>
                      <span className="text-gold font-medium">{item.completionPercentage}%</span>
                    </div>
                    <div className="progress-bar-container-small">
                      <div className="progress-bar-fill" style={{ width: `${item.completionPercentage}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
