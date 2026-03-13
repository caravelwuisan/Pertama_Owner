import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './Layout.css';
import { useAuth } from '../../contexts/AuthContext';

export const Layout: React.FC = () => {
  const { user, profile } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Auto collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user || !profile) return null;

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={`layout-container ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Sidebar role={profile.role} isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className="layout-content">
        <Header profile={profile} />
        <main className="main-content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
