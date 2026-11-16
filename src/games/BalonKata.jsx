import React, { useState, useEffect, useRef } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const WORD_LIST = [
  { word: 'BUKU', emoji: '📖', hint: 'Jendela ilmu untuk dibaca' },
  { word: 'BOLA', emoji: '⚽', hint: 'Benda bulat untuk ditendang' },
  { word: 'MEJA', emoji: '🪑', hint: 'Tempat menaruh buku dan pensil' },
  { word: 'APEL', emoji: '🍎', hint: 'Buah manis berwarna merah' },
  { word: 'KUDA', emoji: '🐎', hint: 'Hewan gagah yang bisa ditunggangi' },
  { word: 'AYAM', emoji: '🐔', hint: 'Hewan bersayap yang berkokok' },
  { word: 'SUSU', emoji: '🥛', hint: 'Minuman sehat kaya kalsium' },
  { word: 'TOPI', emoji: '🧢', hint: 'Pelindung kepala dari panas mentari' },
  { word: 'IKAN', emoji: '🐟', hint: 'Berenang lincah di dalam air' },
  { word: 'DAUN', emoji: '🍃', hint: 'Bagian tanaman yang berwarna hijau' },
];

const BALLOON_COLORS = [
  'from-pink-400 to-rose-500',
  'from-sky-400 to-blue-500',
  'from-amber-400 to-orange-500',
  'from-purple-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
];

export default function BalonKata({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_balon_kata') || '0', 10);
  });
  const [currentWordItem, setCurrentWordItem] = useState(WORD_LIST[0]);
  const [inputWord, setInputWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [balloonColor, setBalloonColor] = useState(BALLOON_COLORS[0]);
  const [isPopped, setIsPopped] = useState(false);
  const [feedback, setFeedback] = useState('Ketik hurufnya sebelum balon meletus!');
  const inputRef = useRef(null);

  const startNewWord = () => {
    setIsPopped(false);
    setInputWord('');
    setTimeLeft(15);
    const chosen = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    setCurrentWordItem(chosen);
    setBalloonColor(color);
    setFeedback(`Ketik kata: "${chosen.word}" (${chosen.hint})`);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    startNewWord();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isPopped) return;

    if (timeLeft <= 0) {
      setIsPopped(true);
      playSound('pop');
      setFeedback(`DUARR! Balon meletus karena kehabisan waktu! 💥 Coba kata berikutnya!`);
      setTimeout(() => {
        startNewWord();
      }, 1600);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPopped]);

  // Handle typing letter
  const handleType = (char) => {
    if (isPopped) return;
    playSound('click');

    const nextInput = (inputWord + char).toUpperCase();
    if (currentWordItem.word.startsWith(nextInput)) {
      setInputWord(nextInput);

      if (nextInput === currentWordItem.word) {
        playSound('success');
        const newScore = score + 15;
        setScore(newScore);
        setFeedback(`Hebat sekali! Ejaan kata "${currentWordItem.word}" sempurna! 🎉`);

        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('score_balon_kata', newScore.toString());
        }

        if (newScore % 30 === 0) {
          triggerConfetti();
        }

        setTimeout(() => {
          startNewWord();
        }, 1200);
      }
    } else {
      playSound('wrong');
      setFeedback(`Ups! Huruf "${char}" bukan urutan yang pas untuk kata "${currentWordItem.word}".`);
    }
  };

  const handleBackspace = () => {
    if (inputWord.length > 0) {
      playSound('click');
      setInputWord(prev => prev.slice(0, -1));
    }
  };

  // Keyboard listener
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleType(key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inputWord, currentWordItem, isPopped]);

  const targetLetters = currentWordItem.word.split('');
  const keyboardKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-sky-100 via-rose-50 to-pink-100 rounded-3xl p-6 shadow-xl border-4 border-rose-300">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-rose-700 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-rose-200"
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

      {/* Timer Bar */}
      <div className="w-full max-w-md bg-white rounded-full h-4 shadow-inner border border-rose-200 overflow-hidden my-2">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft > 5 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
          }`}
          style={{ width: `${(timeLeft / 15) * 100}%` }}
        />
      </div>
      <div className="text-xs font-black text-rose-800">
        ⏱️ Sisa Waktu Balon: <span className="text-base text-red-600">{timeLeft}</span> detik
      </div>

      {/* Floating Balloon Visual */}
      <div className="relative flex flex-col items-center my-3">
        {isPopped ? (
          <div className="text-8xl animate-ping select-none">
            💥
          </div>
        ) : (
          <div
            className={`w-44 h-52 bg-gradient-to-br ${balloonColor} rounded-full shadow-2xl border-4 border-white flex flex-col items-center justify-center relative transform transition-transform duration-300 animate-bounce-slow`}
          >
            {/* Balloon Gloss Highlight */}
            <div className="absolute top-4 left-6 w-7 h-12 bg-white/40 rounded-full rotate-12 blur-[1px]" />

            <span className="text-4xl mb-1 filter drop-shadow">{currentWordItem.emoji}</span>

            {/* Letter Slots */}
            <div className="flex gap-1.5 bg-black/25 px-3 py-1.5 rounded-2xl backdrop-blur-sm border border-white/40">
              {targetLetters.map((char, idx) => {
                const isTyped = idx < inputWord.length;
                return (
                  <div
                    key={idx}
                    className={`w-7 h-9 rounded-lg flex items-center justify-center font-black text-xl shadow ${
                      isTyped
                        ? 'bg-yellow-300 text-yellow-950 scale-105'
                        : 'bg-white/80 text-gray-400'
                    }`}
                  >
                    {isTyped ? inputWord[idx] : '_'}
                  </div>
                );
              })}
            </div>

            {/* Balloon Knot and String */}
            <div className="absolute -bottom-2 w-3 h-3 bg-rose-600 rotate-45 rounded-sm" />
            <div className="absolute -bottom-8 w-0.5 h-6 bg-gray-400" />
          </div>
        )}

        {/* Feedback message */}
        <div className="mt-4 bg-white/95 px-6 py-2 rounded-2xl shadow-md border-2 border-rose-200 font-bold text-rose-800 text-center text-sm md:text-base max-w-md animate-pop">
          {feedback}
        </div>
      </div>

      {/* Virtual On-Screen Alphabet Keyboard (Mobile & Desktop Friendly) */}
      <div className="w-full bg-white/95 rounded-2xl p-4 shadow-lg border-2 border-rose-200 flex flex-col items-center">
        <div className="text-rose-600 font-extrabold text-xs uppercase tracking-wider mb-2">
          Ketik Huruf (Sentuh Tombol atau Tekan Keyboard):
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-lg">
          {keyboardKeys.map((key) => (
            <button
              key={key}
              onClick={() => handleType(key)}
              className="w-8 h-9 md:w-9 md:h-10 bg-gradient-to-b from-rose-400 to-pink-500 hover:from-rose-300 hover:to-pink-400 active:scale-95 text-white font-black text-sm md:text-base rounded-xl shadow border-b-2 border-rose-700 transition"
            >
              {key}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="px-3 h-9 md:h-10 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs md:text-sm rounded-xl shadow border-b-2 border-amber-600 active:scale-95 flex items-center justify-center gap-1"
          >
            <span>⌫</span> Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
