import React, { useEffect, useState } from "react";
import { ArrowLeft, Trophy, Flame } from "lucide-react";
import LiveScoresWidget from "../../components/LiveScoresWidget";
import { fetchMyProgress, QuestSubmission } from "./api";

type Props = {
  onBack: () => void;
};

export default function QuestboardDashboard({ onBack }: Props) {
  const [points, setPoints] = useState(0);
  const [submissions, setSubmissions] = useState<QuestSubmission[]>([]);

  useEffect(() => {
    fetchMyProgress().then(res => {
      setPoints(res.points);
      setSubmissions(res.submissions);
    }).catch(err => console.error(err));
  }, []);

  const approved = submissions.filter(s => s.status === "APPROVED");
  const pending = submissions.filter(s => s.status === "SUBMITTED");

  return (
    <div className="min-h-screen bg-[#efe9da] text-[#2b2b2b] p-6 lg:p-10 font-['Space_Grotesk']">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] px-4 py-2 font-['Space_Grotesk'] text-sm shadow-[3px_3px_0_0_rgba(43,43,43,0.35)] hover:-translate-x-1 transition-transform">
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} /> Back
        </button>
        <div className="font-['Bebas_Neue'] text-4xl pr-24 lg:pr-32">DASHBOARD</div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-[3px] border-[#2b2b2b] rounded-2xl bg-[#f7f0df] p-6 shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] flex flex-col items-center justify-center">
              <Trophy className="w-8 h-8 mb-2 text-yellow-500" />
              <div className="font-['Bebas_Neue'] text-5xl">{points}</div>
              <div className="text-xs uppercase font-bold tracking-widest opacity-60">Total Points</div>
            </div>
            <div className="border-[3px] border-[#2b2b2b] rounded-2xl bg-[#f7f0df] p-6 shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] flex flex-col items-center justify-center">
              <Flame className="w-8 h-8 mb-2 text-orange-500" />
              <div className="font-['Bebas_Neue'] text-5xl">{approved.length}</div>
              <div className="text-xs uppercase font-bold tracking-widest opacity-60">Quests Completed</div>
            </div>
            <div className="border-[3px] border-[#2b2b2b] rounded-2xl bg-[#f7f0df] p-6 shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] flex flex-col items-center justify-center">
              <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">!</div>
              <div className="font-['Bebas_Neue'] text-5xl">{pending.length}</div>
              <div className="text-xs uppercase font-bold tracking-widest opacity-60">Pending Review</div>
            </div>
          </div>

          <div className="border-[3px] border-[#2b2b2b] rounded-[2rem] bg-[#f7f0df] p-8 shadow-[8px_8px_0_0_rgba(43,43,43,0.22)]">
            <h2 className="font-['Bebas_Neue'] text-3xl mb-6">Recent Activity</h2>
            {submissions.length === 0 ? (
              <p className="opacity-50 italic">No quest activity yet.</p>
            ) : (
              <div className="space-y-4">
                {submissions.slice().reverse().slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center justify-between border-b-2 border-[#2b2b2b]/10 pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-bold">{s.questTitle}</h4>
                      <div className="text-xs opacity-60">{new Date(s.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-['Bebas_Neue'] text-2xl">+{s.points} PTS</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${s.status === 'APPROVED' ? 'bg-green-100 text-green-700' : s.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Integration */}
        <div className="space-y-8">
          <LiveScoresWidget />

          <div className="border-[3px] border-[#2b2b2b] rounded-2xl bg-[#2b2b2b] text-[#efe9da] p-6 shadow-[4px_4px_0_0_rgba(43,43,43,0.22)]">
            <h3 className="font-['Bebas_Neue'] text-2xl text-yellow-400 mb-2">Live Match Bonus</h3>
            <p className="text-sm opacity-80 mb-4">
              Complete any <strong className="text-white">Live Event</strong> quests while matches are live to earn a <strong className="text-yellow-400">1.5x Point Multiplier!</strong>
            </p>
            <div className="w-full bg-[#efe9da]/20 h-2 rounded-full overflow-hidden">
              <div className="bg-yellow-400 w-1/3 h-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
