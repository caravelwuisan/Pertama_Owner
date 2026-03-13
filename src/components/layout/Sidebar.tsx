import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Clock, Activity, FileText, Users, FolderOpen, MessageSquare, ChevronLeft, ChevronRight, X, CreditCard } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  role: 'admin' | 'owner' | null;
  isExpanded: boolean;
  isMobile?: boolean;
  isMobileOpen?: boolean;
  toggleSidebar: () => void;
}

const ownerLinks = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cameras', label: 'Cameras', icon: Camera },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/updates', label: 'Daily Updates', icon: Activity },
  { path: '/invoices', label: 'Invoices', icon: FileText },
  { path: '/ipdc', label: 'IPDC', icon: CreditCard },
];

const adminLinks = [
  { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
  { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { path: '/admin/owners', label: 'Owners', icon: Users },
  { path: '/admin/cameras', label: 'Cameras', icon: Camera },
  { path: '/admin/invoices', label: 'Invoices', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({ role, isExpanded, isMobile, isMobileOpen, toggleSidebar }) => {
  const links = role === 'admin' ? adminLinks : ownerLinks;

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isMobile ? 'mobile-mode' : ''} ${isMobileOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo flex items-center gap-3">
          <img src="/logo.jpg" alt="Pertama Property" className="logo-image" />
          {isExpanded && (
            <div className="logo-text fade-in">
              <span className="logo-title">Pertama</span>
              <span className="logo-subtitle">{role === 'admin' ? 'Admin' : 'Owner'}</span>
            </div>
          )}
        </div>
        
        {isMobile ? (
          <button className="sidebar-toggle hover:bg-gray-100 rounded p-1" onClick={toggleSidebar} aria-label="Close Sidebar">
             <X size={20} className="text-gray-500" />
          </button>
        ) : (
          <button className="sidebar-toggle hover:bg-gray-100 rounded p-1" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            {isExpanded ? <ChevronLeft size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
          </button>
        )}
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
              title={!isExpanded && !isMobile ? link.label : undefined}
            >
              <Icon size={isExpanded ? 20 : 24} className="sidebar-link-icon" />
              {isExpanded && <span className="fade-in text-sm font-medium">{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {/* Chat Bot Area */}
        <div className={`chatbot-area ${isExpanded ? 'p-4' : 'p-2 flex justify-center'} transition-all`}>
          <button className={`chatbot-btn w-full gap-2 text-sm font-medium transition-colors ${isExpanded ? 'flex items-center px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg' : 'p-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100'}`} title={!isExpanded && !isMobile ? "Ask ChatBot" : undefined}>
            <MessageSquare size={isExpanded ? 18 : 22} className="text-gray-600" />
            {isExpanded && <span className="fade-in">Ask Assistant</span>}
          </button>
        </div>

        {isExpanded && (
           <p className="sidebar-tagline text-xs text-gray-400 mt-4 px-4 text-center pb-4 fade-in">
             {role === 'owner' ? 'Your villa. Your project. Real-time transparency.' : 'Property Management System'}
           </p>
        )}
      </div>
    </aside>
  );
};
