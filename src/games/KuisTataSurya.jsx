import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const PLANETS = [
  { order: 1, name: 'Merkurius', emoji: '⚪', desc: 'Planet terkecil & paling dekat dengan Matahari' },
  { order: 2, name: 'Venus', emoji: '🟡', desc: 'Bintang kejora, planet paling panas dan terang' },
  { order: 3, name: 'Bumi', emoji: '🌍', desc: 'Rumah kita yang kaya air dan oksigen kehidupan' },
  { order: 4, name: 'Mars', emoji: '🔴', desc: 'Planet merah berdebu dengan gunung api raksasa' },
  { order: 5, name: 'Yupiter', emoji: '🪐', desc: 'Planet terbesar seantero Tata Surya' },
  { order: 6, name: 'Saturnus', emoji: '🪐', desc: 'Planet anggun yang memiliki cincin es indah' },
  { order: 7, name: 'Uranus', emoji: '🔵', desc: 'Raksasa es berwarna biru kehijauan yang dingin' },
  { order: 8, name: 'Neptunus', emoji: '🔷', desc: 'Planet terjauh yang diterpa badai angin kencang' },
];

export default function KuisTataSurya({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_kuis_tata_surya') || '0', 10);
  });
  const [targetPlanet, setTargetPlanet] = useState(PLANETS[0]);
  const [options, setOptions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Pelajari urutan planet dari sang Mentari!');

  const setupRound = () => {
    const chosen = PLANETS[Math.floor(Math.random() * PLANETS.length)];
    setTargetPlanet(chosen);

    const wrongList = PLANETS.filter(p => p.order !== chosen.order);
    const shuffledWrongs = wrongList.sort(() => 0.5 - Math.random()).slice(0, 2);
    const opts = [chosen, ...shuffledWrongs].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setFeedback(`Planet apakah yang berada di urutan ke-${chosen.order} dari Matahari? 🚀`);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleChoose = (planet) => {
    if (planet.order === targetPlanet.order) {
      playSound('success');
      const newScore = score + 15;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback(`Luar biasa! Urutan ke-${targetPlanet.order} adalah ${targetPlanet.name} (${targetPlanet.desc})! 🪐✨`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_kuis_tata_surya', newScore.toString());
      }

      if (newStreak % 4 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1800);
    } else {
      playSound('wrong');
      setFeedback(`Bukan ${planet.name}. ${planet.name} berada di urutan ke-${planet.order}. Coba lagi ya! 🚀`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-900 text-white rounded-3xl p-6 shadow-xl border-4 border-violet-500">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-indigo-900 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-indigo-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-950 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-purple-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-purple-400 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      {/* Sun & Orbit Visual */}
      <div className="flex flex-col items-center my-4">
        <div className="flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full backdrop-blur-md border border-white/20 mb-3">
          <span className="text-3xl animate-spin" style={{ animationDuration: '10s' }}>
            ☀️
          </span>
          <span className="font-black text-amber-300 text-sm md:text-base">
            Matahari Pusat Tata Surya
          </span>
        </div>

        {/* Target Orbit Question Box */}
        <div className="w-56 h-36 bg-gradient-to-br from-indigo-800/80 to-purple-800/80 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-yellow-400 flex flex-col items-center justify-center p-4 animate-pop">
          <span className="text-xs uppercase tracking-widest font-black text-yellow-300">
            Misi Antariksa
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-1">
            Urutan Ke-{targetPlanet.order}
          </h2>
          <span className="text-xs text-indigo-200 mt-1 font-semibold">
            dari Matahari
          </span>
        </div>

        <div className="mt-4 bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-purple-300 font-bold text-indigo-950 text-center text-sm md:text-base max-w-md animate-pop">
          {feedback}
        </div>
      </div>

      {/* Choices */}
      <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border-2 border-purple-400/40 flex flex-col items-center">
        <div className="text-yellow-300 font-extrabold text-xs uppercase tracking-wider mb-3">
          Pilih Nama Planet yang Tepat:
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoose(opt)}
              className="bg-gradient-to-b from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 active:scale-95 text-white font-black text-base md:text-lg py-4 rounded-2xl shadow-lg border-b-4 border-indigo-900 transition transform hover:scale-105 flex flex-col items-center justify-center gap-1"
            >
              <span className="text-3xl filter drop-shadow">{opt.emoji}</span>
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
