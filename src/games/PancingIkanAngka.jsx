import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

export default function PancingIkanAngka({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_pancing_ikan') || '0', 10);
  });
  const [factor1, setFactor1] = useState(2);
  const [factor2, setFactor2] = useState(3);
  const [fishList, setFishList] = useState([]);
  const [caughtFish, setCaughtFish] = useState(null);
  const [fishCaughtTotal, setFishCaughtTotal] = useState(0);
  const [feedback, setFeedback] = useState('Kail ikan yang membawa angka hasil perkalian!');

  const FISH_TYPES = [
    { emoji: '🐟', color: 'from-blue-400 to-cyan-500' },
    { emoji: '🐠', color: 'from-amber-400 to-orange-500' },
    { emoji: '🐡', color: 'from-yellow-400 to-amber-500' },
    { emoji: '🦈', color: 'from-teal-400 to-emerald-500' },
  ];

  const setupRound = () => {
    setCaughtFish(null);
    const f1 = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const f2 = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const correctAns = f1 * f2;
    setFactor1(f1);
    setFactor2(f2);

    const answers = new Set([correctAns]);
    while (answers.size < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
      const wrong = Math.max(1, correctAns + delta);
      answers.add(wrong);
    }

    const shuffled = Array.from(answers).sort(() => Math.random() - 0.5).map((num, i) => ({
      id: i,
      number: num,
      ...FISH_TYPES[i % FISH_TYPES.length]
    }));

    setFishList(shuffled);
    setFeedback(`Kail ikan dengan angka hasil dari ${f1} × ${f2}! 🎣`);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleCatchFish = (fish) => {
    const target = factor1 * factor2;
    if (fish.number === target) {
      playSound('success');
      setCaughtFish(fish);
      const newScore = score + 15;
      const newTotal = fishCaughtTotal + 1;
      setScore(newScore);
      setFishCaughtTotal(newTotal);
      setFeedback(`HOREEE! Ikan ${fish.emoji} (${fish.number}) berhasil dipancing! 🎣✨`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_pancing_ikan', newScore.toString());
      }

      if (newTotal % 5 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1500);
    } else {
      playSound('wrong');
      setFeedback(`Aduh, ${fish.number} bukan hasil dari ${factor1} × ${factor2}. Coba ikan lain! 🌊`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-cyan-100 via-sky-50 to-blue-200 rounded-3xl p-6 shadow-xl border-4 border-cyan-300">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-cyan-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-cyan-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-cyan-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-cyan-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full shadow-inner mt-2 border border-cyan-300">
        <span className="text-xl">🪣</span>
        <span className="font-bold text-cyan-900 text-sm">
          Ikan Tertangkap: <span className="text-blue-600 font-black">{fishCaughtTotal}</span> ekor
        </span>
      </div>

      <div className="my-2 bg-white/90 px-8 py-3 rounded-2xl shadow-lg border-2 border-dashed border-cyan-400 flex items-center gap-3 text-3xl md:text-4xl font-black text-gray-800">
        <span className="text-amber-500">🎣</span>
        <span className="text-blue-600">{factor1}</span>
        <span className="text-rose-500">×</span>
        <span className="text-purple-600">{factor2}</span>
        <span className="text-gray-400">=</span>
        <span className="text-cyan-600 animate-pulse">?</span>
      </div>

      <div className="w-full h-64 bg-gradient-to-b from-sky-300 to-blue-500 rounded-3xl p-4 shadow-inner border-4 border-cyan-200 relative overflow-hidden flex flex-wrap items-center justify-around gap-4 my-2">
        <div className="absolute top-2 left-6 text-xl opacity-50 animate-bounce">🫧</div>
        <div className="absolute bottom-4 right-8 text-2xl opacity-50 animate-bounce-slow">🫧</div>

        {fishList.map((fish) => {
          const isCaught = caughtFish && caughtFish.id === fish.id;
          return (
            <div
              key={fish.id}
              onClick={() => handleCatchFish(fish)}
              className={`cursor-pointer group flex flex-col items-center select-none transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isCaught ? '-translate-y-8 animate-bounce' : 'animate-pulse'
              }`}
            >
              <div className="relative">
                <span className="text-6xl md:text-7xl filter drop-shadow-md">
                  {fish.emoji}
                </span>
                <span className="absolute -top-1 -right-2 bg-white text-blue-900 font-black text-base px-2 py-0.5 rounded-full shadow-lg border-2 border-blue-400">
                  {fish.number}
                </span>
              </div>
              <span className="text-xs text-white font-extrabold drop-shadow mt-1 group-hover:text-yellow-200">
                Pancing Ini! 🪝
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-cyan-300 font-bold text-cyan-900 text-center text-sm md:text-base max-w-md animate-pop">
        {feedback}
      </div>
    </div>
  );
}
