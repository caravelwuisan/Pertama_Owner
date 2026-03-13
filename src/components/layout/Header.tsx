import React from 'react';
import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import type { User, Project } from '../../types';
import './Header.css';

interface HeaderProps {
  user: User;
  project?: Project;
  onToggleRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, project, onToggleRole }) => {
  return (
    <header className="header">
      <div className="header-breadcrumbs">
        {user.role === 'owner' && project ? (
          <div>
            <h2 className="header-project-name">{project.name}</h2>
            <p className="header-project-location">{project.address}</p>
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
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile">
          <div className="profile-info">
            <span className="profile-name">{user.name}</span>
            <span className="profile-role">{user.role === 'admin' ? 'Administrator' : 'Property Owner'}</span>
          </div>
          <div className="profile-avatar">
            <UserIcon size={20} />
          </div>
        </div>

        {/* Demo Switcher */}
        <button 
          className="demo-switch-btn" 
          onClick={onToggleRole}
          title={`Switch to ${user.role === 'admin' ? 'Owner' : 'Admin'} view`}
        >
          <LogOut size={16} />
          <span>Switch Role</span>
        </button>
      </div>
    </header>
  );
};
