// src/pages/esport/Layout.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar, { type EsportPage } from './Sidebar';
import TopNav from './TopNav';
import { EsportThemeProvider } from './EsportThemeContext';
import './Theme.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: EsportPage;
  onNavigate: (page: EsportPage) => void;
  onExit: () => void;
  isAdmin: boolean;
  username?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onExit, isAdmin, username }) => {
  return (
    <EsportThemeProvider>
      <div className="flex min-h-screen font-sans">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} onExit={onExit} isAdmin={isAdmin} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav username={username} isAdmin={isAdmin} />
          <main className="p-8 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </EsportThemeProvider>
  );
};

export default Layout;
