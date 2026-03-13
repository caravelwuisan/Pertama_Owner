import { mockInvoices } from '../../store/mockData';
import { Download, FileText } from 'lucide-react';
import './Invoices.css';

export const Invoices = () => {
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
                <th>Invoice Month</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>
                    <div className="invoice-date">
                      <span className="font-medium text-primary">{invoice.month} {invoice.year}</span>
                      <span className="text-xs text-secondary">{new Date(invoice.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-secondary">{invoice.description}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-primary">${invoice.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    {invoice.status === 'Paid' ? (
                      <span className="badge badge-success">Paid</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td className="text-right">
                    <button className="btn btn-secondary btn-sm" aria-label="Download Invoice">
                      <Download size={16} />
                      <span className="sr-only">Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {mockInvoices.length === 0 && (
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
