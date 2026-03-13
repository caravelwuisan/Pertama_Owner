import React from 'react';
import { Outlet } from 'react-router-dom';
import type { User, Project } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './Layout.css';

interface LayoutProps {
  user: User;
  project?: Project;
  onToggleRole: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, project, onToggleRole }) => {
  return (
    <div className="layout-container">
      <Sidebar user={user} />
      <div className="layout-content">
        <Header user={user} project={project} onToggleRole={onToggleRole} />
        <main className="main-content placeholder-animation">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
