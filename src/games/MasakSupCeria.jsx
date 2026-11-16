import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const INGREDIENTS = [
  { id: 'carrot', name: 'Wortel', emoji: '🥕' },
  { id: 'broccoli', name: 'Brokoli', emoji: '🥦' },
  { id: 'mushroom', name: 'Jamur', emoji: '🍄' },
  { id: 'corn', name: 'Jagung', emoji: '🌽' },
];

export default function MasakSupCeria({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_masak_sup') || '0', 10);
  });
  const [recipe, setRecipe] = useState({ item1: INGREDIENTS[0], count1: 2, item2: INGREDIENTS[1], count2: 3 });
  const [potItems, setPotItems] = useState({});
  const [soupsCooked, setSoupsCooked] = useState(0);
  const [feedback, setFeedback] = useState('Masukkan bahan ke dalam panci sesuai resep koki cilik!');

  const setupRound = () => {
    setPotItems({});
    const ing1 = INGREDIENTS[Math.floor(Math.random() * 2)];
    const ing2 = INGREDIENTS[Math.floor(Math.random() * 2) + 2];
    const c1 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const c2 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    setRecipe({ item1: ing1, count1: c1, item2: ing2, count2: c2 });
    setFeedback(`Resep Sup Baru: Siapkan ${c1} ${ing1.name} dan ${c2} ${ing2.name}! 🍲`);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const addIngredient = (ing) => {
    playSound('drop');
    setPotItems(prev => ({
      ...prev,
      [ing.id]: (prev[ing.id] || 0) + 1
    }));
  };

  const resetPot = () => {
    playSound('click');
    setPotItems({});
  };

  const handleCookSoup = () => {
    const count1 = potItems[recipe.item1.id] || 0;
    const count2 = potItems[recipe.item2.id] || 0;

    // Check extra ingredients
    const otherIngredientsCount = Object.keys(potItems)
      .filter(k => k !== recipe.item1.id && k !== recipe.item2.id)
      .reduce((sum, k) => sum + potItems[k], 0);

    if (count1 === recipe.count1 && count2 === recipe.count2 && otherIngredientsCount === 0) {
      playSound('success');
      const newScore = score + 20;
      const newSoups = soupsCooked + 1;
      setScore(newScore);
      setSoupsCooked(newSoups);
      setFeedback(`SLURRP! Sup Ceria matang sempurna dan rasanya lezat sekali! 🍲✨`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_masak_sup', newScore.toString());
      }

      if (newSoups % 3 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1600);
    } else {
      playSound('wrong');
      setFeedback('Bahan di panci belum sesuai takaran resep. Cek jumlahnya atau reset panci! 🥄');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-6 shadow-xl border-4 border-amber-300">
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

      {/* Recipe Note */}
      <div className="w-full bg-white/95 rounded-3xl p-4 shadow-lg border-2 border-amber-300 my-2 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">📜</span>
          <span className="font-black text-amber-900 text-sm md:text-base">
            Resep Rahasia Koki:
          </span>
        </div>
        <div className="flex gap-3">
          <div className="bg-amber-100 text-amber-900 font-black px-4 py-1.5 rounded-2xl border border-amber-300 flex items-center gap-1.5 text-sm">
            <span>{recipe.item1.emoji}</span>
            <span>{recipe.count1} {recipe.item1.name}</span>
          </div>
          <div className="bg-amber-100 text-amber-900 font-black px-4 py-1.5 rounded-2xl border border-amber-300 flex items-center gap-1.5 text-sm">
            <span>{recipe.item2.emoji}</span>
            <span>{recipe.count2} {recipe.item2.name}</span>
          </div>
        </div>
      </div>

      {/* Cooking Pot */}
      <div className="relative my-3 flex flex-col items-center">
        <div className="w-48 h-44 bg-gradient-to-b from-stone-600 to-stone-800 rounded-b-full rounded-t-3xl shadow-2xl border-4 border-stone-500 flex flex-col items-center justify-center p-3 relative overflow-hidden">
          <div className="absolute top-2 text-2xl animate-bounce">♨️</div>
          <span className="text-6xl mb-1 filter drop-shadow">🍲</span>
          <span className="text-xs font-black text-yellow-300 uppercase tracking-widest">
            Panci Sup Panas
          </span>

          {/* Current ingredients inside pot */}
          <div className="flex flex-wrap justify-center gap-1 mt-1 max-w-[150px]">
            {Object.keys(potItems).map((key) => {
              const ing = INGREDIENTS.find(i => i.id === key);
              return Array.from({ length: potItems[key] }).map((_, idx) => (
                <span key={`${key}-${idx}`} className="text-base animate-pop">
                  {ing.emoji}
                </span>
              ));
            })}
          </div>
        </div>

        <button
          onClick={resetPot}
          className="mt-2 text-xs font-extrabold text-amber-800 bg-white/80 hover:bg-white px-3 py-1 rounded-full shadow border border-amber-300 active:scale-95 transition"
        >
          🔄 Kosongkan Panci
        </button>
      </div>

      {/* Ingredient buttons */}
      <div className="w-full bg-white/95 rounded-2xl p-4 shadow-lg border-2 border-amber-200 flex flex-col items-center">
        <div className="text-amber-700 font-extrabold text-xs uppercase tracking-wider mb-2">
          Pilih Bahan untuk Dimasukkan:
        </div>
        <div className="grid grid-cols-4 gap-2 w-full">
          {INGREDIENTS.map((ing) => {
            const count = potItems[ing.id] || 0;
            return (
              <button
                key={ing.id}
                onClick={() => addIngredient(ing)}
                className="bg-gradient-to-b from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:scale-95 text-white font-black py-3 rounded-2xl shadow border-b-4 border-amber-700 transition transform hover:scale-105 flex flex-col items-center justify-center relative"
              >
                <span className="text-3xl mb-0.5">{ing.emoji}</span>
                <span className="text-xs">{ing.name}</span>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 bg-white/95 px-6 py-2 rounded-2xl shadow-md border-2 border-amber-300 font-bold text-amber-950 text-center text-sm max-w-md animate-pop">
        {feedback}
      </div>

      <button
        onClick={handleCookSoup}
        className="w-full max-w-md bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-95 text-white font-black text-xl py-3.5 rounded-full shadow-xl border-b-4 border-green-800 transition transform hover:scale-105 flex items-center justify-center gap-2 mt-2"
      >
        <span>👨‍🍳</span> MASAK SUP SEKARANG!
      </button>
    </div>
  );
}
