import React, { useEffect, useState } from 'react';
import { PlayerApi, TeamApi, type Player, type Team } from '../../../lib/esportApi';

interface ProfileProps {
  playerId?: string;
}

const Profile: React.FC<ProfileProps> = ({ playerId }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no playerId provided, try to fetch first active player or show placeholder
    const targetId = playerId || '6584285223'; // fallback or default player id
    let cancelled = false;
    setLoading(true);
    setError(null);

    PlayerApi.get(targetId)
      .then(async (p) => {
        if (cancelled) return;
        setPlayer(p);
        if (p.teamId) {
          try {
            const t = await TeamApi.get(p.teamId);
            if (!cancelled) setTeam(t);
          } catch {
            // team lookup failing shouldn't block the profile
          }
        }
      })
      .catch(async (err) => {
        // If specific ID fails, try getting list of players and taking the first one
        try {
          const playersList = await PlayerApi.getAll();
          if (playersList.length > 0 && !cancelled) {
            const firstPlayer = playersList[0];
            setPlayer(firstPlayer);
            if (firstPlayer.teamId) {
              const t = await TeamApi.get(firstPlayer.teamId);
              if (!cancelled) setTeam(t);
            }
          } else {
            if (!cancelled) setError('No player profiles found in system.');
          }
        } catch {
          if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load player profile');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [playerId]);

  const statVal = (key: string) => {
    const v = player?.stats?.[key];
    return v === undefined || v === null || v === '' ? 'N/A' : String(v);
  };

  if (loading) {
    return <div className="text-xs font-mono text-primary animate-pulse">LOADING VITAL PROFILE...</div>;
  }

  if (error || !player) {
    return (
      <div className="text-xs font-mono p-4 bg-surface-container border-2 border-primary text-primary">
        {error ?? 'PLAYER DATA NOT RECORDED'}
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none subpixel-antialiased">
      {/* TOP SUB-HEADER */}
      <div className="flex justify-between items-center text-[10px] font-mono border-b border-outline-variant/30 pb-2">
        <span className="uppercase font-bold text-on-surface-variant">PLAYER PROFILE // ACC.{player.id.slice(0, 8).toUpperCase()}</span>
        <span className="font-bold tracking-wider text-primary flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          VERIFIED GLITCH ACC.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: AVATAR CARD */}
        <div className="lg:col-span-4 brutal-card p-6 flex flex-col justify-between relative group">
          <div className="flex justify-between items-center text-[9px] font-mono mb-4 uppercase font-bold text-on-surface-variant">
            <span>PLAYER CARD</span>
            <span>REV_04</span>
          </div>

          <div className="border aspect-square rounded-sm flex flex-col items-center justify-center font-mono text-xs relative overflow-hidden transition-all bg-surface-container-lowest border-outline-variant">
            <span className="text-6xl mb-4 animate-pulse">🥷</span>
            <span className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">[ AVATAR OVERLAY ]</span>
            <div className="absolute bottom-3 right-3 font-mono font-black text-[9px] px-2 py-0.5 uppercase tracking-wider bg-primary text-black">
              ONLINE
            </div>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h2 className="text-4xl font-black tracking-wider uppercase font-headline-md text-on-surface">{player.username}</h2>
            <span className="inline-block text-[10px] font-mono font-black tracking-widest uppercase mt-1 text-primary">
              // {player.role || 'PRO LEAGUE STRIKER'}
            </span>
            <p className="text-xs font-medium leading-relaxed mt-4 text-on-surface-variant max-w-xl">
              {team ? `Currently assigned to the professional unit ${team.name} as a designated striker.` : 'Not currently assigned to a competitive team squad.'}
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container border border-outline-variant p-5 rounded-sm text-center font-mono">
              <span className="block text-[9px] font-black tracking-wider uppercase mb-1 text-on-surface-variant">WIN RATE</span>
              <span className="text-2xl font-black text-primary">{statVal('winRate')}</span>
            </div>
            <div className="bg-surface-container border border-outline-variant p-5 rounded-sm text-center font-mono">
              <span className="block text-[9px] font-black tracking-wider uppercase mb-1 text-on-surface-variant">K/D RATIO</span>
              <span className="text-2xl font-black text-primary">{statVal('kdRatio')}</span>
            </div>
          </div>

          {/* RANK */}
          <div className="bg-surface-container-lowest border-2 border-primary/20 p-5 rounded-sm flex flex-col items-center justify-center font-mono">
            <span className="text-[9px] font-black tracking-wider uppercase mb-1 text-on-surface-variant">CURRENT ARENA RANK</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl">🏅</span>
              <span className="text-2xl font-black uppercase tracking-wider text-primary">{statVal('rank')}</span>
            </div>
          </div>

          {/* TEAM INFO */}
          <div className="bg-surface-container border border-outline-variant p-5 rounded-sm space-y-3 font-mono text-xs">
            <span className="block text-[9px] font-black tracking-wider uppercase border-b border-outline-variant/30 pb-2 mb-2 text-on-surface-variant">
              TACTICAL ASSIGNMENTS
            </span>
            <div className="flex justify-between items-center">
              <span className="font-bold text-on-surface-variant">🛡️ Team Unit</span>
              <span className="font-bold text-on-surface">{team?.name ?? 'Unassigned'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-on-surface-variant">🎮 Specialty Role</span>
              <span className="font-bold text-on-surface">{player.role || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

