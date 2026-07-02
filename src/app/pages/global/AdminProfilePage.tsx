import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Shield, Save } from "lucide-react";
import { type User as UserType } from "../questboard/api";

interface AdminProfilePageProps {
  currentUser: UserType | null;
  onBack: () => void;
  onProfileUpdate?: () => void;
}

export function AdminProfilePage({ currentUser, onBack, onProfileUpdate }: AdminProfilePageProps) {
  const [username, setUsername] = useState(currentUser?.username || "");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: password || undefined })
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setMessage({ text: "Admin credentials updated successfully!", type: "success" });
      setPassword("");
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (err) {
      setMessage({ text: "Failed to update credentials.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2b2b] text-[#f7f0df] overflow-hidden">
      {/* Background Pattern - Dark Mode variant */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.05] [background-image:radial-gradient(#f7f0df_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-12">
          <motion.button
            onClick={onBack}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#d9b45f] bg-[#2b2b2b] text-[#d9b45f] px-4 py-2 font-['Space_Grotesk'] text-sm shadow-[3px_3px_0_0_rgba(217,180,95,0.35)]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back
          </motion.button>
          
          <div className="font-['Bebas_Neue'] text-3xl tracking-widest text-[#d9b45f]">
            COMMAND CENTER
          </div>
        </header>

        <main>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-[#2b2b2b] border-[3px] border-[#d9b45f] rounded-[2rem] shadow-[12px_12px_0_0_rgba(217,180,95,0.15)] overflow-hidden"
          >
            <div className="p-8 md:p-12 border-b-[3px] border-[#d9b45f] bg-[#d9b45f] text-[#2b2b2b] flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full border-[3px] flex items-center justify-center bg-[#f7f0df] text-[#2b2b2b] relative z-10 transition-colors ${isSaving ? 'border-transparent' : 'border-[#2b2b2b]'}`}>
                  <Shield className="w-10 h-10" strokeWidth={2.5} />
                </div>
                {isSaving && (
                  <>
                    <svg className="absolute inset-[-6px] w-[108px] h-[108px] animate-[spin_2s_linear_infinite] pointer-events-none" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="48" 
                        fill="none" 
                        stroke="#2b2b2b" 
                        strokeWidth="4" 
                        strokeDasharray="30 20" 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute top-0 right-0 w-4 h-4 bg-[#ef4444] rounded-full border-2 border-[#f7f0df] z-20 animate-pulse" />
                  </>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide">{currentUser?.username || "SYSTEM ADMIN"}</h1>
                <p className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.2em] opacity-80 flex items-center justify-center md:justify-start gap-2 mt-2">
                  <Shield className="w-4 h-4" /> ELEVATED PRIVILEGES
                </p>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-[#d9b45f]">SECURITY PROTOCOLS</h2>
              
              <form onSubmit={handleUpdate} className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest text-[#d9b45f]/80">
                    Admin Identifier
                  </label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-[#2b2b2b] text-[#f7f0df] border-[3px] border-[#d9b45f] rounded-xl px-4 py-3 font-['Space_Grotesk'] font-bold focus:outline-none focus:ring-4 focus:ring-[#d9b45f]/20 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest text-[#d9b45f]/80">
                    Access Key (Password)
                  </label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to maintain current access"
                    className="w-full bg-[#2b2b2b] text-[#f7f0df] border-[3px] border-[#d9b45f] rounded-xl px-4 py-3 font-['Space_Grotesk'] font-bold focus:outline-none focus:ring-4 focus:ring-[#d9b45f]/20 transition-all placeholder-[#f7f0df]/30"
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-xl border-[3px] font-['Space_Grotesk'] font-bold text-sm ${
                    message.type === "success" 
                      ? "bg-[#2f7a4d]/20 border-[#2f7a4d] text-[#4ade80]" 
                      : "bg-[#c0392b]/20 border-[#c0392b] text-[#f87171]"
                  }`}>
                    {message.text}
                  </div>
                )}

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSaving}
                  className="mt-4 flex items-center justify-center gap-2 w-full md:w-auto bg-[#d9b45f] text-[#2b2b2b] border-[3px] border-[#d9b45f] rounded-xl px-8 py-3.5 font-['Space_Grotesk'] font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#d9b45f] transition-colors shadow-[4px_4px_0_0_rgba(217,180,95,0.2)]"
                >
                  {isSaving ? (
                    "ENCRYPTING..."
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> OVERRIDE CREDENTIALS
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
