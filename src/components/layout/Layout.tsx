import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './Layout.css';
import { useAuth } from '../../contexts/AuthContext';

export const Layout: React.FC = () => {
  const { user, profile } = useAuth();

  if (!user || !profile) return null;

  return (
    <div className="layout-container">
      <Sidebar role={profile.role} />
      <div className="layout-content">
        <Header profile={profile} />
        <main className="main-content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
