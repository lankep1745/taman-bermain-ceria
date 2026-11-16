import React, { useState, useEffect, useRef } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const BLOCK_COLORS = [
  'bg-red-400 border-red-600',
  'bg-orange-400 border-orange-600',
  'bg-amber-400 border-amber-600',
  'bg-emerald-400 border-emerald-600',
  'bg-teal-400 border-teal-600',
  'bg-sky-400 border-sky-600',
  'bg-indigo-400 border-indigo-600',
  'bg-purple-400 border-purple-600',
  'bg-pink-400 border-pink-600',
];

export default function SusunMenara({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_susun_menara') || '0', 10);
  });
  const [towerHeight, setTowerHeight] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [sliderPos, setSliderPos] = useState(50); // percentage 10 to 90
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedback, setFeedback] = useState('Tekan "JATUHKAN" tepat saat balok berada di tengah!');

  // Moving slider animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSliderPos((pos) => {
        let next = pos + direction * 2.5;
        if (next >= 85) {
          setDirection(-1);
          return 85;
        }
        if (next <= 15) {
          setDirection(1);
          return 15;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [direction, isPlaying]);

  const handleDropBlock = () => {
    if (!isPlaying) return;

    // Tolerance zone: center is 50%, acceptable is 30% to 70%
    const diff = Math.abs(sliderPos - 50);

    if (diff < 25) {
      playSound('drop');
      const newHeight = towerHeight + 1;
      const newScore = score + 20;
      setTowerHeight(newHeight);
      setScore(newScore);

      const color = BLOCK_COLORS[newHeight % BLOCK_COLORS.length];
      setBlocks(prev => [{ id: newHeight, color, offset: sliderPos - 50 }, ...prev]);

      setFeedback(`KEREN! Balok bertumpuk rapi! Menara setinggi ${newHeight} lantai! 🏗️✨`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_susun_menara', newScore.toString());
      }

      if (newHeight % 6 === 0) {
        triggerConfetti();
        playSound('success');
      }
    } else {
      playSound('wrong');
      setFeedback('Aduh, balok miring dan jatuh ke samping! Coba lagi dari awal ya! 🏗️');
      setIsPlaying(false);
    }
  };

  const resetGame = () => {
    playSound('click');
    setTowerHeight(0);
    setBlocks([]);
    setSliderPos(50);
    setDirection(1);
    setIsPlaying(true);
    setFeedback('Mulai menyusun menara balok dari lantai pertama!');
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-orange-100 via-amber-50 to-yellow-100 rounded-3xl p-6 shadow-xl border-4 border-orange-300">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-orange-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-orange-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-orange-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-orange-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 my-2">
        <div className="bg-white/80 text-orange-900 font-extrabold text-sm px-4 py-1.5 rounded-full shadow border border-orange-300">
          Tinggi Menara: <span className="text-orange-600 font-black">{towerHeight}</span> Lantai 🏢
        </div>
        <button
          onClick={resetGame}
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow transition"
        >
          🔄 Ulang Menara
        </button>
      </div>

      {/* Tower Building Canvas */}
      <div className="w-full h-72 bg-gradient-to-b from-sky-200 to-amber-100 rounded-3xl shadow-inner border-4 border-orange-200 relative overflow-hidden flex flex-col justify-between p-4 my-2">
        {/* Moving Crane / Upper Block */}
        {isPlaying ? (
          <div className="relative w-full h-12">
            <div
              className="absolute -top-1 w-20 h-10 bg-amber-500 border-4 border-amber-700 rounded-2xl shadow-lg flex items-center justify-center font-black text-white text-xs select-none transition-transform"
              style={{ left: `calc(${sliderPos}% - 40px)` }}
            >
              📦 Balok
            </div>
          </div>
        ) : (
          <div className="w-full text-center text-red-600 font-black text-base animate-pulse">
            Menara Runtuh! Tekan tombol "Ulang Menara" untuk bermain lagi!
          </div>
        )}

        {/* Stacked Blocks Base */}
        <div className="w-full flex flex-col items-center justify-end flex-1 pb-1 overflow-hidden">
          {blocks.slice(0, 6).map((block, idx) => (
            <div
              key={block.id}
              className={`w-28 h-8 rounded-xl shadow-md border-b-4 flex items-center justify-center font-black text-white text-xs ${block.color} transition-all duration-300 animate-pop`}
              style={{ transform: `translateX(${block.offset * 0.4}px)` }}
            >
              Lantai {block.id}
            </div>
          ))}

          {/* Base Foundation */}
          <div className="w-48 h-6 bg-stone-700 border-t-4 border-stone-900 rounded-t-xl shadow-lg flex items-center justify-center text-[10px] text-white font-black uppercase tracking-widest mt-0.5">
            Pondasi Kuat
          </div>
        </div>
      </div>

      <div className="w-full bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-orange-300 font-bold text-orange-950 text-center text-sm md:text-base max-w-md animate-pop">
        {feedback}
      </div>

      <button
        onClick={handleDropBlock}
        disabled={!isPlaying}
        className={`w-full max-w-md py-4 rounded-full font-black text-2xl text-white shadow-xl transition-all duration-200 transform mt-3 ${
          isPlaying
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 border-b-4 border-orange-800 hover:scale-105'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        🏗️ JATUHKAN BALOK!
      </button>
    </div>
  );
}
