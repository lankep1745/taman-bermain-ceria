import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

export default function LompatKatak({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_lompat_katak') || '0', 10);
  });
  const [mode, setMode] = useState('genap'); // 'genap' or 'ganjil'
  const [currentNum, setCurrentNum] = useState(2);
  const [options, setOptions] = useState([]);
  const [jumpCount, setJumpCount] = useState(0);
  const [frogPosition, setFrogPosition] = useState('center');
  const [feedback, setFeedback] = useState('Lompat ke daun teratai berikutnya!');

  const setupRound = (lastNum = null, currentMode = null) => {
    const activeMode = currentMode || (Math.random() > 0.5 ? 'genap' : 'ganjil');
    setMode(activeMode);

    let base = lastNum;
    if (base === null) {
      base = activeMode === 'genap' ? 2 : 1;
    }
    setCurrentNum(base);

    const nextCorrect = base + 2;

    // generate 3 choices
    const opts = new Set([nextCorrect]);
    while (opts.size < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      const fake = Math.max(1, nextCorrect + offset);
      if (fake !== nextCorrect) {
        opts.add(fake);
      }
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setFeedback(`Pola bilangan ${activeMode.toUpperCase()}: Cari angka setelah ${base}!`);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleJump = (chosenNumber, index) => {
    const nextCorrect = currentNum + 2;

    if (chosenNumber === nextCorrect) {
      playSound('jump');
      setFrogPosition(index === 0 ? 'left' : index === 1 ? 'center' : 'right');
      const newScore = score + 10;
      const newJumps = jumpCount + 1;
      setScore(newScore);
      setJumpCount(newJumps);
      setFeedback(`KROOK! Lompatan hebat ke angka ${chosenNumber}! 🐸✨`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_lompat_katak', newScore.toString());
      }

      if (newJumps % 5 === 0) {
        triggerConfetti();
        playSound('success');
        setFeedback(`HOREEE! Katak berhasil menyeberangi danau teratai! 🏆🪷`);
      }

      setTimeout(() => {
        setupRound(chosenNumber, mode);
        setFrogPosition('center');
      }, 700);
    } else {
      playSound('wrong');
      setFeedback(`Aduh! ${chosenNumber} bukan kelanjutan pola ${mode.toUpperCase()} (+2)! 💦`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-sky-200 via-teal-100 to-emerald-200 rounded-3xl p-6 shadow-xl border-4 border-emerald-400">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-emerald-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-emerald-300"
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

      {/* Mode & Streak badge */}
      <div className="flex items-center gap-3 my-2">
        <div className="bg-emerald-600 text-white font-black text-sm px-4 py-1.5 rounded-full shadow">
          Pola: Bilangan {mode.toUpperCase()} (+2)
        </div>
        <div className="bg-white/80 text-emerald-900 font-extrabold text-sm px-4 py-1.5 rounded-full shadow border border-emerald-300">
          Lompatan: <span className="text-emerald-700 font-black">{jumpCount}</span> 🪷
        </div>
      </div>

      {/* Pond Area with Animated Frog & Lily Pads */}
      <div className="w-full relative bg-gradient-to-b from-blue-300 to-cyan-400 rounded-3xl p-6 shadow-inner border-4 border-cyan-200 overflow-hidden my-3 flex flex-col items-center justify-between h-72">
        {/* Floating water details */}
        <div className="absolute top-3 left-6 text-2xl opacity-40 animate-pulse">💧</div>
        <div className="absolute top-10 right-8 text-2xl opacity-40 animate-pulse">💧</div>
        <div className="absolute bottom-4 left-12 text-2xl opacity-30">🌊</div>

        {/* Current Leaf (Starting point) */}
        <div className="flex flex-col items-center relative z-10">
          <div className="w-24 h-16 bg-emerald-600 border-4 border-emerald-400 rounded-full flex flex-col items-center justify-center shadow-lg relative">
            <span className="text-white font-black text-xl drop-shadow">{currentNum}</span>
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Mulai</span>

            {/* Katak Visual */}
            <div
              className={`absolute -top-10 text-5xl transition-all duration-300 transform ${
                frogPosition === 'center' ? 'scale-100' : 'scale-90 opacity-70'
              } animate-bounce-slow`}
            >
              🐸
            </div>
          </div>
        </div>

        {/* Target Next Lily Pads (Floating in Pond) */}
        <div className="w-full flex justify-around items-end z-10 pt-4">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleJump(opt, idx)}
              className="group cursor-pointer flex flex-col items-center transform transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              <div className="text-3xl mb-1 group-hover:-translate-y-2 transition-transform">
                🪷
              </div>
              <div className="w-20 h-14 bg-emerald-500 hover:bg-emerald-400 border-4 border-emerald-300 text-white font-black text-2xl rounded-full flex items-center justify-center shadow-xl">
                {opt}
              </div>
              <span className="text-xs text-white font-extrabold mt-1 drop-shadow">
                Pilih Ini
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Speech feedback dialog */}
      <div className="w-full bg-white/95 px-6 py-3 rounded-2xl shadow-md border-2 border-emerald-300 font-bold text-emerald-800 text-center text-sm md:text-base max-w-md animate-pop">
        {feedback}
      </div>

      {/* Mode switch helper buttons */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => setupRound(2, 'genap')}
          className={`px-4 py-2 rounded-full font-black text-xs shadow transition ${
            mode === 'genap'
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
              : 'bg-white text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Pola Genap (2, 4, 6...)
        </button>
        <button
          onClick={() => setupRound(1, 'ganjil')}
          className={`px-4 py-2 rounded-full font-black text-xs shadow transition ${
            mode === 'ganjil'
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
              : 'bg-white text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Pola Ganjil (1, 3, 5...)
        </button>
      </div>
    </div>
  );
}
