import { mockProject, mockUsers, mockInvoices, mockUpdates } from '../../store/mockData';
import { Users, FolderOpen, FileText, Activity } from 'lucide-react';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const totalOwners = mockUsers.filter(u => u.role === 'owner').length;
  const pendingInvoices = mockInvoices.filter(i => i.status === 'Pending').length;
  
  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="page-header mb-8">
        <h1 className="page-title">Admin Overview</h1>
        <p className="page-subtitle">Manage projects, owners, and system content.</p>
      </div>

      <div className="stats-grid mb-8">
        <div className="card stat-card">
          <div className="stat-icon-wrapper bg-blue-500">
            <FolderOpen size={24} className="text-white" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Projects</p>
            <p className="stat-value">1</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper bg-green-500">
            <Users size={24} className="text-white" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Owners</p>
            <p className="stat-value">{totalOwners}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper bg-orange-500">
            <FileText size={24} className="text-white" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Invoices</p>
            <p className="stat-value">{pendingInvoices}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper bg-purple-500">
            <Activity size={24} className="text-white" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Recent Updates</p>
            <p className="stat-value">{mockUpdates.length}</p>
          </div>
        </div>
      </div>

      <div className="admin-panels-grid">
        <div className="card">
          <div className="card-header flex justify-between items-center mb-6">
            <h3 className="card-title">Recent Activity</h3>
            <button className="btn btn-secondary btn-sm">Add New</button>
          </div>
          <div className="activity-list">
            {mockUpdates.slice(0, 3).map(update => (
              <div key={update.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="font-medium text-primary text-sm mb-1">{update.text}</p>
                  <p className="text-xs text-secondary">{new Date(update.date).toLocaleString()} • by {update.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex justify-between items-center mb-6">
            <h3 className="card-title">Projects Status</h3>
          </div>
          <div className="projects-list">
            <div className="project-list-item">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-primary">{mockProject.name}</span>
                <span className="text-gold font-medium">{mockProject.completionPercentage}%</span>
              </div>
              <div className="progress-bar-container-small">
                <div className="progress-bar-fill" style={{ width: `${mockProject.completionPercentage}%` }}></div>
              </div>
              <p className="text-xs text-secondary mt-2">Owner: John Smith</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
