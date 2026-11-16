import React, { useState, useEffect } from 'react';
import { triggerConfetti, playSound, playAnimalAcoustic } from '../utils/audio';

const ANIMALS = [
  { name: 'Gajah', emoji: '🐘', soundText: 'Trompeettt!', clue: 'Berbelalai panjang dan bertubuh sangat besar', color: 'bg-indigo-100' },
  { name: 'Kucing', emoji: '🐱', soundText: 'Meooong meong!', clue: 'Suka dielus dan mengeong lucu', color: 'bg-orange-100' },
  { name: 'Singa', emoji: '🦁', soundText: 'Rooaaarrr!', clue: 'Raja hutan yang memiliki surai lebat', color: 'bg-yellow-100' },
  { name: 'Bebek', emoji: '🦆', soundText: 'Kwek kwek kwek!', clue: 'Pandai berenang di danau dan berparuh ceper', color: 'bg-emerald-100' },
  { name: 'Sapi', emoji: '🐮', soundText: 'Mooouuu!', clue: 'Hewan penghasil susu segar yang suka makan rumput', color: 'bg-rose-100' },
  { name: 'Monyet', emoji: '🐵', soundText: 'U-u a-a!', clue: 'Lincah bergelantungan di pohon dan suka pisang', color: 'bg-amber-100' },
  { name: 'Ayam', emoji: '🐔', soundText: 'Kukuruyuk!', clue: 'Membangunkan kita setiap pagi hari', color: 'bg-red-100' },
  { name: 'Kambing', emoji: '🐐', soundText: 'Mbeeek mbeeek!', clue: 'Memiliki jenggot kecil dan suka rumput hijau', color: 'bg-teal-100' },
  { name: 'Katak', emoji: '🐸', soundText: 'Krok krok!', clue: 'Bisa melompat tinggi dan hidup di dua alam', color: 'bg-lime-100' },
  { name: 'Lumba-lumba', emoji: '🐬', soundText: 'Klik klik kluk!', clue: 'Sahabat manusia di lautan yang cerdas', color: 'bg-cyan-100' },
];

export default function TebakHewan({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('score_tebak_hewan') || '0', 10);
  });
  const [currentAnimal, setCurrentAnimal] = useState(ANIMALS[0]);
  const [options, setOptions] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Dengarkan suaranya dan tebak siluet hewan ini!');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakVoice = (text, onEnd) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        utterance.pitch = 1.1;

        // Try to pick an Indonesian voice if available
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
        if (idVoice) utterance.voice = idVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          if (onEnd) onEnd();
        };
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const playAnimalSoundAndClue = () => {
    playAnimalAcoustic(currentAnimal.name);
    const textClue = `Suaraku: ${currentAnimal.soundText}. Ciriku: ${currentAnimal.clue}. Siapakah aku?`;
    speakVoice(textClue);
  };

  const setupRound = () => {
    setRevealed(false);
    const chosen = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setCurrentAnimal(chosen);

    const wrongList = ANIMALS.filter(a => a.name !== chosen.name);
    const shuffledWrongs = wrongList.sort(() => 0.5 - Math.random()).slice(0, 2);
    const opts = [chosen, ...shuffledWrongs].sort(() => 0.5 - Math.random());
    setOptions(opts);
    setFeedback(`Hewan ini bersuara: "${chosen.soundText}". Tekan tombol dengar suara!`);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleChoice = (animal) => {
    if (revealed) return;

    if (animal.name === currentAnimal.name) {
      setRevealed(true);
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      playSound('success');
      setFeedback(`Hebat sekali! Ini adalah ${currentAnimal.name}! 🎉`);

      // Read victory voice announcement
      speakVoice(`Hore! Benar sekali, ini adalah ${currentAnimal.name}!`);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('score_tebak_hewan', newScore.toString());
      }

      if (newStreak % 5 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        setupRound();
      }, 2000);
    } else {
      playSound('wrong');
      setFeedback(`Bukan ${animal.name}, ayo perhatikan siluet dan dengarkan lagi! 🔍`);
      speakVoice(`Bukan ${animal.name}, coba dengarkan lagi ya!`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[560px] w-full max-w-2xl bg-gradient-to-b from-purple-100 to-pink-200 rounded-3xl p-6 shadow-xl border-4 border-purple-300">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onBack();
          }}
          className="bg-white/90 hover:bg-white text-purple-700 font-extrabold px-5 py-2.5 rounded-full shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-purple-200"
        >
          <span>🏠</span> Menu Utama
        </button>
        <div className="flex gap-4">
          <div className="bg-yellow-300 text-yellow-900 font-black px-4 py-2 rounded-full shadow border-2 border-yellow-400 flex items-center gap-2">
            <span>⭐</span> Skor: {score}
          </div>
          <div className="bg-purple-400 text-purple-950 font-black px-4 py-2 rounded-full shadow border-2 border-purple-500 flex items-center gap-2">
            <span>👑</span> Terbaik: {highScore}
          </div>
        </div>
      </div>

      {/* Animal Silhouette Box */}
      <div className="flex flex-col items-center my-4 w-full">
        {/* Real Audio & Speech Button */}
        <button
          onClick={playAnimalSoundAndClue}
          className={`mb-3 px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 text-white font-extrabold text-base md:text-lg border-2 border-white ${
            isSpeaking
              ? 'bg-gradient-to-r from-amber-500 to-red-500 ring-4 ring-pink-300 animate-pulse'
              : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
          }`}
        >
          <span className="text-2xl animate-bounce">🔊</span>
          <span>{isSpeaking ? 'Sedang Bersuara...' : 'Dengarkan Suara & Ciri Hewan'}</span>
        </button>

        {/* Silhouette / Revealed container */}
        <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-3xl shadow-xl border-4 border-purple-300 flex items-center justify-center relative overflow-hidden transition-all duration-500">
          <span
            className={`text-8xl md:text-9xl transition-all duration-500 transform ${
              revealed
                ? 'scale-110 filter-none animate-bounce'
                : 'brightness-0 opacity-90 hover:scale-105'
            }`}
          >
            {currentAnimal.emoji}
          </span>
          {!revealed && (
            <div className="absolute bottom-2 text-xs font-black tracking-widest text-purple-500 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Siluet Misterius
            </div>
          )}
        </div>

        {/* Speech dialog */}
        <div className="mt-4 bg-white/95 px-6 py-2.5 rounded-2xl shadow-md border-2 border-purple-200 font-bold text-purple-800 text-center text-sm md:text-base max-w-md animate-pop">
          {feedback}
        </div>
      </div>

      {/* Choices */}
      <div className="w-full bg-white/90 rounded-2xl p-5 shadow-lg border-2 border-purple-200 flex flex-col items-center">
        <div className="text-purple-600 font-extrabold text-sm uppercase tracking-wider mb-3">
          Siapakah Nama Hewan Ini?
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoice(opt)}
              className="bg-gradient-to-b from-purple-400 to-indigo-500 hover:from-purple-300 hover:to-indigo-400 active:translate-y-1 text-white font-black text-lg md:text-xl py-4 rounded-2xl shadow-lg border-b-4 border-indigo-700 transition transform hover:scale-105 flex flex-col items-center justify-center gap-1"
            >
              <span>🐾</span>
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
