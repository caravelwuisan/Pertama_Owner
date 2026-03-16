import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, FolderOpen, FileText, Activity } from 'lucide-react';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ owners: 0, projects: 0, invoices: 0, updates: 0 });
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Stats
        const [ownersRes, projectsRes, invoicesRes, updatesRes] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'owner'),
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('updates').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          owners: ownersRes.count || 0,
          projects: projectsRes.count || 0,
          invoices: invoicesRes.count || 0,
          updates: updatesRes.count || 0
        });

        // Recent Activity
        const { data: recentUpds } = await supabase.from('updates').select('*').order('date', { ascending: false }).limit(3);
        setRecentUpdates(recentUpds || []);

        // Recent Projects
        const { data: recentProps } = await supabase.from('properties').select('*, owner:profiles(full_name)').order('created_at', { ascending: false }).limit(3);
        setRecentProjects(recentProps || []);

      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400 fade-in">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="page-header mb-8">
        <h1 className="page-title">Admin Overview</h1>
        <p className="page-subtitle">Manage projects, owners, and system content.</p>
      </div>

      <div className="stats-grid mb-8">
        <div className="card stat-card border border-blue-500/30">
          <div className="stat-icon-wrapper bg-blue-500/20">
            <FolderOpen size={24} className="text-blue-400" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Projects</p>
            <p className="stat-value">{stats.projects}</p>
          </div>
        </div>

        <div className="card stat-card border border-green-500/30">
          <div className="stat-icon-wrapper bg-green-500/20">
            <Users size={24} className="text-green-400" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Owners</p>
            <p className="stat-value">{stats.owners}</p>
          </div>
        </div>

        <div className="card stat-card border border-orange-500/30">
          <div className="stat-icon-wrapper bg-orange-500/20">
            <FileText size={24} className="text-orange-400" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Invoices</p>
            <p className="stat-value">{stats.invoices}</p>
          </div>
        </div>

        <div className="card stat-card border border-purple-500/30">
          <div className="stat-icon-wrapper bg-purple-500/20">
            <Activity size={24} className="text-purple-400" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Updates</p>
            <p className="stat-value">{stats.updates}</p>
          </div>
        </div>
      </div>

      <div className="admin-panels-grid">
        <div className="card">
          <div className="card-header flex justify-between items-center mb-6">
            <h3 className="card-title text-white">Recent Activity</h3>
            <Link to="/admin/updates" className="btn btn-secondary btn-sm">Manage</Link>
          </div>
          <div className="activity-list">
            {recentUpdates.length === 0 ? <p className="text-gray-400 text-sm">No recent activity.</p> : recentUpdates.map(update => (
              <div key={update.id} className="activity-item py-3 border-b border-gray-800 last:border-0 relative pl-4">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="activity-content">
                  <p className="font-medium text-white text-sm mb-1">{update.title}</p>
                  <p className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString()} • {update.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex justify-between items-center mb-6">
            <h3 className="card-title text-white">Recent Projects</h3>
            <Link to="/admin/projects" className="btn btn-secondary btn-sm">Manage</Link>
          </div>
          <div className="projects-list">
            {recentProjects.length === 0 ? <p className="text-gray-400 text-sm">No properties available.</p> : recentProjects.map(project => (
              <div key={project.id} className="project-list-item py-3 border-b border-gray-800 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">{project.name}</span>
                </div>
                <div className="progress-bar-container-small bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  {/* Hardcoded progress for now */}
                  <div className="progress-bar-fill bg-gold h-full" style={{ width: `65%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Owner: {project.owner?.full_name || 'Unassigned'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
