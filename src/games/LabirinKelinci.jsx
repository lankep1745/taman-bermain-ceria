import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const GRID_SIZE = 6;

// Predefined obstacle sets to guarantee solvable maze
const MAZE_OBSTACLES = [
  ['1-0', '1-2', '2-2', '3-2', '4-2', '3-4', '1-4'],
  ['0-2', '2-0', '2-1', '2-3', '3-3', '4-1', '4-4'],
  ['1-1', '1-3', '2-4', '3-1', '4-3', '4-4', '3-5'],
];

export default function LabirinKelinci({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_labirin_kelinci') || '0', 10);
  });
  const [rabbitPos, setRabbitPos] = useState({ r: 0, c: 0 });
  const [targetPos, setTargetPos] = useState({ r: 5, c: 5 });
  const [obstacles, setObstacles] = useState(new Set(MAZE_OBSTACLES[0]));
  const [carrotsCollected, setCarrotsCollected] = useState(0);
  const [feedback, setFeedback] = useState('Gunakan tombol panah untuk memandu kelinci menuju wortel!');

  const setupRound = () => {
    setRabbitPos({ r: 0, c: 0 });
    setTargetPos({ r: 5, c: 5 });
    const randomSet = MAZE_OBSTACLES[Math.floor(Math.random() * MAZE_OBSTACLES.length)];
    setObstacles(new Set(randomSet));
    setFeedback('Ayo kelinci manis, cari jalan menuju wortel lezat! 🥕');
  };

  useEffect(() => {
    setupRound();
  }, []);

  const moveRabbit = (dr, dc) => {
    const nextR = rabbitPos.r + dr;
    const nextC = rabbitPos.c + dc;

    // Check bounds
    if (nextR < 0 || nextR >= GRID_SIZE || nextC < 0 || nextC >= GRID_SIZE) {
      playSound('wrong');
      setFeedback('Aduh, kelinci menabrak pagar tepi kebun! 🌿');
      return;
    }

    // Check obstacle
    const key = `${nextR}-${nextC}`;
    if (obstacles.has(key)) {
      playSound('wrong');
      setFeedback('Aduh, ada batu besar menghalangi jalan kelinci! 🪨');
      return;
    }

    playSound('jump');
    setRabbitPos({ r: nextR, c: nextC });

    // Check win condition
    if (nextR === targetPos.r && nextC === targetPos.c) {
      playSound('chomp');
      const newScore = score + 20;
      const newCarrots = carrotsCollected + 1;
      setScore(newScore);
      setCarrotsCollected(newCarrots);
      setFeedback('NYAM NYAM! Kelinci berhasil memakan wortel! Horeee! 🥕🎉');

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_labirin_kelinci', newScore.toString());
      }

      if (newCarrots % 3 === 0) {
        triggerConfetti();
        playSound('success');
      }

      setTimeout(() => {
        setupRound();
      }, 1500);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') moveRabbit(-1, 0);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') moveRabbit(1, 0);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveRabbit(0, -1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRabbit(0, 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rabbitPos, obstacles, targetPos]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-emerald-100 via-green-50 to-teal-100 rounded-3xl p-6 shadow-xl border-4 border-emerald-300">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-emerald-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-emerald-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-emerald-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-emerald-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full shadow-inner mt-2 border border-emerald-300">
        <span className="text-xl">🥕</span>
        <span className="font-bold text-emerald-900 text-sm">
          Wortel Didapat: <span className="text-orange-600 font-black">{carrotsCollected}</span> buah
        </span>
      </div>

      {/* 6x6 Maze Grid */}
      <div className="p-3 bg-emerald-700 rounded-3xl shadow-xl border-4 border-emerald-500 my-2">
        <div className="grid grid-cols-6 gap-1.5 bg-emerald-900 p-2 rounded-2xl">
          {Array.from({ length: GRID_SIZE }).map((_, r) =>
            Array.from({ length: GRID_SIZE }).map((_, c) => {
              const isRabbit = rabbitPos.r === r && rabbitPos.c === c;
              const isTarget = targetPos.r === r && targetPos.c === c;
              const isObstacle = obstacles.has(`${r}-${c}`);

              return (
                <div
                  key={`${r}-${c}`}
                  className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl md:text-3xl relative shadow-inner select-none transition-all"
                >
                  {isRabbit && <span className="animate-bounce">🐰</span>}
                  {isTarget && !isRabbit && <span className="animate-pulse">🥕</span>}
                  {isObstacle && <span>🪨</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Feedback dialog */}
      <div className="w-full bg-white/95 px-6 py-2 rounded-2xl shadow-md border-2 border-emerald-300 font-bold text-emerald-950 text-center text-sm max-w-md animate-pop">
        {feedback}
      </div>

      {/* D-Pad Navigation Buttons */}
      <div className="flex flex-col items-center gap-1.5 my-2">
        <button
          onClick={() => moveRabbit(-1, 0)}
          className="w-14 h-12 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-md border-b-4 border-emerald-700 flex items-center justify-center transition"
        >
          ⬆️
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => moveRabbit(0, -1)}
            className="w-14 h-12 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-md border-b-4 border-emerald-700 flex items-center justify-center transition"
          >
            ⬅️
          </button>
          <button
            onClick={() => moveRabbit(1, 0)}
            className="w-14 h-12 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-md border-b-4 border-emerald-700 flex items-center justify-center transition"
          >
            ⬇️
          </button>
          <button
            onClick={() => moveRabbit(0, 1)}
            className="w-14 h-12 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-md border-b-4 border-emerald-700 flex items-center justify-center transition"
          >
            ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
