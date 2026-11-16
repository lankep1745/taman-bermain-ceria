import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

export default function KeretaAlfabet({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_kereta_alfabet') || '0', 10);
  });
  const [carriages, setCarriages] = useState([]);
  const [missingIndex, setMissingIndex] = useState(2);
  const [correctLetter, setCorrectLetter] = useState('C');
  const [options, setOptions] = useState([]);
  const [trainMoving, setTrainMoving] = useState(false);
  const [feedback, setFeedback] = useState('Lengkapi gerbong kereta yang kosong!');

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const setupRound = () => {
    setTrainMoving(false);
    // pick starting letter such that start + 4 <= 25
    const startIndex = Math.floor(Math.random() * (ALPHABET.length - 4));
    const slice = ALPHABET.slice(startIndex, startIndex + 4);
    const missingPos = Math.floor(Math.random() * 4);

    const target = slice[missingPos];
    setCorrectLetter(target);
    setMissingIndex(missingPos);
    setCarriages(slice);

    // generate 3 choices including target
    const opts = new Set([target]);
    while (opts.size < 3) {
      const randChar = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      opts.add(randChar);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setFeedback('Pilih huruf yang tepat untuk gerbong tanda tanya!');
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleChoose = (letter) => {
    if (trainMoving) return;

    if (letter === correctLetter) {
      playSound('success');
      const newScore = score + 10;
      setScore(newScore);
      setFeedback(`Hore! Huruf "${letter}" melengkapi kereta kita! Choo Choo! 🚂💨`);
      setTrainMoving(true);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_kereta_alfabet', newScore.toString());
      }

      if (newScore % 30 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1600);
    } else {
      playSound('wrong');
      setFeedback(`Yah, huruf "${letter}" belum tepat untuk urutan ini. Coba lagi! 🛤️`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[560px] w-full max-w-2xl bg-gradient-to-b from-sky-100 to-blue-200 rounded-3xl p-6 shadow-xl border-4 border-sky-300">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-sky-700 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-sky-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-sky-400 text-sky-950 font-black px-4 py-2 rounded-full shadow border-2 border-sky-500 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      {/* Train Presentation Canvas */}
      <div className="flex flex-col items-center my-6 w-full overflow-hidden">
        {/* Whistle sound button */}
        <button
          onClick={() => {
            playSound('success');
          }}
          className="mb-4 bg-amber-400 hover:bg-amber-300 text-amber-900 font-extrabold px-4 py-1.5 rounded-full shadow border-2 border-amber-500 flex items-center gap-2 transition transform hover:scale-105"
        >
          <span>📢</span> Bunyikan Peluit: "Tuut Tuuut!"
        </button>

        {/* Train Row */}
        <div
          className={`flex items-center gap-2 md:gap-3 py-6 px-4 bg-sky-50/70 rounded-3xl border-2 border-dashed border-sky-300 transition-transform duration-1000 ${
            trainMoving ? 'translate-x-6 scale-105' : ''
          }`}
        >
          {/* Locomotive */}
          <div className="flex flex-col items-center">
            <div className="bg-red-500 text-white font-black px-3 py-3 rounded-2xl shadow-lg border-b-4 border-red-700 flex flex-col items-center relative">
              <span className="text-3xl md:text-4xl animate-bounce">🚂</span>
              <span className="text-xs tracking-wider uppercase">Kepala</span>
              <span className="absolute -top-3 -right-2 text-xl animate-ping">💨</span>
            </div>
            {/* Wheels */}
            <div className="flex gap-2 mt-1">
              <span className="text-xs">⚫</span>
              <span className="text-xs">⚫</span>
            </div>
          </div>

          <span className="text-gray-400 font-black text-xl">🔗</span>

          {/* Carriages */}
          {carriages.map((letter, idx) => {
            const isMissing = idx === missingIndex;
            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-16 md:w-18 md:h-20 rounded-2xl shadow-lg flex items-center justify-center font-black text-2xl md:text-3xl border-b-4 transition-all duration-300 ${
                      isMissing
                        ? 'bg-amber-300 border-amber-500 text-amber-800 animate-pulse ring-4 ring-amber-400/50'
                        : 'bg-emerald-400 border-emerald-600 text-white'
                    }`}
                  >
                    {isMissing ? (trainMoving ? correctLetter : '?') : letter}
                  </div>
                  {/* Carriage Wheels */}
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs">⚫</span>
                    <span className="text-xs">⚫</span>
                  </div>
                </div>
                {idx < carriages.length - 1 && (
                  <span className="text-gray-400 font-black text-xl">🔗</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Tracks line visual */}
        <div className="w-full h-3 bg-stone-400 rounded-full mt-1 border-t-2 border-stone-500 flex justify-between px-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-1.5 h-full bg-stone-600"></div>
          ))}
        </div>

        {/* Speech dialog */}
        <div className="mt-4 bg-white/95 px-6 py-2 rounded-2xl shadow-md border-2 border-sky-200 font-bold text-sky-800 text-center text-sm md:text-base max-w-md animate-pop">
          {feedback}
        </div>
      </div>

      {/* Choices */}
      <div className="w-full bg-white/90 rounded-2xl p-5 shadow-lg border-2 border-sky-200 flex flex-col items-center">
        <div className="text-sky-600 font-extrabold text-sm uppercase tracking-wider mb-3">
          Pilih Huruf Kereta Berikutnya:
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoose(opt)}
              className="bg-gradient-to-b from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 active:translate-y-1 text-white font-black text-3xl md:text-4xl py-4 rounded-2xl shadow-lg border-b-4 border-blue-700 transition transform hover:scale-105 flex items-center justify-center"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
