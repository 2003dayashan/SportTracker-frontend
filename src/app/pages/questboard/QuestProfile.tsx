import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { fetchMyProgress, QuestSubmission } from "./api";

type Props = {
  isLoggedIn: boolean;
  currentUser: any;
  onBack: () => void;
};

export default function QuestProfile({ isLoggedIn, currentUser, onBack }: Props) {
  const [points, setPoints] = useState(0);
  const [submissions, setSubmissions] = useState<QuestSubmission[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyProgress().then(res => {
        setPoints(res.points);
        setSubmissions(res.submissions);
      }).catch(console.error);
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#efe9da] text-[#2b2b2b] p-6 lg:p-10 font-['Space_Grotesk']">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2b2b] px-4 py-2 hover:-translate-x-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </header>
      
      {!isLoggedIn ? (
        <div className="text-center font-['Caveat'] text-4xl mt-20">Please log in to view your progress!</div>
      ) : (
        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_2fr] gap-10">
          <div className="text-center">
            <h1 className="font-['Bebas_Neue'] text-6xl mb-4">MY PROGRESS</h1>
            <div className="font-['Caveat'] text-3xl mb-8 -rotate-2">Stay on the grind, {currentUser?.username || "Player"}!</div>
            <div className="rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-10 shadow-[8px_8px_0_0_rgba(43,43,43,0.22)]">
              <div className="font-['Bebas_Neue'] text-8xl">{points}</div>
              <div className="font-bold tracking-widest uppercase">Total Points Earned</div>
            </div>
          </div>
          
          <div>
            <h2 className="font-['Bebas_Neue'] text-4xl mb-6">Recent History</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {submissions.length === 0 && <p className="opacity-70">No quests claimed yet.</p>}
              {submissions.map(sub => (
                <div key={sub.id} className="border-2 border-[#2b2b2b] bg-white rounded-xl p-4 flex justify-between items-center shadow-[4px_4px_0_0_rgba(43,43,43,0.2)]">
                  <div>
                    <h3 className="font-bold">{sub.questTitle}</h3>
                    <p className="text-sm opacity-70">
                      {new Date(sub.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-['Bebas_Neue'] text-2xl">{sub.points} PTS</div>
                    <div className={`text-xs font-bold ${
                      sub.status === 'APPROVED' ? 'text-green-600' :
                      sub.status === 'SUBMITTED' ? 'text-blue-500' :
                      sub.status === 'CLAIMED' ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {sub.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
