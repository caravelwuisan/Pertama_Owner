import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Download, FileText } from 'lucide-react';
import './Invoices.css';

export const Invoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const { data: propData } = await supabase.from('properties').select('id').limit(1).maybeSingle();
        if (propData) {
          const { data: invData } = await supabase.from('invoices').select('*').eq('property_id', propData.id).order('date', { ascending: false });
          setInvoices(invData || []);
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400 fade-in">Loading invoices...</div>;
  }

  return (
    <div className="invoices-page animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">Manage your property payments and documents.</p>
        </div>
      </div>

      <div className="invoices-list-container card">
        <h3 className="invoices-list-title">Recent Invoices</h3>
        
        <div className="invoices-table-wrapper">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>
                    <div className="invoice-date">
                      <span className="font-medium text-primary">{invoice.title}</span>
                      <span className="text-xs text-secondary">{new Date(invoice.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-secondary capitalize">{invoice.type}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-primary">${invoice.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    {invoice.status === 'paid' ? (
                      <span className="badge badge-success">Paid</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td className="text-right">
                    <a href={invoice.download_url || '#'} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" aria-label="Download Invoice">
                      <Download size={16} />
                      <span className="sr-only">Download</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {invoices.length === 0 && (
            <div className="empty-state">
              <FileText size={48} className="text-tertiary mb-4" />
              <p>No invoices available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
