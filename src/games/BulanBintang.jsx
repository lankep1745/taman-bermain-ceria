import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const DAY_NIGHT_ITEMS = [
  { name: 'Sekolah Ceria', emoji: '🎒', time: 'siang', desc: 'Anak-anak belajar di kelas saat terang' },
  { name: 'Tidur Lelap', emoji: '🛌', time: 'malam', desc: 'Istirahat pulas bermimpi indah di ranjang' },
  { name: 'Matahari Bersinar', emoji: '🌞', time: 'siang', desc: 'Menyinari bumi dengan hangat' },
  { name: 'Bintang Berkedip', emoji: '⭐', time: 'malam', desc: 'Kelap-kelip indah di langit gelap' },
  { name: 'Bermain di Lapangan', emoji: '⚽', time: 'siang', desc: 'Berolahraga ceria bersama teman' },
  { name: 'Burung Hantu', emoji: '🦉', time: 'malam', desc: 'Hewan nokturnal yang bangun di kegelapan' },
  { name: 'Pelangi Indah', emoji: '🌈', time: 'siang', desc: 'Muncul saat hujan reda disinari matahari' },
  { name: 'Bulan Sabit', emoji: '🌙', time: 'malam', desc: 'Menerangi malam dengan cahaya lembut' },
  { name: 'Kupu-kupu Menari', emoji: '🦋', time: 'siang', desc: 'Hinggap di bunga mekar pada siang hari' },
  { name: 'Lampu Tidur', emoji: '🛋️', time: 'malam', desc: 'Menerangi kamar sebelum terlelap' },
];

export default function BulanBintang({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_bulan_bintang') || '0', 10);
  });
  const [currentItem, setCurrentItem] = useState(DAY_NIGHT_ITEMS[0]);
  const [sortedCount, setSortedCount] = useState(0);
  const [feedback, setFeedback] = useState('Pilih apakah benda ini cocok untuk SIANG atau MALAM!');

  const setupRound = () => {
    const random = DAY_NIGHT_ITEMS[Math.floor(Math.random() * DAY_NIGHT_ITEMS.length)];
    setCurrentItem(random);
    setFeedback(`Apakah "${random.name}" terjadi saat Siang atau Malam?`);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleClassify = (targetTime) => {
    if (currentItem.time === targetTime) {
      playSound('success');
      const newScore = score + 10;
      const newTotal = sortedCount + 1;
      setScore(newScore);
      setSortedCount(newTotal);
      setFeedback(`Benar! ${currentItem.name} memang aktivitas waktu ${targetTime.toUpperCase()}! 👏`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_bulan_bintang', newScore.toString());
      }

      if (newTotal % 5 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1400);
    } else {
      playSound('wrong');
      setFeedback(`Kurang tepat, ${currentItem.name} biasanya terjadi pada waktu ${currentItem.time.toUpperCase()}! ☀️🌙`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-sky-200 via-indigo-100 to-purple-200 rounded-3xl p-6 shadow-xl border-4 border-indigo-300">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-indigo-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-indigo-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-indigo-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-indigo-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full shadow-inner mt-2 border border-indigo-200">
        <span className="text-xl">✨</span>
        <span className="font-bold text-indigo-900 text-sm">
          Aktivitas Dikelompokkan:{' '}
          <span className="text-indigo-600 font-black">{sortedCount}</span>
        </span>
      </div>

      <div className="flex flex-col items-center my-4">
        <div className="w-44 h-44 bg-white/95 rounded-3xl shadow-xl border-4 border-white flex flex-col items-center justify-center p-3 animate-pop">
          <span className="text-7xl mb-1 filter drop-shadow">{currentItem.emoji}</span>
          <span className="font-black text-gray-800 text-lg text-center leading-tight">
            {currentItem.name}
          </span>
          <span className="text-[11px] text-gray-500 font-semibold text-center mt-1">
            {currentItem.desc}
          </span>
        </div>

        <div className="mt-3 bg-white/95 px-6 py-2 rounded-2xl shadow-md border-2 border-indigo-200 font-bold text-indigo-800 text-center text-sm md:text-base max-w-md animate-pop">
          {feedback}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
        <button
          onClick={() => handleClassify('siang')}
          className="bg-gradient-to-b from-amber-300 via-yellow-400 to-orange-400 hover:from-amber-200 hover:to-orange-300 active:scale-95 text-white rounded-3xl p-5 shadow-xl border-4 border-yellow-200 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
        >
          <span className="text-6xl animate-bounce-slow mb-1">☀️</span>
          <span className="font-black text-2xl text-yellow-950">SIANG HARI</span>
          <span className="text-xs text-yellow-900 font-bold mt-1">
            Terang Benderang & Berenergi
          </span>
        </button>

        <button
          onClick={() => handleClassify('malam')}
          className="bg-gradient-to-b from-indigo-700 via-purple-800 to-slate-900 hover:from-indigo-600 hover:to-purple-700 active:scale-95 text-white rounded-3xl p-5 shadow-xl border-4 border-purple-400 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
        >
          <span className="text-6xl animate-pulse mb-1">🌙</span>
          <span className="font-black text-2xl text-yellow-300">MALAM HARI</span>
          <span className="text-xs text-purple-200 font-bold mt-1">
            Penuh Bintang & Waktu Istirahat
          </span>
        </button>
      </div>
    </div>
  );
}
