import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const TRASH_ITEMS = [
  { id: 1, name: 'Daun Kering', emoji: '🍂', type: 'organik', color: 'from-amber-100 to-amber-200' },
  { id: 2, name: 'Kulit Pisang', emoji: '🍌', type: 'organik', color: 'from-yellow-100 to-yellow-200' },
  { id: 3, name: 'Apel Sisa', emoji: '🍏', type: 'organik', color: 'from-emerald-100 to-emerald-200' },
  { id: 4, name: 'Ranting Kayu', emoji: '🪵', type: 'organik', color: 'from-amber-200 to-stone-300' },
  { id: 5, name: 'Sisa Sayur', emoji: '🥬', type: 'organik', color: 'from-green-100 to-emerald-200' },
  { id: 6, name: 'Botol Plastik', emoji: '🧴', type: 'anorganik', color: 'from-sky-100 to-blue-200' },
  { id: 7, name: 'Kaleng Minuman', emoji: '🥫', type: 'anorganik', color: 'from-rose-100 to-red-200' },
  { id: 8, name: 'Kantong Kresek', emoji: '🛍️', type: 'anorganik', color: 'from-purple-100 to-indigo-200' },
  { id: 9, name: 'Gelas Plastik', emoji: '🥤', type: 'anorganik', color: 'from-cyan-100 to-teal-200' },
  { id: 10, name: 'Bungkus Snack', emoji: '🍬', type: 'anorganik', color: 'from-pink-100 to-rose-200' },
];

export default function PahlawanSampah({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_pahlawan_sampah') || '0', 10);
  });
  const [currentItem, setCurrentItem] = useState(TRASH_ITEMS[0]);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [feedback, setFeedback] = useState('Tarik sampah ke tong yang cocok atau tekan tombol!');
  const [isDragging, setIsDragging] = useState(false);

  const getNewItem = () => {
    const random = TRASH_ITEMS[Math.floor(Math.random() * TRASH_ITEMS.length)];
    setCurrentItem(random);
  };

  useEffect(() => {
    getNewItem();
  }, []);

  const handleSort = (targetType) => {
    if (currentItem.type === targetType) {
      playSound('drop');
      const newScore = score + 10;
      const newCount = itemsSorted + 1;
      setScore(newScore);
      setItemsSorted(newCount);

      setFeedback(`Hebat! ${currentItem.name} masuk tong ${targetType.toUpperCase()}! 👏`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_pahlawan_sampah', newScore.toString());
      }

      if (newCount % 5 === 0) {
        triggerConfetti();
        playSound('success');
      }

      getNewItem();
    } else {
      playSound('wrong');
      setFeedback(`Aduh keliru! ${currentItem.name} adalah sampah ${currentItem.type.toUpperCase()}! ⚠️`);
    }
  };

  // Drag and drop handlers
  const onDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', currentItem.type);
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, binType) => {
    e.preventDefault();
    setIsDragging(false);
    handleSort(binType);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-teal-100 to-emerald-200 rounded-3xl p-6 shadow-xl border-4 border-teal-300">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-teal-700 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-teal-200"
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

      {/* Mascot Mission Intro */}
      <div className="flex items-center gap-2 bg-white/70 px-4 py-1.5 rounded-full shadow-inner mt-2 border border-teal-200">
        <span className="text-xl">🌱</span>
        <span className="font-bold text-teal-800 text-sm">
          Total Sampah Dipilah: <span className="text-emerald-600 font-extrabold text-base">{itemsSorted}</span>
        </span>
      </div>

      {/* Trash Item to Sort */}
      <div className="flex flex-col items-center my-4">
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className={`cursor-grab active:cursor-grabbing w-40 h-40 bg-gradient-to-br ${currentItem.color} rounded-3xl shadow-xl border-4 border-white flex flex-col items-center justify-center p-3 select-none transition-transform duration-200 transform hover:scale-105 ${
            isDragging ? 'opacity-50 scale-95' : 'animate-pop'
          }`}
        >
          <span className="text-7xl mb-1 filter drop-shadow-md">{currentItem.emoji}</span>
          <span className="font-extrabold text-gray-800 text-sm text-center leading-tight">
            {currentItem.name}
          </span>
          <span className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Tarik Aku!</span>
        </div>

        {/* Feedback message */}
        <div className="mt-3 bg-white/95 px-5 py-2 rounded-2xl shadow-md border-2 border-teal-200 font-bold text-teal-800 text-center text-sm max-w-md animate-pop">
          {feedback}
        </div>
      </div>

      {/* Two Waste Bins (Dropzones) */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
        {/* Organik Bin */}
        <div
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, 'organik')}
          onClick={() => handleSort('organik')}
          className="cursor-pointer bg-gradient-to-b from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 active:scale-95 text-white rounded-3xl p-5 shadow-xl border-4 border-green-300 flex flex-col items-center justify-between transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            Organik (Daun & Makanan)
          </div>
          <div className="text-6xl md:text-7xl my-1 animate-bounce-slow">
            🗑️
          </div>
          <div className="text-center">
            <h4 className="font-black text-xl md:text-2xl text-yellow-300">TONG HIJAU</h4>
            <p className="text-xs text-white/90 font-semibold mt-1">
              Mudah busuk & terurai tanah
            </p>
          </div>
          <button className="mt-3 bg-white text-green-700 font-black text-xs md:text-sm px-4 py-1.5 rounded-full shadow hover:bg-yellow-200">
            Pilih Organik ➔
          </button>
        </div>

        {/* Anorganik Bin */}
        <div
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, 'anorganik')}
          onClick={() => handleSort('anorganik')}
          className="cursor-pointer bg-gradient-to-b from-amber-400 to-orange-600 hover:from-amber-500 hover:to-orange-700 active:scale-95 text-white rounded-3xl p-5 shadow-xl border-4 border-amber-300 flex flex-col items-center justify-between transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            Anorganik (Plastik & Logam)
          </div>
          <div className="text-6xl md:text-7xl my-1 animate-bounce-slow">
            🚮
          </div>
          <div className="text-center">
            <h4 className="font-black text-xl md:text-2xl text-yellow-200">TONG KUNING</h4>
            <p className="text-xs text-white/90 font-semibold mt-1">
              Daur ulang botol & kaleng
            </p>
          </div>
          <button className="mt-3 bg-white text-orange-700 font-black text-xs md:text-sm px-4 py-1.5 rounded-full shadow hover:bg-yellow-200">
            Pilih Anorganik ➔
          </button>
        </div>
      </div>
    </div>
  );
}
