'use client';

interface TeamScoreDisplayProps {
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
}

export function TeamScoreDisplay({
  teamAName,
  teamBName,
  teamAScore,
  teamBScore,
}: TeamScoreDisplayProps) {
  return (
    <div className="flex gap-8 justify-center items-center">
      {/* Team A */}
      <div className="bg-blue-500/20 border-4 border-blue-500 rounded-2xl px-12 py-6 text-center min-w-[300px]">
        <div className="text-3xl font-bold text-blue-300 mb-2">{teamAName}</div>
        <div className="text-8xl font-black text-white">{teamAScore}</div>
      </div>

      {/* VS */}
      <div className="text-6xl font-black text-white/30">VS</div>

      {/* Team B */}
      <div className="bg-yellow-500/20 border-4 border-yellow-500 rounded-2xl px-12 py-6 text-center min-w-[300px]">
        <div className="text-3xl font-bold text-yellow-300 mb-2">{teamBName}</div>
        <div className="text-8xl font-black text-white">{teamBScore}</div>
      </div>
    </div>
  );
}

