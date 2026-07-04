import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserIcon, Shield, Trophy, Settings, LogOut, Code, Swords } from "lucide-react";
import { type User } from "../pages/questboard/api";
import { type Page } from "../App";
import { PrimeDoorButton } from "../PrimeDoorButton";

interface ProfileWidgetProps {
  isLoggedIn: boolean;
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

export function ProfileWidget({
  isLoggedIn,
  currentUser,
  onLogin,
  onLogout,
  onNavigate,
}: ProfileWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Determine role display
  const roleDisplay = currentUser?.role === "ADMIN" || currentUser?.role === "GUILD_MASTER" ? "ADMIN" : "USER";
  const isAdmin = roleDisplay === "ADMIN";

  return (
    <div 
      className="relative z-[100]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full border-[3px] border-[#2b2b2b] bg-[#efe9da] shadow-[4px_4px_0_0_rgba(43,43,43,0.4)] flex items-center justify-center relative overflow-hidden"
      >
        {isLoggedIn ? (
          <>
            {isAdmin ? (
              <Shield className="w-6 h-6 text-[#2b2b2b]" strokeWidth={2.5} />
            ) : (
              <UserIcon className="w-6 h-6 text-[#2b2b2b]" strokeWidth={2.5} />
            )}
            <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border border-[#2b2b2b] animate-pulse ${isAdmin ? 'bg-[#ef4444]' : 'bg-[#4ade80]'}`} />
          </>
        ) : (
          <UserIcon className="w-6 h-6 text-[#2b2b2b] opacity-60" strokeWidth={2.5} />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[calc(100%+0.75rem)] right-0 w-64 bg-[#f7f0df] border-[3px] border-[#2b2b2b] rounded-2xl shadow-[8px_8px_0_0_rgba(43,43,43,0.3)] overflow-hidden flex flex-col"
            style={{ transformOrigin: "top right" }}
          >
            {isLoggedIn && currentUser ? (
              <>
                <div className="p-4 border-b-[3px] border-[#2b2b2b] bg-[#efe9da]">
                  <p className="font-['Bebas_Neue'] text-3xl text-[#2b2b2b] truncate leading-none">
                    {currentUser.username || "Player One"}
                  </p>
                  <p className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-widest text-[#2b2b2b]/70 flex items-center gap-1 mt-2">
                    {isAdmin ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    {roleDisplay}
                  </p>
                </div>

                <div className="p-2 space-y-1">
                  {!isAdmin ? (
                    <>
                      <MenuButton 
                        icon={<Swords className="w-4 h-4" />} 
                        label="Quest Board" 
                        onClick={() => onNavigate("questboard-home")} 
                      />
                      <MenuButton 
                        icon={<Code className="w-4 h-4" />} 
                        label="E-Sports" 
                        onClick={() => onNavigate("esport-home")} 
                      />
                      <MenuButton 
                        icon={<Trophy className="w-4 h-4" />} 
                        label="Football" 
                        onClick={() => onNavigate("football-home")} 
                      />
                      
                      <div className="my-1 border-t-[3px] border-[#2b2b2b]/10" />
                      
                      <MenuButton 
                        icon={<Settings className="w-4 h-4" />} 
                        label="My Profile" 
                        onClick={() => onNavigate("user-profile")} 
                      />
                    </>
                  ) : (
                    <>
                      <MenuButton 
                        icon={<Shield className="w-4 h-4" />} 
                        label="Admin Dashboard" 
                        onClick={() => onNavigate("admin-users")} 
                        variant="admin"
                      />
                      
                      <div className="my-1 border-t-[3px] border-[#2b2b2b]/10" />
                      
                      <MenuButton 
                        icon={<Settings className="w-4 h-4" />} 
                        label="Admin Profile" 
                        onClick={() => onNavigate("admin-profile")} 
                      />
                    </>
                  )}
                  <MenuButton 
                    icon={<LogOut className="w-4 h-4" />} 
                    label="Log Out" 
                    onClick={onLogout}
                    variant="danger"
                  />
                </div>
              </>
            ) : (
              <div className="p-4 space-y-4 bg-[#2b2b2b] text-[#f7f0df] flex flex-col items-center">
                <div className="font-['Bebas_Neue'] text-2xl tracking-widest text-[#d9b45f] text-center w-full border-b-[3px] border-[#d9b45f] pb-2 mb-2">
                  IDENTIFICATION REQUIRED
                </div>
                <PrimeDoorButton 
                  variant="login" 
                  label="USER LOGIN" 
                  onComplete={onLogin} 
                  className="w-full justify-center !text-[#f7f0df] !border-[#f7f0df]"
                />
                <PrimeDoorButton 
                  variant="admin" 
                  label="ADMIN LOGIN" 
                  onComplete={onLogin} 
                  className="w-full justify-center"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({ 
  icon, 
  label, 
  onClick, 
  variant = "default" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  variant?: "default" | "danger" | "admin";
}) {
  const baseClasses = "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider transition-colors";
  let variantClasses = "text-[#2b2b2b] hover:bg-[#2b2b2b] hover:text-[#f7f0df]";
  
  if (variant === "danger") {
    variantClasses = "text-[#c0392b] hover:bg-[#c0392b] hover:text-white";
  } else if (variant === "admin") {
    variantClasses = "text-[#d9b45f] hover:bg-[#2b2b2b] hover:text-[#d9b45f]";
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
