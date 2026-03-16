import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FolderOpen, Plus } from 'lucide-react';

export const AdminProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', location: '', owner_id: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, ownersRes] = await Promise.all([
        supabase.from('properties').select('*, owner:profiles(*)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'owner')
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (ownersRes.error) throw ownersRes.error;

      setProjects(projectsRes.data || []);
      setOwners(ownersRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { error, data } = await supabase
        .from('properties')
        .insert([{
          name: newProject.name,
          location: newProject.location,
          owner_id: newProject.owner_id || null
        }])
        .select();

      if (error) {
        console.error('Supabase raw error:', error);
        throw error;
      }
      
      console.log('Project created successfully:', data);
      setShowModal(false);
      setNewProject({ name: '', location: '', owner_id: '' });
      fetchData(); // Refresh list
    } catch (err: any) {
      console.error('Error creating project:', err);
      alert(`Failed to create project: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header mb-8 flex justify-between items-center">
        <div>
          <h1 className="dashboard-title text-2xl font-bold">Projects Management</h1>
          <p className="dashboard-subtitle text-gray-400">Create properties and assign them to owners.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="card">
        <div className="card-header border-b border-gray-800 pb-4 mb-4">
          <h3 className="card-title flex items-center gap-2">
            <FolderOpen size={20} className="text-secondary" />
            Active Properties
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No projects found. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="pb-3 font-medium px-4">Project Name</th>
                  <th className="pb-3 font-medium px-4">Location</th>
                  <th className="pb-3 font-medium px-4">Owner</th>
                  <th className="pb-3 font-medium px-4">Date Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-white">{project.name}</td>
                    <td className="py-4 px-4 text-gray-400">{project.location || '-'}</td>
                    <td className="py-4 px-4">
                      {project.owner ? (
                        <div className="text-sm">
                          <span className="text-white">{project.owner.full_name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">
                      {new Date(project.created_at).toLocaleDateString()}
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
          <div className="bg-[#18233B] rounded-xl border border-[rgba(255,255,255,0.08)] p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newProject.location}
                  onChange={e => setNewProject({...newProject, location: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-1">Assign to Owner</label>
                <select 
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newProject.owner_id}
                  onChange={e => setNewProject({...newProject, owner_id: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {owners.map(o => (
                    <option key={o.id} value={o.id}>{o.full_name || o.id}</option>
                  ))}
                </select>
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
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
