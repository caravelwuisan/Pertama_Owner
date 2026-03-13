import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { mockUsers, mockProject } from './store/mockData';

// Owner Pages
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { Cameras as OwnerCameras } from './pages/owner/Cameras';
import { Timeline as OwnerTimeline } from './pages/owner/Timeline';
import { Updates as OwnerUpdates } from './pages/owner/Updates';
import { Invoices as OwnerInvoices } from './pages/owner/Invoices';

// Placeholder Pages (Admin)
import { AdminDashboard } from './pages/admin/AdminDashboard';
const AdminProjects = () => <div className="p-8 text-center text-secondary">Projects & Owners Management - Coming Soon</div>;
const AdminCameras = () => <div className="p-8 text-center text-secondary">Camera Management - Coming Soon</div>;
const AdminInvoices = () => <div className="p-8 text-center text-secondary">Invoice Management - Coming Soon</div>;

function App() {
  const [currentUserRoleId, setCurrentUserRoleId] = useState<'u1' | 'u2'>('u1');
  const user = mockUsers.find(u => u.id === currentUserRoleId) || mockUsers[0];
  
  const toggleRole = () => {
    setCurrentUserRoleId(prev => prev === 'u1' ? 'u2' : 'u1');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} project={mockProject} onToggleRole={toggleRole} />}>
          {user.role === 'owner' ? (
            <>
              <Route index element={<OwnerDashboard />} />
              <Route path="cameras" element={<OwnerCameras />} />
              <Route path="timeline" element={<OwnerTimeline />} />
              <Route path="updates" element={<OwnerUpdates />} />
              <Route path="invoices" element={<OwnerInvoices />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route index element={<AdminDashboard />} />
              <Route path="admin/projects" element={<AdminProjects />} />
              <Route path="admin/owners" element={<AdminProjects />} />
              <Route path="admin/cameras" element={<AdminCameras />} />
              <Route path="admin/invoices" element={<AdminInvoices />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
