import React from 'react';
import { Download, Upload, CheckCircle2, Clock, FileText } from 'lucide-react';
import './IPDC.css';

export const IPDC: React.FC = () => {
  // Mock data for upcoming installments
  const upcomingInstallments = [
    { id: 1, description: 'Foundation Stage Payment', amount: 45000, dueDate: '2026-04-15', status: 'pending' },
    { id: 2, description: 'Structural Framing Payment', amount: 55000, dueDate: '2026-06-01', status: 'upcoming' },
    { id: 3, description: 'Roofing & Exterior Payment', amount: 35000, dueDate: '2026-08-15', status: 'upcoming' },
  ];

  // Mock data for payment proofs
  const paymentProofs = [
    { id: 1, description: 'Initial Deposit (10%)', amount: 25000, date: '2026-01-10', status: 'verified', file: 'deposit_receipt_v1.pdf' },
    { id: 2, description: 'Land Acquisition Payment', amount: 150000, date: '2026-02-05', status: 'verified', file: 'land_payment_proof.pdf' },
    { id: 3, description: 'Permits & Admin Fees', amount: 12500, date: '2026-03-01', status: 'verified', file: 'permits_receipt.pdf' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="ipdc-page fade-in">
      <header className="dashboard-header mb-8">
        <h1 className="dashboard-title">Installment & Payment Control (IPDC)</h1>
        <p className="dashboard-subtitle">Track your upcoming installments and view verified payment proofs</p>
      </header>

      <div className="ipdc-grid">
        {/* Upcoming Installments */}
        <div className="card ipdc-section">
          <div className="section-header">
            <h2 className="card-title flex items-center gap-2">
              <Clock size={20} className="text-secondary" />
              Upcoming Installments
            </h2>
            <span className="badge badge-warning">Action Needed</span>
          </div>
          
          <div className="installments-list">
            {upcomingInstallments.map((item) => (
              <div key={item.id} className={`installment-item ${item.status === 'pending' ? 'highlight' : ''}`}>
                <div className="installment-info">
                  <h4>{item.description}</h4>
                  <p className="due-date">Due by: {formatDate(item.dueDate)}</p>
                </div>
                <div className="installment-amount-block">
                  <span className="installment-amount">{formatCurrency(item.amount)}</span>
                  {item.status === 'pending' ? (
                    <button className="btn btn-primary btn-sm mt-2 w-full">
                      <Upload size={14} /> Upload Proof
                    </button>
                  ) : (
                    <span className="status-label mt-2">Scheduled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Proofs */}
        <div className="card ipdc-section">
          <div className="section-header">
            <h2 className="card-title flex items-center gap-2">
              <CheckCircle2 size={20} className="text-success" />
              Verified Payment Proofs
            </h2>
          </div>
          
          <div className="proofs-list">
            {paymentProofs.map((item) => (
              <div key={item.id} className="proof-item">
                <div className="proof-icon">
                  <FileText className="text-primary" size={24} />
                </div>
                <div className="proof-info">
                  <h4>{item.description}</h4>
                  <p className="proof-meta">
                    {formatDate(item.date)} • {formatCurrency(item.amount)}
                  </p>
                </div>
                <div className="proof-actions">
                  <span className="badge badge-success mb-2">Verified</span>
                  <button className="btn btn-secondary btn-sm" aria-label="Download Receipt">
                    <Download size={14} /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Assuming FileText is imported but it's not in the original import above. Let me add it.
