import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Activity, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './OwnerDashboard.css';

export const OwnerDashboard = () => {
  const { profile } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [latestUpdate, setLatestUpdate] = useState<any>(null);
  const [pendingInvoice, setPendingInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch the first property for this owner (RLS handles security)
        const { data: propData, error: propError } = await supabase
          .from('properties')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (propError) throw propError;
        setProject(propData);

        if (propData) {
          // Fetch latest update snippet
          const { data: updateData } = await supabase
            .from('updates')
            .select('*')
            .eq('property_id', propData.id)
            .order('date', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          setLatestUpdate(updateData);

          // Fetch pending invoice snippet
          const { data: invoiceData } = await supabase
            .from('invoices')
            .select('*')
            .eq('property_id', propData.id)
            .eq('status', 'pending')
            .limit(1)
            .maybeSingle();
            
          setPendingInvoice(invoiceData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400 fade-in">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {profile?.full_name?.split(' ')[0] || 'Owner'}!</h1>
        <p className="dashboard-subtitle">
          {project ? `Here is the latest progress on ${project.name}.` : "No properties assigned to your account yet."}
        </p>
      </div>

      {project && (
        <div className="dashboard-grid">
          {/* Progress Card */}
          <div className="card progress-card">
            <div className="card-header flex justify-between items-center">
              <h3 className="card-title">Construction Progress</h3>
              <span className="badge badge-success">On Schedule</span>
            </div>
            <div className="progress-info">
              <div className="progress-value">65%</div>  {/* We can make this dynamic later */}
              <p className="progress-text">Completed</p>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `65%` }}
              ></div>
            </div>
            <div className="next-milestone">
              <Clock size={16} className="text-secondary" />
              <span>Next: <strong>Structure Finishing</strong></span>
            </div>
          </div>

          {/* Latest Update Card */}
          <div className="card update-card">
            <div className="card-header flex justify-between items-center">
              <h3 className="card-title">Latest Setup</h3>
              <Activity size={18} className="text-secondary" />
            </div>
            <div className="latest-update-content">
              {latestUpdate ? (
                <>
                  <p className="update-date">{new Date(latestUpdate.date).toLocaleDateString()}</p>
                  <p className="update-text">{latestUpdate.description}</p>
                  {latestUpdate.photos && latestUpdate.photos.length > 0 && (
                    <div className="update-photo-preview">
                      <img src={latestUpdate.photos[0]} alt="Latest construction" />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400 py-4">No recent updates available for this property.</p>
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
                    <p>You have a pending invoice for {pendingInvoice.title}.</p>
                    <p className="amount-due">${pendingInvoice.amount.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="all-paid flex flex-col items-center text-center gap-3">
                  <CheckCircle2 size={32} className="text-success" />
                  <p className="text-gray-300">All invoices are paid. No action required.</p>
                </div>
              )}
            </div>
            <a href="/ipdc" className="view-more-link">View IPDC &rarr;</a>
          </div>
        </div>
      )}
    </div>
  );
};

