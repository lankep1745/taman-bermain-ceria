import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

export default function DinoPintar({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_dino_pintar') || '0', 10);
  });
  const [num1, setNum1] = useState(2);
  const [num2, setNum2] = useState(3);
  const [operator, setOperator] = useState('+');
  const [options, setOptions] = useState([]);
  const [dinoState, setDinoState] = useState('idle'); // 'idle', 'eating', 'sad', 'cheering'
  const [message, setMessage] = useState('Bantu Dino kenyang dengan jawab matematika!');
  const [applesFed, setApplesFed] = useState(0);

  const generateQuestion = () => {
    const isAddition = Math.random() > 0.4;
    let n1, n2, ans;
    if (isAddition) {
      n1 = Math.floor(Math.random() * 10) + 1;
      n2 = Math.floor(Math.random() * 10) + 1;
      ans = n1 + n2;
      setOperator('+');
    } else {
      n1 = Math.floor(Math.random() * 15) + 5;
      n2 = Math.floor(Math.random() * n1) + 1;
      ans = n1 - n2;
      setOperator('-');
    }
    setNum1(n1);
    setNum2(n2);

    // generate 3 distinct random options
    const opts = new Set([ans]);
    while (opts.size < 3) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
      const wrong = Math.max(0, ans + delta);
      opts.add(wrong);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (choice) => {
    const correct = operator === '+' ? num1 + num2 : num1 - num2;
    if (choice === correct) {
      const newScore = score + 10;
      const newApples = applesFed + 1;
      setScore(newScore);
      setApplesFed(newApples);
      playSound('chomp');
      setDinoState('eating');
      setMessage('Nyam nyam! Dino suka sekali apelmu! 🍎🦖');

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_dino_pintar', newScore.toString());
      }

      if (newApples % 5 === 0) {
        triggerConfetti();
        playSound('success');
        setDinoState('cheering');
        setMessage('HOREEE! Dino sangat kenyang dan bahagia! 🎉🦖✨');
      }

      setTimeout(() => {
        setDinoState('idle');
        generateQuestion();
      }, 1200);
    } else {
      playSound('wrong');
      setDinoState('sad');
      setMessage('Aduh, salah hitung! Coba lagi ya teman kecil! 🦕');
      setTimeout(() => {
        setDinoState('idle');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[560px] w-full max-w-2xl bg-gradient-to-b from-emerald-100 to-green-200 rounded-3xl p-6 shadow-xl border-4 border-emerald-300">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-emerald-700 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-emerald-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-emerald-400 text-emerald-950 font-black px-4 py-2 rounded-full shadow border-2 border-emerald-500 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      {/* Interactive Dino Mascot & Apples */}
      <div className="relative flex flex-col items-center my-4">
        {/* Apple basket indicator */}
        <div className="flex items-center gap-1 bg-white/70 px-4 py-1.5 rounded-full shadow-inner mb-2 border border-emerald-200">
          <span className="text-xl">🧺</span>
          <span className="font-bold text-emerald-800 text-sm">
            Apel Dimakan: <span className="text-red-500 font-extrabold text-base">{applesFed}</span>
          </span>
          <div className="flex ml-2">
            {Array.from({ length: Math.min(5, applesFed % 5 || (applesFed > 0 ? 5 : 0)) }).map((_, idx) => (
              <span key={idx} className="text-base animate-bounce">🍎</span>
            ))}
          </div>
        </div>

        {/* Dino visual with state expressions */}
        <div className="relative text-8xl md:text-9xl transition-all duration-300 transform select-none">
          {dinoState === 'eating' && (
            <div className="relative animate-bounce">
              <span className="inline-block transform scale-110">🦖</span>
              <span className="absolute -top-2 right-0 text-5xl animate-ping">🍎</span>
            </div>
          )}
          {dinoState === 'sad' && (
            <div className="animate-wiggle">
              <span className="inline-block opacity-80">🦕</span>
              <span className="absolute top-0 right-2 text-4xl">💧</span>
            </div>
          )}
          {dinoState === 'cheering' && (
            <div className="animate-bounce">
              <span className="inline-block transform scale-125">🦖</span>
              <span className="absolute -top-4 -left-4 text-4xl">⭐</span>
              <span className="absolute -top-4 -right-4 text-4xl">🎉</span>
            </div>
          )}
          {dinoState === 'idle' && (
            <div className="animate-pulse">
              <span>🦖</span>
            </div>
          )}
        </div>

        {/* Bubble dialog */}
        <div className="mt-3 bg-white px-5 py-2 rounded-2xl shadow-md border-2 border-emerald-300 font-bold text-emerald-800 text-center text-sm md:text-base max-w-md animate-pop">
          {message}
        </div>
      </div>

      {/* Math question card */}
      <div className="w-full bg-white/95 rounded-2xl p-5 shadow-lg border-2 border-emerald-200 flex flex-col items-center">
        <div className="text-emerald-600 font-extrabold text-sm uppercase tracking-wider mb-2">
          Beri Makan Dino Apel:
        </div>
        <div className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-black text-gray-800 bg-emerald-50 px-8 py-3 rounded-2xl border-2 border-dashed border-emerald-300 mb-6">
          <span className="text-blue-600">{num1}</span>
          <span className="text-emerald-500">{operator}</span>
          <span className="text-purple-600">{num2}</span>
          <span className="text-gray-400">=</span>
          <span className="text-red-500 animate-pulse">?</span>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="bg-gradient-to-b from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 active:translate-y-1 text-white font-black text-2xl md:text-3xl py-4 rounded-2xl shadow-lg border-b-4 border-orange-600 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>🍎</span> {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
