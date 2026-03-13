import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Clock, Activity, FileText, Users, FolderOpen } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  role: 'admin' | 'owner' | null;
}

const ownerLinks = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cameras', label: 'Cameras', icon: Camera },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/updates', label: 'Daily Updates', icon: Activity },
  { path: '/invoices', label: 'Invoices', icon: FileText },
];

const adminLinks = [
  { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
  { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { path: '/admin/owners', label: 'Owners', icon: Users },
  { path: '/admin/cameras', label: 'Cameras', icon: Camera },
  { path: '/admin/invoices', label: 'Invoices', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const links = role === 'admin' ? adminLinks : ownerLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">P</div>
        <div className="logo-text">
          <span className="logo-title">Pertama</span>
          <span className="logo-subtitle">{role === 'admin' ? 'Admin' : 'Owner'}</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              end={link.path === '/' || link.path === '/admin'}
            >
              <Icon size={18} className="sidebar-link-icon" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-tagline">
          {role === 'owner' ? 'Your villa. Your project. Real-time transparency.' : 'Property Management System'}
        </p>
      </div>
    </aside>
  );
};
