'use client';

import { useState } from 'react';

interface TeamScoringProps {
  onScoreUpdate?: (teamA: number, teamB: number) => void;
}

export function TeamScoring({ onScoreUpdate }: TeamScoringProps) {
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');
  const [isEditing, setIsEditing] = useState(false);

  const incrementTeamA = () => {
    const newScore = teamAScore + 1;
    setTeamAScore(newScore);
    onScoreUpdate?.(newScore, teamBScore);
  };

  const incrementTeamB = () => {
    const newScore = teamBScore + 1;
    setTeamBScore(newScore);
    onScoreUpdate?.(teamAScore, newScore);
  };

  const decrementTeamA = () => {
    const newScore = Math.max(0, teamAScore - 1);
    setTeamAScore(newScore);
    onScoreUpdate?.(newScore, teamBScore);
  };

  const decrementTeamB = () => {
    const newScore = Math.max(0, teamBScore - 1);
    setTeamBScore(newScore);
    onScoreUpdate?.(teamAScore, newScore);
  };

  const reset = () => {
    setTeamAScore(0);
    setTeamBScore(0);
    onScoreUpdate?.(0, 0);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-white/50">Teams</div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-white/50 hover:text-white"
        >
          {isEditing ? '✓' : '✏️'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Team A */}
        <div className="bg-blue-500/20 rounded-lg p-2 text-center">
          {isEditing ? (
            <input
              type="text"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              className="w-full bg-gray-700 text-white text-center rounded px-1 py-0.5 mb-1 text-xs"
            />
          ) : (
            <div className="text-xs font-semibold text-blue-300 mb-1">{teamAName}</div>
          )}
          <div className="text-3xl font-bold text-white mb-1">{teamAScore}</div>
          <div className="flex gap-1">
            <button
              onClick={decrementTeamA}
              className="flex-1 py-1 bg-red-500/50 hover:bg-red-500 rounded text-white text-xs font-bold"
            >
              -
            </button>
            <button
              onClick={incrementTeamA}
              className="flex-1 py-1 bg-green-500/50 hover:bg-green-500 rounded text-white text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Team B */}
        <div className="bg-yellow-500/20 rounded-lg p-2 text-center">
          {isEditing ? (
            <input
              type="text"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              className="w-full bg-gray-700 text-white text-center rounded px-1 py-0.5 mb-1 text-xs"
            />
          ) : (
            <div className="text-xs font-semibold text-yellow-300 mb-1">{teamBName}</div>
          )}
          <div className="text-3xl font-bold text-white mb-1">{teamBScore}</div>
          <div className="flex gap-1">
            <button
              onClick={decrementTeamB}
              className="flex-1 py-1 bg-red-500/50 hover:bg-red-500 rounded text-white text-xs font-bold"
            >
              -
            </button>
            <button
              onClick={incrementTeamB}
              className="flex-1 py-1 bg-green-500/50 hover:bg-green-500 rounded text-white text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
      >
        🔄 Reset
      </button>
    </div>
  );
}

