import React from 'react';
import { Bell, Search, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  profile: any;
  toggleSidebar: () => void;
  isMobile?: boolean; // Prop derived from parent or context but passed here for simplicity
}

export const Header: React.FC<HeaderProps> = ({ profile, toggleSidebar }) => {
  const { signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar} 
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="header-breadcrumbs">
          {profile?.role === 'owner' ? (
            <div>
              <h2 className="header-project-name">Pertama Property Developement</h2>
              <p className="header-project-location">Owner Dashboard</p>
            </div>
          ) : (
            <div>
              <h2 className="header-project-name">Admin Dashboard</h2>
              <p className="header-project-location">Pertama Property Overview</p>
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <div className="header-search hidden-mobile">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile hidden-mobile">
          <div className="profile-info">
            <span className="profile-name">{profile?.full_name || 'User'}</span>
            <span className="profile-role">{profile?.role === 'admin' ? 'Administrator' : 'Property Owner'}</span>
          </div>
          <div className="profile-avatar">
            <UserIcon size={18} />
          </div>
        </div>

        <button 
          className="demo-switch-btn" 
          onClick={signOut}
          title="Sign Out"
        >
          <LogOut size={16} />
          <span className="hidden-mobile">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
