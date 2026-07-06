import { createContext, useContext, useState, type ReactNode } from "react";
import { Tournament } from "../lib/esportApi";

interface EsportContextValue {
  selectedTournament: Tournament | null;
  setSelectedTournament: (tournament: Tournament | null) => void;
}

const EsportContext = createContext<EsportContextValue | undefined>(undefined);

export function EsportContextProvider({ children }: { children: ReactNode }) {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  return (
    <EsportContext.Provider value={{ selectedTournament, setSelectedTournament }}>
      {children}
    </EsportContext.Provider>
  );
}

export function useEsportContext() {
  const ctx = useContext(EsportContext);
  if (!ctx) throw new Error("useEsportContext must be used within EsportContextProvider");
  return ctx;
}