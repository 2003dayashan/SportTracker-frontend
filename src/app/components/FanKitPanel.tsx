import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WORLD_CUP_COUNTRIES } from "../data/worldCupCountries";
import FanFigure from "./FanFigure";

interface FanKitPanelProps {
  open: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
}

export default function FanKitPanel({ open, isLoggedIn, onClose }: FanKitPanelProps) {
  const [displayName, setDisplayName] = useState("");
  const [countryCode, setCountryCode] = useState(WORLD_CUP_COUNTRIES[0].code);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || !isLoggedIn || loaded) return;
    fetch("/api/football/fan-profile/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setDisplayName(data.displayName);
          setCountryCode(data.countryCode);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, isLoggedIn, loaded]);

  const selected =
    WORLD_CUP_COUNTRIES.find((c) => c.code === countryCode) || WORLD_CUP_COUNTRIES[0];

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/football/fan-profile/me", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, countryCode }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#2b2b2b]/40 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8 max-w-2xl w-full flex flex-col md:flex-row gap-6 items-center"
          >
           <FanFigure primaryColor={selected.primary} secondaryColor={selected.secondary} name={displayName} />

            <div className="flex-1 w-full">
              <h2 className="font-['Bebas_Neue'] text-3xl text-[#2b2b2b] mb-1">YOUR FAN KIT</h2>
              <p className="font-['Caveat'] text-xl text-[#2b2b2b] mb-4">
                pick your team. wear the colors.
              </p>

              {!isLoggedIn ? (
                <p className="font-['Space_Grotesk'] text-sm">
                  Please sign in first to save your fan kit.
                </p>
              ) : (
                <>
                  <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full mb-4 rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] px-5 py-2 font-['Space_Grotesk']"
                  />

                  <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest mb-1">
                    Supporting Country
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full mb-6 rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] px-5 py-2 font-['Space_Grotesk']"
                  >
                    {WORLD_CUP_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="rounded-full border-2 border-[#2b2b2b] px-6 py-2 font-['Space_Grotesk'] font-bold text-sm uppercase"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-full bg-[#2b2b2b] text-[#f3eee1] px-6 py-2 font-['Space_Grotesk'] font-bold text-sm uppercase hover:bg-transparent hover:text-[#2b2b2b] border-2 border-[#2b2b2b] transition-all"
                    >
                      {saving ? "Saving..." : "Save Fan Kit"}
                    </button>
                  </div>
                  {saved && (
                    <p className="mt-3 font-['Caveat'] text-lg text-[#006233]">✓ Saved!</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}