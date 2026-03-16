import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Plus, Download } from 'lucide-react';

export const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ title: '', amount: '', type: 'milestone', property_id: '', status: 'pending', date: new Date().toISOString().split('T')[0] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, projectsRes] = await Promise.all([
        supabase.from('invoices').select('*, property:properties(name)').order('date', { ascending: false }),
        supabase.from('properties').select('id, name')
      ]);

      if (invoicesRes.error) throw invoicesRes.error;
      if (projectsRes.error) throw projectsRes.error;

      setInvoices(invoicesRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('invoices')
        .insert([{
          title: newInvoice.title,
          amount: parseFloat(newInvoice.amount),
          type: newInvoice.type,
          property_id: newInvoice.property_id || null,
          status: newInvoice.status,
          date: newInvoice.date
        }]);

      if (error) throw error;
      
      setShowModal(false);
      setNewInvoice({ title: '', amount: '', type: 'milestone', property_id: '', status: 'pending', date: new Date().toISOString().split('T')[0] });
      fetchData(); // Refresh list
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      alert(`Failed to create invoice: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header mb-8 flex justify-between items-center">
        <div>
          <h1 className="dashboard-title text-2xl font-bold">Invoices Management</h1>
          <p className="dashboard-subtitle text-gray-400">Manage and upload invoices for projects.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Invoice
        </button>
      </div>

      <div className="card">
        <div className="card-header border-b border-gray-800 pb-4 mb-4">
          <h3 className="card-title flex items-center gap-2">
            <FileText size={20} className="text-secondary" />
            All Invoices
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No invoices found. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="pb-3 font-medium px-4">Invoice Title</th>
                  <th className="pb-3 font-medium px-4">Project</th>
                  <th className="pb-3 font-medium px-4">Amount</th>
                  <th className="pb-3 font-medium px-4">Type</th>
                  <th className="pb-3 font-medium px-4">Status</th>
                  <th className="pb-3 font-medium px-4">Date</th>
                  <th className="pb-3 font-medium px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-white">{invoice.title}</td>
                    <td className="py-4 px-4 text-gray-400">{invoice.property?.name || '-'}</td>
                    <td className="py-4 px-4 text-white font-semibold">${parseFloat(invoice.amount).toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-400 capitalize">{invoice.type}</td>
                    <td className="py-4 px-4">
                      {invoice.status === 'paid' ? (
                        <span className="badge badge-success text-xs">Paid</span>
                      ) : (
                        <span className="badge badge-warning text-xs">Pending</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                       <a href={invoice.download_url || '#'} target="_blank" rel="noreferrer" className="text-secondary hover:text-white transition-colors p-2 inline-flex" aria-label="Download Invoice">
                         <Download size={18} />
                       </a>
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
            <h2 className="text-xl font-bold mb-4">Create New Invoice</h2>
            <form onSubmit={handleCreateInvoice}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Invoice Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newInvoice.title}
                  onChange={e => setNewInvoice({...newInvoice, title: e.target.value})}
                  placeholder="e.g. Foundation Milestone"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newInvoice.amount}
                  onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                />
              </div>
              <div className="mb-4 gap-4 flex">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select 
                    className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                    value={newInvoice.type}
                    onChange={e => setNewInvoice({...newInvoice, type: e.target.value})}
                  >
                    <option value="milestone">Milestone</option>
                    <option value="material">Material</option>
                    <option value="service">Service</option>
                    <option value="tax">Tax/Fee</option>
                  </select>
                </div>
                 <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select 
                    className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                    value={newInvoice.status}
                    onChange={e => setNewInvoice({...newInvoice, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--primary)] transition-colors"
                  value={newInvoice.date}
                  onChange={e => setNewInvoice({...newInvoice, date: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-1">Assign to Project</label>
                <select 
                  className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.15)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#1F6F6B] transition-colors"
                  value={newInvoice.property_id}
                  onChange={e => setNewInvoice({...newInvoice, property_id: e.target.value})}
                  required
                >
                  <option value="">Select a project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
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
                  {isSubmitting ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
