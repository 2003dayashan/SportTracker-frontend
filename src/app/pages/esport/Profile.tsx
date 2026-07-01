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
    if (!playerId) {
      setLoading(false);
      setError('No player selected.');
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    PlayerApi.get(playerId)
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
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load player profile');
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
    return <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading profile...</div>;
  }

  if (error || !player) {
    return (
      <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>
        {error ?? 'Player not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>

      {/* TOP SUB-HEADER */}
      <div className="flex justify-between items-center text-[10px] font-mono border-b pb-2" style={{ borderColor: 'var(--e-border)' }}>
        <span className="uppercase font-bold" style={{ color: 'var(--e-text-dim)' }}>PLAYER PROFILE // ACC.{player.id.slice(0, 4)}</span>
        <span className="font-bold tracking-wider" style={{ color: 'var(--e-success)' }}>● VERIFIED ACCOUNT</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: AVATAR CARD */}
        <div className="lg:col-span-4 border p-4 rounded-sm flex flex-col justify-between h-full relative group" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
          <div className="flex justify-between items-center text-[9px] font-mono mb-4 uppercase font-bold" style={{ color: 'var(--e-text-dim)' }}>
            <span>PLAYER CARD</span>
            <span>REV_04</span>
          </div>

          <div className="border aspect-square rounded-sm flex flex-col items-center justify-center font-mono text-xs relative overflow-hidden transition-all" style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)', color: 'var(--e-text-dim)' }}>
            <span className="text-4xl mb-2">🥷</span>
            <span className="text-[10px] uppercase tracking-widest font-black">[ AVATAR IMAGE ]</span>
            <div className="absolute bottom-3 right-3 font-mono font-black text-[9px] px-2 py-0.5 uppercase tracking-wider" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
              ONLINE
            </div>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="lg:col-span-8 space-y-6">

          <div>
            <h2 className="text-4xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>{player.username}</h2>
            <span className="inline-block text-[10px] font-mono font-black tracking-widest uppercase mt-1" style={{ color: 'var(--e-accent)' }}>
              // {player.role || 'PRO PLAYER'}
            </span>
            <p className="text-xs font-medium leading-relaxed mt-3 max-w-2xl" style={{ color: 'var(--e-text-muted)' }}>
              {team ? `Competing for ${team.name}.` : 'Not currently assigned to a team.'}
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border p-4 rounded-sm text-center font-mono" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
              <span className="block text-[9px] font-black tracking-wider uppercase mb-1" style={{ color: 'var(--e-text-dim)' }}>WIN RATE</span>
              <span className="text-2xl font-black" style={{ color: 'var(--e-text)' }}>{statVal('winRate')}</span>
            </div>
            <div className="border p-4 rounded-sm text-center font-mono" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
              <span className="block text-[9px] font-black tracking-wider uppercase mb-1" style={{ color: 'var(--e-text-dim)' }}>K/D RATIO</span>
              <span className="text-2xl font-black" style={{ color: 'var(--e-text)' }}>{statVal('kdRatio')}</span>
            </div>
          </div>

          {/* RANK */}
          <div className="border p-4 rounded-sm flex flex-col items-center justify-center font-mono" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
            <span className="text-[9px] font-black tracking-wider uppercase mb-1" style={{ color: 'var(--e-text-dim)' }}>CURRENT RANK</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base">🏅</span>
              <span className="text-xl font-black uppercase tracking-wider" style={{ color: 'var(--e-text)' }}>{statVal('rank')}</span>
            </div>
          </div>

          {/* TEAM INFO */}
          <div className="border p-4 rounded-sm space-y-3 font-mono text-xs" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
            <span className="block text-[9px] font-black tracking-wider uppercase border-b pb-1.5 mb-2" style={{ color: 'var(--e-text-dim)', borderColor: 'var(--e-border)' }}>
              TEAM INFO
            </span>
            <div className="flex justify-between items-center">
              <span className="font-bold" style={{ color: 'var(--e-text-muted)' }}>🛡️ Team</span>
              <span className="font-bold" style={{ color: 'var(--e-text)' }}>{team?.name ?? 'Unassigned'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold" style={{ color: 'var(--e-text-muted)' }}>🎮 Role</span>
              <span className="font-bold" style={{ color: 'var(--e-text)' }}>{player.role || 'N/A'}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;