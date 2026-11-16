import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

export default function BantuKupuKupu({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_bantu_kupu_kupu') || '0', 10);
  });
  const [flowerA, setFlowerA] = useState({ petals: 5, color: 'bg-rose-400' });
  const [flowerB, setFlowerB] = useState({ petals: 8, color: 'bg-amber-400' });
  const [butterflyTarget, setButterflyTarget] = useState('center');
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Bantu kupu-kupu terbang ke bunga dengan kelopak terbanyak!');

  const setupRound = () => {
    setButterflyTarget('center');
    let pA = Math.floor(Math.random() * 8) + 3; // 3 to 10
    let pB = Math.floor(Math.random() * 8) + 3;
    while (pB === pA) {
      pB = Math.floor(Math.random() * 8) + 3;
    }
    setFlowerA({ petals: pA, color: 'from-rose-400 to-pink-500' });
    setFlowerB({ petals: pB, color: 'from-amber-400 to-yellow-500' });
    setFeedback('Bunga mana yang memiliki kelopak lebih banyak? 🌸🌻');
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handlePickFlower = (choice) => {
    const isACorrect = flowerA.petals > flowerB.petals;
    const isChosenCorrect = (choice === 'A' && isACorrect) || (choice === 'B' && !isACorrect);

    if (isChosenCorrect) {
      playSound('success');
      setButterflyTarget(choice);
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      const winnerPetals = Math.max(flowerA.petals, flowerB.petals);
      setFeedback(`HOREEE! Kupu-kupu senang sekali di bunga dengan ${winnerPetals} kelopak! 🦋🌺`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_bantu_kupu_kupu', newScore.toString());
      }

      if (newStreak % 4 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1500);
    } else {
      playSound('wrong');
      setFeedback('Ups, bunga pilihanmu kelopaknya lebih sedikit. Coba hitung teliti lagi ya! 🔍');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-teal-100 via-sky-50 to-emerald-100 rounded-3xl p-6 shadow-xl border-4 border-teal-300">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-teal-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-teal-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-teal-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-teal-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full shadow-inner mt-2 border border-teal-200">
        <span className="text-xl">🌸</span>
        <span className="font-bold text-teal-900 text-sm">
          Bunga Dihinggapi: <span className="text-teal-600 font-black">{streak}</span> kali
        </span>
      </div>

      {/* Garden Canvas with Animated Butterfly and 2 Flowers */}
      <div className="w-full h-72 bg-gradient-to-b from-sky-200 via-emerald-100 to-green-200 rounded-3xl shadow-inner border-4 border-teal-200 relative overflow-hidden flex items-center justify-around p-4 my-2">
        {/* Animated Butterfly */}
        <div
          className={`absolute text-6xl select-none transition-all duration-700 z-20 ${
            butterflyTarget === 'center'
              ? 'top-4 left-1/2 -translate-x-1/2 animate-bounce'
              : butterflyTarget === 'A'
              ? 'bottom-20 left-16 scale-125'
              : 'bottom-20 right-16 scale-125'
          }`}
        >
          🦋
        </div>

        {/* Flower A */}
        <div
          onClick={() => handlePickFlower('A')}
          className="cursor-pointer group flex flex-col items-center select-none transform transition-transform hover:scale-105 active:scale-95"
        >
          <div className="w-32 h-36 bg-white/90 rounded-3xl p-3 shadow-xl border-4 border-pink-300 flex flex-col items-center justify-between">
            <span className="text-xs uppercase font-black text-pink-700">Taman Bunga A</span>
            <div className="flex flex-wrap justify-center gap-1.5 my-1">
              {Array.from({ length: flowerA.petals }).map((_, i) => (
                <span key={i} className="text-xl md:text-2xl animate-pop">
                  🌸
                </span>
              ))}
            </div>
            <span className="bg-pink-100 text-pink-800 font-black text-sm px-3 py-0.5 rounded-full border border-pink-300">
              {flowerA.petals} Kelopak
            </span>
          </div>
          <button className="mt-2 bg-pink-500 hover:bg-pink-600 text-white font-black text-xs px-4 py-1.5 rounded-full shadow transition">
            Pilih Bunga A ➔
          </button>
        </div>

        {/* VS Badge */}
        <div className="bg-white/80 text-teal-800 font-black text-sm px-3 py-1.5 rounded-full shadow border border-teal-300">
          Lebih Banyak?
        </div>

        {/* Flower B */}
        <div
          onClick={() => handlePickFlower('B')}
          className="cursor-pointer group flex flex-col items-center select-none transform transition-transform hover:scale-105 active:scale-95"
        >
          <div className="w-32 h-36 bg-white/90 rounded-3xl p-3 shadow-xl border-4 border-amber-300 flex flex-col items-center justify-between">
            <span className="text-xs uppercase font-black text-amber-700">Taman Bunga B</span>
            <div className="flex flex-wrap justify-center gap-1.5 my-1">
              {Array.from({ length: flowerB.petals }).map((_, i) => (
                <span key={i} className="text-xl md:text-2xl animate-pop">
                  🌻
                </span>
              ))}
            </div>
            <span className="bg-amber-100 text-amber-800 font-black text-sm px-3 py-0.5 rounded-full border border-amber-300">
              {flowerB.petals} Kelopak
            </span>
          </div>
          <button className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-4 py-1.5 rounded-full shadow transition">
            Pilih Bunga B ➔
          </button>
        </div>
      </div>

      <div className="w-full bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-teal-200 font-bold text-teal-950 text-center text-sm md:text-base max-w-md animate-pop">
        {feedback}
      </div>
    </div>
  );
}
