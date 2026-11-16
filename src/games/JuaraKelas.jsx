import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const BOSS_QUESTIONS = [
  {
    category: 'Matematika',
    question: 'Berapakah hasil dari 25 + 17?',
    options: ['42', '38', '45'],
    answer: '42',
    icon: '➕'
  },
  {
    category: 'Bahasa',
    question: 'Lawan kata dari "RAJIN" adalah?',
    options: ['Malas', 'Pintar', 'Cepat'],
    answer: 'Malas',
    icon: '📖'
  },
  {
    category: 'Logika',
    question: 'Jika hari kemarin adalah hari Rabu, maka besok adalah hari?',
    options: ['Jumat', 'Kamis', 'Sabtu'],
    answer: 'Jumat',
    icon: '💡'
  },
  {
    category: 'Matematika',
    question: 'Berapakah hasil perkalian 7 × 8?',
    options: ['56', '54', '64'],
    answer: '56',
    icon: '✖️'
  },
  {
    category: 'Sains',
    question: 'Hewan apakah yang bernapas menggunakan insang?',
    options: ['Ikan', 'Kucing', 'Burung'],
    answer: 'Ikan',
    icon: '🔬'
  },
  {
    category: 'Bahasa',
    question: 'Sinonim (persamaan kata) dari "GEMBIRA" adalah?',
    options: ['Senang', 'Sedih', 'Marah'],
    answer: 'Senang',
    icon: '✍️'
  },
  {
    category: 'Logika',
    question: 'Benda manakah yang BUKAN merupakan alat tulis sekolah?',
    options: ['Panci', 'Pensil', 'Penghapus'],
    answer: 'Panci',
    icon: '🎒'
  },
  {
    category: 'Matematika',
    question: 'Ibu membeli 12 jeruk, dimakan adik 4 buah. Sisa jeruk ibu adalah?',
    options: ['8 buah', '6 buah', '10 buah'],
    answer: '8 buah',
    icon: '🍊'
  },
  {
    category: 'Pengetahuan Umum',
    question: 'Lambang negara Indonesia adalah burung...?',
    options: ['Garuda', 'Elang', 'Merpati'],
    answer: 'Garuda',
    icon: '🇮🇩'
  },
  {
    category: 'Sains',
    question: 'Bagian tumbuhan yang berfungsi menyerap air dari dalam tanah adalah?',
    options: ['Akar', 'Daun', 'Bunga'],
    answer: 'Akar',
    icon: '🌱'
  },
];

export default function JuaraKelas({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_juara_kelas') || '0', 10);
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (120 seconds)
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState('Tantangan Boss 2 Menit! Jawab secepat dan setepat mungkin!');

  // Countdown timer
  useEffect(() => {
    if (isGameOver) return;

    if (timeLeft <= 0) {
      setIsGameOver(true);
      playSound('success');
      triggerConfetti();
      setFeedback('WAKTU HABIS! Kamu berhasil menyelesaikan Ujian Boss Juara Kelas! 🏆🎉');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver]);

  const currentQ = BOSS_QUESTIONS[currentIdx % BOSS_QUESTIONS.length];

  const handleAnswer = (choice) => {
    if (isGameOver) return;

    if (choice === currentQ.answer) {
      playSound('success');
      const newScore = score + 25;
      setScore(newScore);
      setFeedback(`TEPAT SEKALI! Jawabanmu benar (+25 Poin)! 🌟`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_juara_kelas', newScore.toString());
      }

      if (newScore % 75 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 700);
    } else {
      playSound('wrong');
      setFeedback(`Ups, jawaban yang tepat adalah "${currentQ.answer}". Ayo lanjut soal berikutnya! 💪`);
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 900);
    }
  };

  const restartQuiz = () => {
    playSound('click');
    setScore(0);
    setTimeLeft(120);
    setCurrentIdx(0);
    setIsGameOver(false);
    setFeedback('Mulai tantangan baru Juara Kelas!');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-6 shadow-xl border-4 border-yellow-400">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-yellow-900 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-yellow-300"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-950 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-500 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-amber-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-amber-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full flex items-center justify-between bg-white/90 px-6 py-2 rounded-full shadow border-2 border-yellow-300 my-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <span className="text-xs uppercase font-extrabold text-gray-600">Sisa Waktu:</span>
          <span className="font-black text-lg text-red-600">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </div>
        <div className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Soal Ke-{currentIdx + 1}
        </div>
      </div>

      {/* Game Content or Giant Trophy on Game Over */}
      {isGameOver ? (
        <div className="flex flex-col items-center justify-center my-4 p-6 bg-white/90 rounded-3xl shadow-2xl border-4 border-yellow-400 w-full animate-pop">
          <div className="text-8xl md:text-9xl animate-bounce mb-2">
            🏆
          </div>
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            PIALA JUARA KELAS!
          </h2>
          <p className="text-gray-700 font-extrabold text-base mt-2 text-center">
            Selamat! Kamu telah berjuang hebat dan mengumpulkan skor:
          </p>
          <div className="text-4xl font-black text-orange-600 my-2">
            {score} Poin
          </div>
          <button
            onClick={restartQuiz}
            className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black px-8 py-3.5 rounded-full shadow-xl transition transform hover:scale-105 active:scale-95 text-lg"
          >
            🔄 Mainkan Boss Stage Lagi!
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center my-2">
          <div className="w-full bg-white/95 rounded-3xl p-6 shadow-xl border-4 border-yellow-300 flex flex-col items-center text-center">
            <span className="bg-yellow-100 text-yellow-900 text-xs font-black px-3.5 py-1 rounded-full border border-yellow-300 mb-2 flex items-center gap-1.5">
              <span>{currentQ.icon}</span>
              <span>Kategori: {currentQ.category}</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-gray-800 mt-2 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          <div className="mt-3 bg-white/95 px-6 py-2 rounded-2xl shadow-md border-2 border-yellow-300 font-bold text-yellow-950 text-center text-sm max-w-md animate-pop">
            {feedback}
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 w-full mt-4">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="bg-gradient-to-b from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:scale-95 text-white font-black text-lg md:text-xl py-4 rounded-2xl shadow-lg border-b-4 border-amber-700 transition transform hover:scale-105 flex items-center justify-center text-center px-2"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
