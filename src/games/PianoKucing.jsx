import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound, playNote } from '../utils/audio';

const PIANO_KEYS = [
  { note: 'DO', freq: 261.63, color: 'bg-red-400 hover:bg-red-300 border-red-600', label: '1' },
  { note: 'RE', freq: 293.66, color: 'bg-orange-400 hover:bg-orange-300 border-orange-600', label: '2' },
  { note: 'MI', freq: 329.63, color: 'bg-yellow-400 hover:bg-yellow-300 border-yellow-600', label: '3' },
  { note: 'FA', freq: 349.23, color: 'bg-green-400 hover:bg-green-300 border-green-600', label: '4' },
  { note: 'SOL', freq: 392.00, color: 'bg-teal-400 hover:bg-teal-300 border-teal-600', label: '5' },
  { note: 'LA', freq: 440.00, color: 'bg-blue-400 hover:bg-blue-300 border-blue-600', label: '6' },
  { note: 'SI', freq: 493.88, color: 'bg-purple-400 hover:bg-purple-300 border-purple-600', label: '7' },
];

export default function PianoKucing({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_piano_kucing') || '0', 10);
  });
  const [sequence, setSequence] = useState([0, 1, 2]);
  const [playerInput, setPlayerInput] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [feedback, setFeedback] = useState('Dengarkan nada yang dicontohkan Kucing!');

  const playSequence = (seq) => {
    setIsPlayingDemo(true);
    setFeedback('Kucing sedang memainkan nada... Dengarkan baik-baik! 🐱🎵');

    seq.forEach((keyIndex, i) => {
      setTimeout(() => {
        playNote(PIANO_KEYS[keyIndex].freq);
        setActiveKey(keyIndex);
        setTimeout(() => setActiveKey(null), 350);

        if (i === seq.length - 1) {
          setTimeout(() => {
            setIsPlayingDemo(false);
            setFeedback('Giliranmu! Tekan tuts piano sesuai urutan nada tadi! 🎹');
          }, 400);
        }
      }, (i + 1) * 600);
    });
  };

  const startNewLevel = (currentSeq = [0, 2]) => {
    const nextSeq = [...currentSeq, Math.floor(Math.random() * 5)];
    setSequence(nextSeq);
    setPlayerInput([]);
    setTimeout(() => {
      playSequence(nextSeq);
    }, 800);
  };

  useEffect(() => {
    startNewLevel([]);
  }, []);

  const handleKeyPress = (index) => {
    if (isPlayingDemo) return;

    playNote(PIANO_KEYS[index].freq);
    setActiveKey(index);
    setTimeout(() => setActiveKey(null), 250);

    const nextInput = [...playerInput, index];
    setPlayerInput(nextInput);

    // Verify step
    const currentStep = nextInput.length - 1;
    if (nextInput[currentStep] !== sequence[currentStep]) {
      playSound('wrong');
      setFeedback('Ups, nada keliru! Kucing akan mengulangi contoh nadanya ya! 🐾');
      setPlayerInput([]);
      setTimeout(() => {
        playSequence(sequence);
      }, 1200);
      return;
    }

    // Completed whole sequence
    if (nextInput.length === sequence.length) {
      playSound('success');
      const newScore = score + sequence.length * 10;
      setScore(newScore);
      setFeedback('MEOOWW! Nada yang kamu mainkan tepat dan merdu sekali! 🐱🎉');

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_piano_kucing', newScore.toString());
      }

      if (sequence.length % 3 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        startNewLevel(sequence);
      }, 1400);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-pink-100 via-purple-50 to-fuchsia-100 rounded-3xl p-6 shadow-xl border-4 border-fuchsia-300">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-fuchsia-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-fuchsia-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-fuchsia-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-fuchsia-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center my-3">
        <div className="text-7xl md:text-8xl animate-bounce-slow mb-1">
          🐱
        </div>
        <div className="bg-white/80 px-4 py-1.5 rounded-full shadow border border-fuchsia-200 text-xs font-black text-fuchsia-900">
          Tingkat Nada: <span className="text-pink-600 font-bold">{sequence.length}</span> Not Beruntun 🎵
        </div>
      </div>

      <div className="w-full bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-fuchsia-200 font-bold text-fuchsia-900 text-center text-sm md:text-base max-w-md animate-pop my-2">
        {feedback}
      </div>

      {/* Piano Keys Bar */}
      <div className="w-full bg-white/90 rounded-3xl p-4 shadow-xl border-4 border-fuchsia-300 flex justify-center gap-2 md:gap-3 overflow-x-auto my-3">
        {PIANO_KEYS.map((key, idx) => {
          const isGlowing = activeKey === idx;
          return (
            <button
              key={idx}
              onClick={() => handleKeyPress(idx)}
              className={`w-12 h-36 md:w-16 md:h-44 rounded-2xl shadow-lg border-b-8 font-black flex flex-col items-center justify-between py-3 transition-all duration-200 select-none transform ${
                key.color
              } ${isGlowing ? 'scale-105 brightness-125 ring-4 ring-yellow-300' : 'hover:-translate-y-1 active:translate-y-1'}`}
            >
              <span className="text-white text-base md:text-lg drop-shadow">{key.note}</span>
              <span className="text-white/80 text-xs font-bold bg-black/20 px-2 py-0.5 rounded-full">
                {key.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => playSequence(sequence)}
        disabled={isPlayingDemo}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-extrabold text-xs md:text-sm px-5 py-2 rounded-full shadow transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
      >
        <span>🔁</span> Ulangi Contoh Nada Kucing
      </button>
    </div>
  );
}
