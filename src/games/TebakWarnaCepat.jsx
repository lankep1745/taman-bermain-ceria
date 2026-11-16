import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const COLOR_DEFINITIONS = [
  { name: 'MERAH', textColorClass: 'text-red-500', bgClass: 'from-red-400 to-rose-500 border-red-600' },
  { name: 'BIRU', textColorClass: 'text-blue-500', bgClass: 'from-blue-400 to-indigo-500 border-blue-600' },
  { name: 'HIJAU', textColorClass: 'text-emerald-500', bgClass: 'from-emerald-400 to-green-500 border-emerald-600' },
  { name: 'KUNING', textColorClass: 'text-yellow-400', bgClass: 'from-yellow-300 to-amber-400 border-yellow-500 text-yellow-950' },
  { name: 'UNGU', textColorClass: 'text-purple-500', bgClass: 'from-purple-400 to-fuchsia-500 border-purple-600' },
  { name: 'ORANYE', textColorClass: 'text-orange-500', bgClass: 'from-orange-400 to-amber-500 border-orange-600' },
];

export default function TebakWarnaCepat({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_tebak_warna_cepat') || '0', 10);
  });
  const [textWord, setTextWord] = useState(COLOR_DEFINITIONS[0]);
  const [fontColor, setFontColor] = useState(COLOR_DEFINITIONS[1]);
  const [options, setOptions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('BACA TULISANNYA! Jangan tertipu dengan warna tintanya!');

  const setupRound = () => {
    const textTarget = COLOR_DEFINITIONS[Math.floor(Math.random() * COLOR_DEFINITIONS.length)];
    // Pick different font color to create Stroop effect
    const otherColors = COLOR_DEFINITIONS.filter(c => c.name !== textTarget.name);
    const fontTarget = otherColors[Math.floor(Math.random() * otherColors.length)];

    setTextWord(textTarget);
    setFontColor(fontTarget);

    const wrongOptions = otherColors.sort(() => 0.5 - Math.random()).slice(0, 2);
    const opts = [textTarget, ...wrongOptions].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setFeedback('Fokus: warna apakah yang TERTULIS? 🧠🎯');
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleChoose = (chosen) => {
    if (chosen.name === textWord.name) {
      playSound('success');
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback(`KONSENTRASI HEBAT! Yang tertulis adalah ${textWord.name}! 🎯✨`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_tebak_warna_cepat', newScore.toString());
      }

      if (newStreak % 5 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1200);
    } else {
      playSound('wrong');
      setFeedback(`Oops terkecoh! Yang tertulis adalah "${textWord.name}". Jangan lihat warna tintanya! 🧐`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-pink-100 via-rose-50 to-amber-100 rounded-3xl p-6 shadow-xl border-4 border-pink-300">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-pink-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-pink-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-pink-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-pink-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full shadow-inner mt-2 border border-pink-200">
        <span className="text-xl">🎯</span>
        <span className="font-bold text-pink-900 text-sm">
          Streak Konsentrasi: <span className="text-rose-600 font-black">{streak}</span> Benar
        </span>
      </div>

      {/* Stroop Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border-4 border-pink-200 flex flex-col items-center justify-center my-4 animate-pop">
        <span className="text-xs uppercase font-black text-gray-400 tracking-widest mb-1">
          Baca Tulisan Ini:
        </span>
        <span
          className={`text-5xl md:text-6xl font-black drop-shadow-sm select-none ${fontColor.textColorClass} transition-colors duration-300`}
        >
          {textWord.name}
        </span>
      </div>

      <div className="w-full bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-pink-200 font-bold text-pink-900 text-center text-sm md:text-base max-w-md animate-pop">
        {feedback}
      </div>

      {/* Choices */}
      <div className="w-full bg-white/90 rounded-2xl p-5 shadow-lg border-2 border-pink-200 flex flex-col items-center my-2">
        <div className="text-pink-600 font-extrabold text-xs uppercase tracking-wider mb-3">
          Pilih Kata yang Sama dengan Tulisannya:
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoose(opt)}
              className="bg-gradient-to-b from-purple-400 to-indigo-500 hover:from-purple-300 hover:to-indigo-400 active:scale-95 text-white font-black text-lg md:text-xl py-4 rounded-2xl shadow-lg border-b-4 border-indigo-700 transition transform hover:scale-105 flex items-center justify-center text-center"
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
