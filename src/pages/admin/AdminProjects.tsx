import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FolderOpen, Plus } from 'lucide-react';

export const AdminProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', location: '', owner_ids: [] as string[] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, ownersRes] = await Promise.all([
        supabase.from('properties').select('*, property_owners(profiles(*))').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'owner')
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (ownersRes.error) throw ownersRes.error;

      const mappedProjects = projectsRes.data?.map((p: any) => ({
        ...p,
        owners: p.property_owners?.map((po: any) => po.profiles) || []
      })) || [];

      setProjects(mappedProjects || []);
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
      
      // 1. Insert Property
      const { error: propError, data: propData } = await supabase
        .from('properties')
        .insert([{
          name: newProject.name,
          location: newProject.location
        }])
        .select();

      if (propError) {
        console.error('Supabase raw error (property):', propError);
        throw propError;
      }
      
      const newPropertyId = propData[0].id;

      // 2. Insert property_owners links if any owners were selected
      if (newProject.owner_ids.length > 0) {
        const ownerLinks = newProject.owner_ids.map(id => ({
          property_id: newPropertyId,
          profile_id: id
        }));

        const { error: ownersError } = await supabase
          .from('property_owners')
          .insert(ownerLinks);

        if (ownersError) {
           console.error('Supabase raw error (property_owners):', ownersError);
           throw ownersError;
        }
      }
      
      console.log('Project created successfully with multiple owners.');
      setShowModal(false);
      setNewProject({ name: '', location: '', owner_ids: [] });
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
                      {project.owners && project.owners.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {project.owners.map((o: any) => (
                            <span key={o.id} className="badge badge-neutral text-xs">{o.full_name}</span>
                          ))}
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
          <div className="bg-[#18233B] rounded-xl border border-[rgba(255,255,255,0.08)] p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                      value={newProject.name}
                      onChange={e => setNewProject({...newProject, name: e.target.value})}
                      placeholder="e.g. Villa Azure"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                      value={newProject.location}
                      onChange={e => setNewProject({...newProject, location: e.target.value})}
                      placeholder="e.g. Canggu, Bali"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Assign Owners</label>
                  <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {owners.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No owners available. Please add owners first.</p>
                    ) : (
                      owners.map(o => (
                        <label key={o.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary bg-[#18233B]"
                            checked={newProject.owner_ids.includes(o.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProject({ ...newProject, owner_ids: [...newProject.owner_ids, o.id] });
                              } else {
                                setNewProject({ ...newProject, owner_ids: newProject.owner_ids.filter(id => id !== o.id) });
                              }
                            }}
                          />
                          <span className="text-sm text-white">{o.full_name || o.id}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-800">
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
