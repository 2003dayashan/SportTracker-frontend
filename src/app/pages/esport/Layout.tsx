// src/pages/esport/Layout.tsx
import React from 'react';
import Sidebar, { type EsportPage } from './Sidebar';
import TopNav from './TopNav';
import { EsportThemeProvider } from './EsportThemeContext';
import './theme.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: EsportPage;
  onNavigate: (page: EsportPage) => void;
  onExit: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onExit }) => {
  return (
    <EsportThemeProvider>
      <div className="flex min-h-screen font-sans">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} onExit={onExit} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <main className="p-8 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </EsportThemeProvider>
  );
};

export default Layout;
