import React from "react";
import { Quest } from "../pages/questboard/api";

type Props = {
  quest: Quest;
  status?: string;
  onClick: (id: string) => void;
};

export default function EnhancedQuestCard({ quest, status, onClick }: Props) {
  return (
    <div 
      onClick={() => onClick(quest.id)}
      className="group relative cursor-pointer flex flex-col md:flex-row items-center justify-between rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-6 shadow-[8px_8px_0_0_rgba(43,43,43,0.22)] hover:shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] hover:translate-y-1 hover:bg-[#fff9eb] transition-all overflow-hidden"
    >
      {/* Badges Area */}
      <div className="absolute top-4 right-6 flex gap-2">
        {quest.isLiveEventRelated && (
          <span className="animate-pulse bg-red-100 text-red-600 border border-red-300 text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            Live Match Bonus
          </span>
        )}
      </div>

      <div className="flex-1 w-full mt-4 md:mt-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 bg-[#2b2b2b]/10 px-2 py-1 rounded-md">
            {quest.serviceType}
          </span>
          {/* Difficulty Stars */}
          {quest.difficulty && (
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  className={`w-3 h-3 ${star <= quest.difficulty! ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          )}
        </div>
        
        <h3 className="font-['Bebas_Neue'] text-3xl md:text-4xl mt-1 text-[#2b2b2b] group-hover:text-blue-700 transition-colors">
          {quest.title}
        </h3>
        <p className="opacity-80 mt-2 font-['Space_Grotesk'] text-sm line-clamp-2 md:line-clamp-none max-w-lg">
          {quest.description}
        </p>
      </div>

      <div className="flex items-center gap-6 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t-2 md:border-t-0 border-[#2b2b2b]/10 pt-4 md:pt-0">
        <div className="text-center bg-[#efe9da] rounded-xl px-4 py-2 border-2 border-[#2b2b2b]/20 group-hover:border-[#2b2b2b]/50 transition-colors">
          <span className="block font-['Bebas_Neue'] text-4xl text-[#2b2b2b] leading-none">{quest.points}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">PTS</span>
        </div>
        
        <div className="text-sm font-bold w-28 text-center uppercase tracking-wider">
          {!status && <span className="opacity-40">UNCLAIMED</span>}
          {status === "CLAIMED" && <span className="text-orange-500 bg-orange-100 px-3 py-1.5 rounded-full border border-orange-200">CLAIMED</span>}
          {status === "SUBMITTED" && <span className="text-blue-500 bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200">PENDING</span>}
          {status === "APPROVED" && <span className="text-green-600 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">APPROVED</span>}
          {status === "REJECTED" && <span className="text-red-500 bg-red-100 px-3 py-1.5 rounded-full border border-red-200">REJECTED</span>}
        </div>
      </div>
    </div>
  );
}
