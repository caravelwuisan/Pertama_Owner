import { mockProject, mockUpdates, mockInvoices } from '../../store/mockData';
import { Activity, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import './OwnerDashboard.css';

export const OwnerDashboard = () => {
  const latestUpdate = mockUpdates[0];
  const pendingInvoice = mockInvoices.find(i => i.status === 'Pending');

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, John!</h1>
        <p className="dashboard-subtitle">Here is the latest progress on your property.</p>
      </div>

      <div className="dashboard-grid">
        {/* Progress Card */}
        <div className="card progress-card">
          <div className="card-header flex justify-between items-center">
            <h3 className="card-title">Construction Progress</h3>
            <span className="badge badge-success">On Schedule</span>
          </div>
          <div className="progress-info">
            <div className="progress-value">{mockProject.completionPercentage}%</div>
            <p className="progress-text">Completed</p>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${mockProject.completionPercentage}%` }}
            ></div>
          </div>
          <div className="next-milestone">
            <Clock size={16} className="text-gold" />
            <span>Next: <strong>{mockProject.nextMilestone}</strong></span>
          </div>
        </div>

        {/* Latest Update Card */}
        <div className="card update-card">
          <div className="card-header flex justify-between items-center">
            <h3 className="card-title">Latest Setup</h3>
            <Activity size={18} className="text-secondary" />
          </div>
          <div className="latest-update-content">
            <p className="update-date">{new Date(latestUpdate.date).toLocaleDateString()}</p>
            <p className="update-text">{latestUpdate.text}</p>
            {latestUpdate.photos.length > 0 && (
              <div className="update-photo-preview">
                <img src={latestUpdate.photos[0]} alt="Latest construction" />
              </div>
            )}
          </div>
          <a href="/updates" className="view-more-link">View Activity Feed &rarr;</a>
        </div>

        {/* Financial Overview Card */}
        <div className="card finance-card">
          <div className="card-header flex justify-between items-center">
            <h3 className="card-title">Financial Status</h3>
            <FileText size={18} className="text-secondary" />
          </div>
          <div className="finance-content">
            {pendingInvoice ? (
              <div className="pending-alert">
                <AlertCircle size={24} className="text-warning" />
                <div>
                  <h4>Action Required</h4>
                  <p>You have a pending invoice for {pendingInvoice.month}.</p>
                  <p className="amount-due">${pendingInvoice.amount.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="all-paid">
                <CheckCircle2 size={32} className="text-success" />
                <p>All invoices are paid. No action required.</p>
              </div>
            )}
          </div>
          <a href="/invoices" className="view-more-link">View All Invoices &rarr;</a>
        </div>
      </div>
    </div>
  );
};
