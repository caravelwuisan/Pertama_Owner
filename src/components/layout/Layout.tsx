import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AssistantDrawer } from '../assistant/AssistantDrawer';
import './Layout.css';
import { useAuth } from '../../contexts/AuthContext';

export const Layout: React.FC = () => {
  const { user, profile } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 1024 && width >= 768) {
        setIsSidebarExpanded(false);
        setIsMobileOpen(false);
      } else if (width >= 1024) {
        setIsSidebarExpanded(true);
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close mobile sidebar when navigating
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (!user || !profile) return null;

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  return (
    <div className={`layout-container ${!isMobile ? (isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed') : 'mobile-layout'}`}>
      <Sidebar 
        role={profile.role} 
        isExpanded={isMobile ? true : isSidebarExpanded} 
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        toggleSidebar={toggleSidebar} 
        toggleAssistant={() => setIsAssistantOpen(true)}
      />
      
      {/* Mobile backdrop for off-canvas menu */}
      {isMobile && isMobileOpen && (
        <div className="mobile-sidebar-backdrop fade-in" onClick={() => setIsMobileOpen(false)}></div>
      )}

      <div className="layout-content">
        <Header profile={profile} toggleSidebar={toggleSidebar} />
        <main className="main-content fade-in">
          <Outlet />
        </main>
      </div>

      <AssistantDrawer 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
      />
    </div>
  );
};
