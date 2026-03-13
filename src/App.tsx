import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import { Login } from './pages/Login';

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

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: ('admin' | 'owner')[] }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-100 bg-body">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // If user has a role but it's not allowed, redirect them to their respective default home
    if (role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  // Need to pass user/role context to Layout, Layout currently expects static user object.
  // We'll update the dummy Layout slightly later or adapt it here.
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function AppRoutes() {
  const { role, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="owners" element={<AdminProjects />} />
        <Route path="cameras" element={<AdminCameras />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Owner Routes */}
      <Route path="/" element={<ProtectedRoute allowedRoles={['owner']} />}>
        <Route index element={<OwnerDashboard />} />
        <Route path="cameras" element={<OwnerCameras />} />
        <Route path="timeline" element={<OwnerTimeline />} />
        <Route path="updates" element={<OwnerUpdates />} />
        <Route path="invoices" element={<OwnerInvoices />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
