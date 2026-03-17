import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Camera, Clock, Activity, FileText, Users, FolderOpen, MessageSquare, ChevronLeft, ChevronRight, X, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  role: 'admin' | 'owner' | null;
  isExpanded: boolean;
  isMobile?: boolean;
  isMobileOpen?: boolean;
  toggleSidebar: () => void;
  toggleAssistant: () => void;
}

type NavLinkItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  sublinks?: { path: string; label: string; icon: React.ElementType }[];
};

const ownerLinks: NavLinkItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cameras', label: 'Cameras', icon: Camera },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/updates', label: 'Daily Updates', icon: Activity },
  { path: '/invoices', label: 'Invoices', icon: FileText },
  { path: '/ipdc', label: 'IPDC', icon: CreditCard },
];

const adminLinks: NavLinkItem[] = [
  { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
  { 
    path: '/admin/projects', 
    label: 'Projects', 
    icon: FolderOpen,
    sublinks: [
      { path: '/admin/projects', label: 'Manage Projects', icon: FolderOpen },
      { path: '/admin/cameras', label: 'Cameras', icon: Camera },
      { path: '/admin/invoices', label: 'Invoices', icon: FileText },
      { path: '/admin/updates', label: 'Updates', icon: Activity },
    ]
  },
  { path: '/admin/owners', label: 'Owners', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({ role, isExpanded, isMobile, isMobileOpen, toggleSidebar, toggleAssistant }) => {
  const links = role === 'admin' ? adminLinks : ownerLinks;
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('/admin/projects'); // default open for admin projects or null

  const toggleSubmenu = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isExpanded && !isMobile) {
      toggleSidebar(); // Expand sidebar if trying to open a menu while collapsed
      setExpandedMenu(path);
    } else {
      setExpandedMenu(expandedMenu === path ? null : path);
    }
  };

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
          const hasSublinks = !!link.sublinks;
          const isSubmenuOpen = expandedMenu === link.path;
          
          // Check if any sublink is active
          const isChildActive = hasSublinks && link.sublinks!.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));

          return (
            <div key={link.path} className="sidebar-item-container">
              {hasSublinks ? (
                <div 
                  className={`sidebar-link flex items-center justify-between cursor-pointer ${isChildActive ? 'active-parent' : ''}`}
                  onClick={(e) => toggleSubmenu(link.path, e)}
                  title={!isExpanded && !isMobile ? link.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={isExpanded ? 20 : 24} className={`sidebar-link-icon ${isChildActive ? 'text-primary' : ''}`} />
                    {isExpanded && <span className="fade-in text-sm font-medium whitespace-nowrap">{link.label}</span>}
                  </div>
                  {isExpanded && (
                    <div className="text-gray-400">
                      {isSubmenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  end={link.path === '/' || link.path === '/admin'}
                  title={!isExpanded && !isMobile ? link.label : undefined}
                >
                  <Icon size={isExpanded ? 20 : 24} className="sidebar-link-icon" />
                  {isExpanded && <span className="fade-in text-sm font-medium whitespace-nowrap">{link.label}</span>}
                </NavLink>
              )}

              {/* Submenu Dropdown */}
              {hasSublinks && isSubmenuOpen && isExpanded && (
                <div className="sidebar-submenu pl-9 pr-2 py-1 space-y-1 fade-in">
                  {link.sublinks!.map(sub => {
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        className={({ isActive }) => `sidebar-sublink flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                        end={sub.path === '/admin/projects'} 
                      >
                        <SubIcon size={16} />
                        <span>{sub.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {/* Chat Bot Area */}
        <div className={`chatbot-area ${isExpanded ? 'p-4' : 'p-2 flex justify-center'} transition-all`}>
          <button 
            type="button"
            onClick={toggleAssistant}
            className={`chatbot-btn w-full gap-2 text-sm font-medium transition-colors ${isExpanded ? 'flex items-center px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg' : 'p-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100'}`} 
            title={!isExpanded && !isMobile ? "Ask ChatBot" : undefined}
          >
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
