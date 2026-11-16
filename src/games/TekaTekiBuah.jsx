import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const FRUITS_POOL = [
  { name: 'Stroberi', emoji: '🍓', color: 'from-rose-400 to-red-500' },
  { name: 'Pisang', emoji: '🍌', color: 'from-amber-300 to-yellow-400' },
  { name: 'Semangka', emoji: '🍉', color: 'from-emerald-400 to-red-500' },
  { name: 'Jeruk', emoji: '🍊', color: 'from-orange-400 to-amber-500' },
  { name: 'Apel', emoji: '🍎', color: 'from-red-400 to-rose-600' },
  { name: 'Anggur', emoji: '🍇', color: 'from-purple-400 to-indigo-600' },
];

export default function TekaTekiBuah({ onBack }) {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_teka_teki_buah') || '0', 10);
  });
  const [isLocked, setIsLocked] = useState(false);
  const [feedback, setFeedback] = useState('Buka 2 kartu dan temukan pasangan buah yang sama!');

  const initializeGame = () => {
    // Pick 6 fruits and create pairs
    const pairs = [];
    FRUITS_POOL.forEach((fruit, idx) => {
      pairs.push({ id: idx * 2, fruitId: idx, ...fruit });
      pairs.push({ id: idx * 2 + 1, fruitId: idx, ...fruit });
    });
    // Shuffle cards
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setMoves(0);
    setIsLocked(false);
    setFeedback('Cari pasangan buah yang kembar!');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.has(cards[index].fruitId)) return;

    playSound('click');
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(prev => prev + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.fruitId === secondCard.fruitId) {
        // Matched!
        playSound('success');
        const nextMatched = new Set(matchedIds);
        nextMatched.add(firstCard.fruitId);
        setMatchedIds(nextMatched);

        const newScore = score + 20;
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('score_teka_teki_buah', newScore.toString());
        }

        setFeedback(`Hore! Pasangan buah ${firstCard.name} ditemukan! 🍓🎉`);
        setFlippedIndices([]);
        setIsLocked(false);

        // Check victory (all 6 pairs matched)
        if (nextMatched.size === FRUITS_POOL.length) {
          triggerConfetti();
          setFeedback('SELAMAT! Semua teka-teki buah berhasil kamu selesaikan! 🏆✨');
        }
      } else {
        // Mismatch
        playSound('wrong');
        setFeedback(`Yah, ${firstCard.name} dan ${secondCard.name} berbeda. Coba ingat posisinya!`);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-100 rounded-3xl p-6 shadow-xl border-4 border-amber-300">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-amber-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-amber-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-amber-500 text-white font-black px-4 py-2 rounded-full shadow border-2 border-amber-600 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 my-2">
        <div className="bg-white/80 text-amber-900 font-extrabold text-sm px-4 py-1.5 rounded-full shadow border border-amber-300">
          Langkah: <span className="text-orange-600 font-black">{moves}</span>
        </div>
        <div className="bg-white/80 text-amber-900 font-extrabold text-sm px-4 py-1.5 rounded-full shadow border border-amber-300">
          Pasangan Ditemukan:{' '}
          <span className="text-emerald-600 font-black">
            {matchedIds.size} / {FRUITS_POOL.length}
          </span>
        </div>
        <button
          onClick={initializeGame}
          className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow flex items-center gap-1 transition"
        >
          <span>🔄</span> Ulang
        </button>
      </div>

      {/* Cards 4x3 Grid */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 my-3 w-full max-w-lg">
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || matchedIds.has(card.fruitId);
          const isMatched = matchedIds.has(card.fruitId);

          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`h-24 md:h-28 rounded-2xl cursor-pointer select-none transition-all duration-300 transform perspective-1000 ${
                isMatched
                  ? 'scale-95 opacity-80'
                  : 'hover:scale-105 active:scale-95'
              }`}
            >
              <div
                className={`w-full h-full rounded-2xl flex flex-col items-center justify-center shadow-lg border-4 transition-all duration-300 ${
                  isFlipped
                    ? `bg-white ${isMatched ? 'border-emerald-400 bg-emerald-50' : 'border-amber-400'}`
                    : 'bg-gradient-to-br from-amber-400 to-orange-500 border-white hover:from-amber-300 hover:to-orange-400'
                }`}
              >
                {isFlipped ? (
                  <div className="flex flex-col items-center animate-pop">
                    <span className="text-4xl md:text-5xl drop-shadow">{card.emoji}</span>
                    <span className="text-[10px] md:text-xs font-black text-gray-700 mt-1">
                      {card.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-3xl text-white font-black drop-shadow animate-pulse">
                      ❓
                    </span>
                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-wider">
                      Buka
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback dialog */}
      <div className="w-full bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-amber-300 font-bold text-amber-900 text-center text-sm md:text-base max-w-md animate-pop">
        {feedback}
      </div>
    </div>
  );
}
