import React, { createContext, useContext, useState, ReactNode } from 'react';

// === 1. DATA INTERFACES ===
export interface TournamentItem { id: number; name: string; game: string; status: 'ACTIVE' | 'PENDING'; }
export interface MatchItem { id: number; teams: string; time: string; isLive: boolean; }
export interface TeamItem { id: number; name: string; leader: string; membersCount: number; }
export interface PlayerItem { id: number; username: string; kd: string; rank: string; status: 'ACTIVE' | 'BANNED'; }

interface AppContextType {
  tournaments: TournamentItem[]; setTournaments: React.Dispatch<React.SetStateAction<TournamentItem[]>>;
  matches: MatchItem[]; setMatches: React.Dispatch<React.SetStateAction<MatchItem[]>>;
  teams: TeamItem[]; setTeams: React.Dispatch<React.SetStateAction<TeamItem[]>>;
  players: PlayerItem[]; setPlayers: React.Dispatch<React.SetStateAction<PlayerItem[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial Mock Data matching our Esports theme
  const [tournaments, setTournaments] = useState<TournamentItem[]>([
    { id: 1, name: 'STICK LEAGUE OPEN', game: 'Valorant', status: 'ACTIVE' },
    { id: 2, name: 'UNDERGROUND SHOWDOWN', game: 'CS2', status: 'PENDING' },
  ]);

  const [matches, setMatches] = useState<MatchItem[]>([
    { id: 1, teams: 'RED REAPERS VS SHADOW SYNDICATE', time: '18:00 UTC', isLive: true },
    { id: 2, teams: 'CYBER DRIFTERS VS IRON PHANTOM', time: '21:30 UTC', isLive: false },
  ]);

  const [teams, setTeams] = useState<TeamItem[]>([
    { id: 1, name: 'RED REAPERS', leader: 'Ghost_Proto', membersCount: 5 },
    { id: 2, name: 'SHADOW SYNDICATE', leader: 'Viper_X', membersCount: 4 },
  ]);

  const [players, setPlayers] = useState<PlayerItem[]>([
    { id: 1, username: 'GHOST_PROTO', kd: '2.14', rank: 'DIAMOND II', status: 'ACTIVE' },
    { id: 2, username: 'VOID_WALKER', kd: '1.95', rank: 'PLATINUM IV', status: 'ACTIVE' },
  ]);

  return (
    <AppContext.Provider value={{ tournaments, setTournaments, matches, setMatches, teams, setTeams, players, setPlayers }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
