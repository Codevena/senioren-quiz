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
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/50">Team-Punkte</div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-white/50 hover:text-white"
        >
          {isEditing ? '✓ Fertig' : '✏️ Namen ändern'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Team A */}
        <div className="bg-blue-500/20 rounded-lg p-4 text-center">
          {isEditing ? (
            <input
              type="text"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              className="w-full bg-gray-700 text-white text-center rounded px-2 py-1 mb-2"
            />
          ) : (
            <div className="text-lg font-semibold text-blue-300 mb-2">{teamAName}</div>
          )}
          <div className="text-5xl font-bold text-white mb-3">{teamAScore}</div>
          <div className="flex gap-2">
            <button
              onClick={decrementTeamA}
              className="flex-1 py-2 bg-red-500/50 hover:bg-red-500 rounded text-white font-bold"
            >
              -
            </button>
            <button
              onClick={incrementTeamA}
              className="flex-1 py-2 bg-green-500/50 hover:bg-green-500 rounded text-white font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Team B */}
        <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
          {isEditing ? (
            <input
              type="text"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              className="w-full bg-gray-700 text-white text-center rounded px-2 py-1 mb-2"
            />
          ) : (
            <div className="text-lg font-semibold text-yellow-300 mb-2">{teamBName}</div>
          )}
          <div className="text-5xl font-bold text-white mb-3">{teamBScore}</div>
          <div className="flex gap-2">
            <button
              onClick={decrementTeamB}
              className="flex-1 py-2 bg-red-500/50 hover:bg-red-500 rounded text-white font-bold"
            >
              -
            </button>
            <button
              onClick={incrementTeamB}
              className="flex-1 py-2 bg-green-500/50 hover:bg-green-500 rounded text-white font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
      >
        🔄 Punkte zurücksetzen
      </button>
    </div>
  );
}

