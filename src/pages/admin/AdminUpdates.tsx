import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Activity, Plus } from 'lucide-react';

export const AdminUpdates = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ 
    property_id: '', 
    title: '',
    type: 'construction',
    description: '',
    date: new Date().toISOString().split('T')[0],
    photoUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [updatesRes, projectsRes] = await Promise.all([
        supabase.from('updates').select('*, property:properties(name)').order('date', { ascending: false }),
        supabase.from('properties').select('*')
      ]);

      if (updatesRes.error) throw updatesRes.error;
      if (projectsRes.error) throw projectsRes.error;

      setUpdates(updatesRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (err) {
      console.error('Error fetching updates data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.property_id) {
      alert("Please select a project.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const photosArray = newUpdate.photoUrl ? [newUpdate.photoUrl] : [];
      
      const { error } = await supabase
        .from('updates')
        .insert([{
          property_id: newUpdate.property_id,
          title: newUpdate.title,
          type: newUpdate.type,
          description: newUpdate.description,
          date: newUpdate.date,
          status: 'in_progress',
          photos: photosArray
        }])
        .select();

      if (error) throw error;
      
      setShowModal(false);
      setNewUpdate({ property_id: '', title: '', type: 'construction', description: '', date: new Date().toISOString().split('T')[0], photoUrl: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating update:', err);
      alert('Failed to create update. Does the "construction" enum exist in the database?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header mb-8 flex justify-between items-center">
        <div>
          <h1 className="dashboard-title text-2xl font-bold">Project Updates</h1>
          <p className="dashboard-subtitle text-gray-400">Post new activities to a specific property timeline.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Post Update
        </button>
      </div>

      <div className="card">
        <div className="card-header border-b border-gray-800 pb-4 mb-4">
          <h3 className="card-title flex items-center gap-2">
            <Activity size={20} className="text-secondary" />
            Recent Updates
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading updates...</div>
        ) : updates.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No updates found. Post one to engage the owners!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="pb-3 font-medium px-4">Date</th>
                  <th className="pb-3 font-medium px-4">Project</th>
                  <th className="pb-3 font-medium px-4">Title</th>
                  <th className="pb-3 font-medium px-4">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {updates.map((update) => (
                  <tr key={update.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 text-gray-400 w-32">
                      {new Date(update.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      {update.property?.name || 'Unknown Project'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{update.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{update.description}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="badge badge-success text-xs capitalize">{update.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#18233B] rounded-xl border border-[rgba(255,255,255,0.08)] p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Post Project Update</h2>
            <form onSubmit={handleCreateUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Select Project</label>
                <select 
                  required
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newUpdate.property_id}
                  onChange={e => setNewUpdate({...newUpdate, property_id: e.target.value})}
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                    value={newUpdate.title}
                    onChange={e => setNewUpdate({...newUpdate, title: e.target.value})}
                    placeholder="e.g. Foundation Complete"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                    value={newUpdate.date}
                    onChange={e => setNewUpdate({...newUpdate, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Update Type</label>
                <select 
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newUpdate.type}
                  onChange={e => setNewUpdate({...newUpdate, type: e.target.value})}
                >
                  <option value="construction">Construction</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="incident">Incident</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors resize-none"
                  value={newUpdate.description}
                  onChange={e => setNewUpdate({...newUpdate, description: e.target.value})}
                  placeholder="Detail the work that has been completed..."
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-1">Photo URL (Optional)</label>
                <input 
                  type="url" 
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newUpdate.photoUrl}
                  onChange={e => setNewUpdate({...newUpdate, photoUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg or /latest_setup.jpg"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Posting...' : 'Publish Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
