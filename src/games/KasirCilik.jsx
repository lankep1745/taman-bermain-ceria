import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound } from '../utils/audio';

const TOY_ITEMS = [
  { name: 'Robot Pintar', emoji: '🤖', price: 6000 },
  { name: 'Boneka Beruang', emoji: '🧸', price: 7000 },
  { name: 'Mobil Balap', emoji: '🚗', price: 4000 },
  { name: 'Pesawat Terbang', emoji: '✈️', price: 8000 },
  { name: 'Dinosaurus Mainan', emoji: '🦖', price: 5000 },
  { name: 'Gasing Putar', emoji: '🪀', price: 3000 },
  { name: 'Kapal Selam', emoji: '🚤', price: 6000 },
  { name: 'Kamera Mainan', emoji: '📷', price: 5000 },
];

export default function KasirCilik({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_kasir_cilik') || '0', 10);
  });
  const [toy, setToy] = useState(TOY_ITEMS[0]);
  const [cashGiven, setCashGiven] = useState(10000);
  const [changeGiven, setChangeGiven] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [feedback, setFeedback] = useState('Hitung kembalian pembeli dan serahkan koin yang pas!');

  const setupRound = () => {
    const randomToy = TOY_ITEMS[Math.floor(Math.random() * TOY_ITEMS.length)];
    // Customer pays with 10.000 or 15.000
    const bills = [10000];
    if (randomToy.price >= 6000) bills.push(10000, 15000);
    const chosenBill = bills[Math.floor(Math.random() * bills.length)];

    setToy(randomToy);
    setCashGiven(chosenBill);
    setChangeGiven(0);
    setFeedback(`Pembeli membayar Rp ${chosenBill.toLocaleString('id-ID')} untuk ${randomToy.name}.`);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const correctChange = cashGiven - toy.price;

  const addCoin = (val) => {
    playSound('click');
    setChangeGiven(prev => prev + val);
  };

  const resetCoins = () => {
    playSound('click');
    setChangeGiven(0);
  };

  const handleConfirmChange = () => {
    if (changeGiven === correctChange) {
      playSound('success');
      const newScore = score + 15;
      const newCount = transactionsCount + 1;
      setScore(newScore);
      setTransactionsCount(newCount);
      setFeedback(`Hore! Kembalian Rp ${changeGiven.toLocaleString('id-ID')} tepat sekali! Pelanggan senang! 🛒🎉`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_kasir_cilik', newScore.toString());
      }

      if (newCount % 5 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 1600);
    } else {
      playSound('wrong');
      if (changeGiven < correctChange) {
        setFeedback(`Kembalianmu masih kurang Rp ${(correctChange - changeGiven).toLocaleString('id-ID')}. Tambahkan koin lagi! 🪙`);
      } else {
        setFeedback(`Kembalianmu kebanyakan Rp ${(changeGiven - correctChange).toLocaleString('id-ID')}. Tekan tombol reset koin! ⚠️`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-2xl bg-gradient-to-b from-yellow-100 via-amber-50 to-orange-100 rounded-3xl p-6 shadow-xl border-4 border-yellow-300">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-yellow-800 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-yellow-200"
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

      {/* Cashier counter card */}
      <div className="w-full bg-white/95 rounded-3xl p-5 shadow-lg border-2 border-amber-200 my-2 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Item bought */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-5xl shadow border border-amber-300 animate-bounce-slow">
            {toy.emoji}
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold text-amber-700 tracking-wider">
              Mainan Dibeli:
            </div>
            <h3 className="font-black text-xl text-gray-800">{toy.name}</h3>
            <div className="text-base font-extrabold text-rose-600">
              Harga: Rp {toy.price.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Customer Payment */}
        <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-2xl p-3 flex flex-col items-center">
          <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
            💵 Uang Pembeli:
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-0.5">
            Rp {cashGiven.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Interactive Coin Bag */}
      <div className="w-full bg-amber-500/10 rounded-2xl p-4 border-2 border-amber-300 flex flex-col items-center">
        <div className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">
          Pilih Koin Kembalian untuk Diserahkan:
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => addCoin(1000)}
            className="bg-gradient-to-b from-yellow-300 to-amber-400 hover:from-yellow-200 hover:to-amber-300 active:scale-95 text-yellow-950 font-black px-4 py-3 rounded-2xl shadow-md border-b-4 border-amber-600 transition transform hover:scale-105 flex items-center gap-1.5"
          >
            <span className="text-2xl">🪙</span>
            <span>+ Rp 1.000</span>
          </button>
          <button
            onClick={() => addCoin(2000)}
            className="bg-gradient-to-b from-cyan-300 to-blue-400 hover:from-cyan-200 hover:to-blue-300 active:scale-95 text-blue-950 font-black px-4 py-3 rounded-2xl shadow-md border-b-4 border-blue-600 transition transform hover:scale-105 flex items-center gap-1.5"
          >
            <span className="text-2xl">🪙</span>
            <span>+ Rp 2.000</span>
          </button>
          <button
            onClick={() => addCoin(5000)}
            className="bg-gradient-to-b from-purple-300 to-indigo-400 hover:from-purple-200 hover:to-indigo-300 active:scale-95 text-indigo-950 font-black px-4 py-3 rounded-2xl shadow-md border-b-4 border-indigo-600 transition transform hover:scale-105 flex items-center gap-1.5"
          >
            <span className="text-2xl">🪙</span>
            <span>+ Rp 5.000</span>
          </button>
        </div>

        {/* Change counter display */}
        <div className="mt-4 flex items-center justify-between w-full max-w-md bg-white rounded-2xl px-5 py-3 shadow border border-amber-200">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Total Kembalian Disiapkan:
            </span>
            <span className="text-2xl md:text-3xl font-black text-orange-600">
              Rp {changeGiven.toLocaleString('id-ID')}
            </span>
          </div>
          <button
            onClick={resetCoins}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-gray-300 active:scale-95 transition"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Speech feedback */}
      <div className="mt-3 bg-white/95 px-6 py-2 rounded-2xl shadow-md border-2 border-yellow-300 font-bold text-yellow-950 text-center text-sm md:text-base max-w-md animate-pop">
        {feedback}
      </div>

      {/* Hand Over / Confirm Button */}
      <button
        onClick={handleConfirmChange}
        className="w-full max-w-md bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-95 text-white font-black text-xl py-3.5 rounded-full shadow-xl border-b-4 border-green-800 transition transform hover:scale-105 flex items-center justify-center gap-2 mt-2"
      >
        <span>🤝</span> Serahkan Kembalian!
      </button>
    </div>
  );
}
