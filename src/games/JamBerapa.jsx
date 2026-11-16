import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const TIME_PRESETS = [
  { hour: 1, minute: 0, label: '01:00' },
  { hour: 2, minute: 30, label: '02:30' },
  { hour: 3, minute: 0, label: '03:00' },
  { hour: 4, minute: 15, label: '04:15' },
  { hour: 5, minute: 30, label: '05:30' },
  { hour: 6, minute: 0, label: '06:00' },
  { hour: 7, minute: 30, label: '07:30' },
  { hour: 8, minute: 0, label: '08:00' },
  { hour: 9, minute: 15, label: '09:15' },
  { hour: 10, minute: 30, label: '10:30' },
  { hour: 11, minute: 0, label: '11:00' },
  { hour: 12, minute: 0, label: '12:00' },
];

export default function JamBerapa({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_jam_berapa') || '0', 10);
  });
  const [currentTime, setCurrentTime] = useState(TIME_PRESETS[5]);
  const [options, setOptions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Perhatikan jarum pendek & panjang pada jam dinding!');

  const setupRound = () => {
    const chosen = TIME_PRESETS[Math.floor(Math.random() * TIME_PRESETS.length)];
    setCurrentTime(chosen);

    const wrongList = TIME_PRESETS.filter(t => t.label !== chosen.label);
    const shuffledWrongs = wrongList.sort(() => 0.5 - Math.random()).slice(0, 2);
    const opts = [chosen, ...shuffledWrongs].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setFeedback('Pilih angka jam digital yang tepat!');
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleSelect = (selectedTime) => {
    if (selectedTime.label === currentTime.label) {
      playSound('success');
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback(`Hebat sekali! Jarum jam memang menunjukkan pukul ${currentTime.label}! ⏰🎉`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_jam_berapa', newScore.toString());
      }

      if (newStreak % 5 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1500);
    } else {
      playSound('wrong');
      setFeedback(`Kurang tepat, jam tersebut bukan pukul ${selectedTime.label}. Coba lagi ya! 🧐`);
    }
  };

  // Calculate angles for clock hands
  const minuteAngle = currentTime.minute * 6; // 360 deg / 60 min = 6 deg/min
  const hourAngle = (currentTime.hour % 12) * 30 + (currentTime.minute / 60) * 30; // 30 deg/hour

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100 rounded-3xl p-6 shadow-xl border-4 border-indigo-300">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-indigo-700 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-indigo-200"
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

      {/* Mascot & Tip */}
      <div className="flex items-center gap-2 bg-white/70 px-4 py-1.5 rounded-full shadow-inner mt-2 border border-indigo-200">
        <span className="text-xl">💡</span>
        <span className="font-bold text-indigo-800 text-xs md:text-sm">
          Tips: Jarum <span className="text-red-500 font-black">pendek = jam</span>, jarum{' '}
          <span className="text-blue-500 font-black">panjang = menit</span>
        </span>
      </div>

      {/* Analog Clock SVG Visual */}
      <div className="relative my-4 flex flex-col items-center">
        <div className="w-52 h-52 md:w-60 md:h-60 bg-white rounded-full shadow-2xl border-8 border-indigo-400 flex items-center justify-center relative p-3">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Clock Face Circle */}
            <circle cx="100" cy="100" r="95" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

            {/* Clock Numbers 1 to 12 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
              const angle = (num * 30 - 90) * (Math.PI / 180);
              const x = 100 + 72 * Math.cos(angle);
              const y = 100 + 72 * Math.sin(angle);
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-black text-gray-700"
                  fontSize={num === 12 || num === 3 || num === 6 || num === 9 ? '18' : '14'}
                  fontWeight="bold"
                >
                  {num}
                </text>
              );
            })}

            {/* Hour Hand (Short & Red) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="45"
              stroke="#ef4444"
              strokeWidth="7"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 100 100)`}
              className="transition-transform duration-500"
            />

            {/* Minute Hand (Long & Blue) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="25"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 100 100)`}
              className="transition-transform duration-500"
            />

            {/* Center Pivot Point */}
            <circle cx="100" cy="100" r="7" fill="#1e293b" />
            <circle cx="100" cy="100" r="3" fill="#fbbf24" />
          </svg>
        </div>

        {/* Speech dialog */}
        <div className="mt-3 bg-white/95 px-6 py-2 rounded-2xl shadow-md border-2 border-indigo-200 font-bold text-indigo-800 text-center text-sm md:text-base max-w-md animate-pop">
          {feedback}
        </div>
      </div>

      {/* Answer Options as Digital Clocks */}
      <div className="w-full bg-white/90 rounded-2xl p-4 shadow-lg border-2 border-indigo-200 flex flex-col items-center">
        <div className="text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-2">
          Pilih Jam Digital yang Sesuai:
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className="bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-95 text-white font-black text-2xl md:text-3xl py-4 rounded-2xl shadow-lg border-b-4 border-purple-800 transition transform hover:scale-105 flex flex-col items-center justify-center gap-1"
            >
              <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold">
                Pukul
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
