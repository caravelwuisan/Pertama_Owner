import React from 'react';
import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  profile: any;
}

export const Header: React.FC<HeaderProps> = ({ profile }) => {
  const { signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-breadcrumbs">
        {profile?.role === 'owner' ? (
          <div>
            <h2 className="header-project-name">My Properties</h2>
            <p className="header-project-location">Pertama Owner Dashboard</p>
          </div>
        ) : (
          <div>
            <h2 className="header-project-name">Admin Dashboard</h2>
            <p className="header-project-location">Pertama Property Overview</p>
          </div>
        )}
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile">
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
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
