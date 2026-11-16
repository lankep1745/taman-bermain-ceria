import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const ASEAN_FLAGS = [
  { name: 'Indonesia', flag: '🇮🇩', capital: 'Jakarta / IKN', desc: 'Negara Kepulauan terbesar dengan semboyan Bhinneka Tunggal Ika' },
  { name: 'Malaysia', flag: '🇲🇾', capital: 'Kuala Lumpur', desc: 'Negara tetangga dengan Menara Kembar Petronas' },
  { name: 'Singapura', flag: '🇸🇬', capital: 'Singapura', desc: 'Negara pulau maju dengan patung singa Merlion' },
  { name: 'Thailand', flag: '🇹🇭', capital: 'Bangkok', desc: 'Negeri Gajah Putih yang terkenal dengan kuil indahnya' },
  { name: 'Filipina', flag: '🇵🇭', capital: 'Manila', desc: 'Negara kepulauan dengan ribuan pulau karang' },
  { name: 'Vietnam', flag: '🇻🇳', capital: 'Hanoi', desc: 'Bendera merah dengan bintang kuning besar di tengahnya' },
  { name: 'Brunei Darussalam', flag: '🇧🇳', capital: 'Bandar Seri Begawan', desc: 'Negara makmur di pesisir pulau Kalimantan' },
  { name: 'Kamboja', flag: '🇰🇭', capital: 'Phnom Penh', desc: 'Benderanya memiliki gambar candi megah Angkor Wat' },
  { name: 'Laos', flag: '🇱🇦', capital: 'Vientiane', desc: 'Negara tanpa lautan yang memiliki lingkaran putih di tengah' },
  { name: 'Myanmar', flag: '🇲🇲', capital: 'Naypyidaw', desc: 'Warna kuning, hijau, dan merah dengan bintang putih besar' },
];

export default function TebakBendera({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_tebak_bendera') || '0', 10);
  });
  const [currentCountry, setCurrentCountry] = useState(ASEAN_FLAGS[0]);
  const [options, setOptions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Tebak bendera negara sahabat kita di ASEAN!');

  const setupRound = () => {
    const chosen = ASEAN_FLAGS[Math.floor(Math.random() * ASEAN_FLAGS.length)];
    setCurrentCountry(chosen);

    const wrongList = ASEAN_FLAGS.filter(c => c.name !== chosen.name);
    const shuffledWrongs = wrongList.sort(() => 0.5 - Math.random()).slice(0, 2);
    const opts = [chosen, ...shuffledWrongs].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setFeedback(`Bendera siapakah ini? Ibu kota: ${chosen.capital}`);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleSelect = (item) => {
    if (item.name === currentCountry.name) {
      playSound('success');
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback(`Hebat! Benar sekali, ini adalah bendera ${currentCountry.name}! 🚩✨`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_tebak_bendera', newScore.toString());
      }

      if (newStreak % 5 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1500);
    } else {
      playSound('wrong');
      setFeedback(`Bukan ${item.name}. Ini adalah bendera ${currentCountry.name}! Semangat coba lagi! 💪`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-rose-100 via-orange-50 to-amber-100 rounded-3xl p-6 shadow-xl border-4 border-rose-300">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-rose-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-rose-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-rose-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-rose-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full shadow-inner mt-2 border border-rose-200">
        <span className="text-xl">🌏</span>
        <span className="font-bold text-rose-900 text-sm">
          Bendera Tertebak: <span className="text-rose-600 font-black">{streak}</span> negara
        </span>
      </div>

      <div className="flex flex-col items-center my-4">
        <div className="w-48 h-40 bg-white rounded-3xl shadow-2xl border-4 border-rose-200 flex flex-col items-center justify-center p-4 animate-pop">
          <span className="text-8xl drop-shadow-md select-none transform hover:scale-110 transition-transform">
            {currentCountry.flag}
          </span>
          <span className="text-[11px] font-bold text-gray-500 mt-2">
            Ibu Kota: <strong className="text-rose-600">{currentCountry.capital}</strong>
          </span>
        </div>

        <div className="mt-4 bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-rose-200 font-bold text-rose-900 text-center text-sm md:text-base max-w-md animate-pop">
          {feedback}
        </div>
      </div>

      <div className="w-full bg-white/90 rounded-2xl p-5 shadow-lg border-2 border-rose-200 flex flex-col items-center">
        <div className="text-rose-600 font-extrabold text-xs uppercase tracking-wider mb-3">
          Nama Negara Manakah Ini?
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className="bg-gradient-to-b from-rose-400 to-red-500 hover:from-rose-300 hover:to-red-400 active:scale-95 text-white font-black text-base md:text-lg py-4 rounded-2xl shadow-lg border-b-4 border-red-700 transition transform hover:scale-105 flex items-center justify-center text-center px-2"
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
