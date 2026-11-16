import React, { useState, useEffect } from 'react';
import DinoPintar from './games/DinoPintar';
import TebakHewan from './games/TebakHewan';
import KeretaAlfabet from './games/KeretaAlfabet';
import PahlawanSampah from './games/PahlawanSampah';
import LompatKatak from './games/LompatKatak';
import BalonKata from './games/BalonKata';
import TekaTekiBuah from './games/TekaTekiBuah';
import JamBerapa from './games/JamBerapa';
import KasirCilik from './games/KasirCilik';
import PancingIkanAngka from './games/PancingIkanAngka';
import BulanBintang from './games/BulanBintang';
import SusunMenara from './games/SusunMenara';
import LabirinKelinci from './games/LabirinKelinci';
import PianoKucing from './games/PianoKucing';
import TebakBendera from './games/TebakBendera';
import KuisTataSurya from './games/KuisTataSurya';
import MasakSupCeria from './games/MasakSupCeria';
import TebakWarnaCepat from './games/TebakWarnaCepat';
import BantuKupuKupu from './games/BantuKupuKupu';
import JuaraKelas from './games/JuaraKelas';
import { triggerConfetti, playSound } from './utils/audio';

// 20 Games Definition - ALL READY TO PLAY
const GAMES_LIST = [
  {
    id: 1,
    title: 'Dino Pintar',
    subtitle: 'Matematika Berhitung',
    desc: 'Beri makan dino apel segar dengan menjawab penjumlahan & pengurangan!',
    icon: '🦖',
    category: 'Matematika',
    bgCard: 'from-emerald-300 to-green-400',
    borderCard: 'border-emerald-500',
    scoreKey: 'score_dino_pintar',
    status: 'ready'
  },
  {
    id: 2,
    title: 'Tebak Hewan',
    subtitle: 'Suara & Siluet',
    desc: 'Kenali suara misterius dan tebak bayangan hewan ajaib!',
    icon: '🐾',
    category: 'Sains & Alam',
    bgCard: 'from-purple-300 to-pink-400',
    borderCard: 'border-purple-500',
    scoreKey: 'score_tebak_hewan',
    status: 'ready'
  },
  {
    id: 3,
    title: 'Kereta Alfabet',
    subtitle: 'Mengenal Huruf A-Z',
    desc: 'Lengkapi gerbong kereta api yang hilang agar bisa berangkat!',
    icon: '🚂',
    category: 'Bahasa',
    bgCard: 'from-sky-300 to-blue-400',
    borderCard: 'border-sky-500',
    scoreKey: 'score_kereta_alfabet',
    status: 'ready'
  },
  {
    id: 4,
    title: 'Pahlawan Sampah',
    subtitle: 'Peduli Lingkungan',
    desc: 'Pilah sampah organik (daun) & anorganik (plastik) ke tong yang benar!',
    icon: '♻️',
    category: 'Kebiasaan Baik',
    bgCard: 'from-teal-300 to-emerald-400',
    borderCard: 'border-teal-500',
    scoreKey: 'score_pahlawan_sampah',
    status: 'ready'
  },
  {
    id: 5,
    title: 'Lompat Katak',
    subtitle: 'Pola Bilangan Genap/Ganjil',
    desc: 'Bantu katak melompat di atas daun teratai dengan pola angka tepat!',
    icon: '🐸',
    category: 'Matematika',
    bgCard: 'from-lime-300 to-green-500',
    borderCard: 'border-lime-600',
    scoreKey: 'score_lompat_katak',
    status: 'ready'
  },
  {
    id: 6,
    title: 'Balon Kata',
    subtitle: 'Ketik Cepat Kata',
    desc: 'Ketik ejaan kata sederhana sebelum balon terbang meletus di awan!',
    icon: '🎈',
    category: 'Bahasa',
    bgCard: 'from-rose-300 to-red-400',
    borderCard: 'border-rose-500',
    scoreKey: 'score_balon_kata',
    status: 'ready'
  },
  {
    id: 7,
    title: 'Teka-Teki Buah',
    subtitle: 'Memory Match Pasangan',
    desc: 'Buka kartu dan temukan pasangan buah manis yang kembar!',
    icon: '🍓',
    category: 'Daya Ingat',
    bgCard: 'from-amber-300 to-orange-400',
    borderCard: 'border-amber-500',
    scoreKey: 'score_teka_teki_buah',
    status: 'ready'
  },
  {
    id: 8,
    title: 'Jam Berapa?',
    subtitle: 'Membaca Jam Analog & Digital',
    desc: 'Lihat jarum jam dinding dan cocokkan dengan angka digitalnya!',
    icon: '⏰',
    category: 'Waktu & Logika',
    bgCard: 'from-indigo-300 to-purple-400',
    borderCard: 'border-indigo-500',
    scoreKey: 'score_jam_berapa',
    status: 'ready'
  },
  {
    id: 9,
    title: 'Kasir Cilik',
    subtitle: 'Hitung Uang & Kembalian',
    desc: 'Belanja mainan lucu dan hitung koin kembalian kasir dengan teliti!',
    icon: '🪙',
    category: 'Matematika Finansial',
    bgCard: 'from-yellow-300 to-amber-400',
    borderCard: 'border-yellow-600',
    scoreKey: 'score_kasir_cilik',
    status: 'ready'
  },
  {
    id: 10,
    title: 'Pancing Ikan Angka',
    subtitle: 'Tantangan Perkalian',
    desc: 'Kail ikan berenang di danau yang membawa angka hasil perkalian!',
    icon: '🎣',
    category: 'Matematika',
    bgCard: 'from-cyan-300 to-sky-400',
    borderCard: 'border-cyan-500',
    scoreKey: 'score_pancing_ikan',
    status: 'ready'
  },
  {
    id: 11,
    title: 'Bulan & Bintang',
    subtitle: 'Siang vs Malam',
    desc: 'Kelompokkan benda dan kegiatan yang terjadi di waktu siang atau malam!',
    icon: '🌙',
    category: 'Sains',
    bgCard: 'from-blue-400 to-indigo-500',
    borderCard: 'border-blue-600',
    scoreKey: 'score_bulan_bintang',
    status: 'ready'
  },
  {
    id: 12,
    title: 'Susun Menara',
    subtitle: 'Refleks & Ketepatan',
    desc: 'Jatuhkan balok tepat waktu agar menara berdiri tinggi menjulang!',
    icon: '🏗️',
    category: 'Ketangkasan',
    bgCard: 'from-orange-300 to-red-400',
    borderCard: 'border-orange-500',
    scoreKey: 'score_susun_menara',
    status: 'ready'
  },
  {
    id: 13,
    title: 'Labirin Kelinci',
    subtitle: 'Navigasi Arah & Rintangan',
    desc: 'Pandu kelinci putih imut melewati labirin menuju wortel oranye!',
    icon: '🥕',
    category: 'Spasial & Logika',
    bgCard: 'from-emerald-300 to-teal-400',
    borderCard: 'border-emerald-600',
    scoreKey: 'score_labirin_kelinci',
    status: 'ready'
  },
  {
    id: 14,
    title: 'Piano Kucing',
    subtitle: 'Memori Nada Musikal',
    desc: 'Dengarkan nada pelangi dan tiru kembali tombol tuts nada beruntun!',
    icon: '🎹',
    category: 'Seni Musik',
    bgCard: 'from-fuchsia-300 to-pink-500',
    borderCard: 'border-fuchsia-600',
    scoreKey: 'score_piano_kucing',
    status: 'ready'
  },
  {
    id: 15,
    title: 'Tebak Bendera',
    subtitle: 'Wawasan ASEAN',
    desc: 'Kenali warna dan lambang bendera negara-negara tetangga kita!',
    icon: '🚩',
    category: 'Sosial & Budaya',
    bgCard: 'from-red-300 to-rose-400',
    borderCard: 'border-red-500',
    scoreKey: 'score_tebak_bendera',
    status: 'ready'
  },
  {
    id: 16,
    title: 'Kuis Tata Surya',
    subtitle: 'Petualangan Luar Angkasa',
    desc: 'Susun planet-planet dari yang paling dekat dengan sang Mentari!',
    icon: '🪐',
    category: 'Astronomi',
    bgCard: 'from-violet-400 to-purple-600',
    borderCard: 'border-violet-600',
    scoreKey: 'score_kuis_tata_surya',
    status: 'ready'
  },
  {
    id: 17,
    title: 'Masak Sup Ceria',
    subtitle: 'Resep Angka Dapur',
    desc: 'Masukkan wortel, brokoli, dan jamur ke panci sesuai hitungan koki!',
    icon: '🍲',
    category: 'Hitung & Logika',
    bgCard: 'from-amber-200 to-yellow-400',
    borderCard: 'border-amber-600',
    scoreKey: 'score_masak_sup',
    status: 'ready'
  },
  {
    id: 18,
    title: 'Tebak Warna Cepat',
    subtitle: 'Konsentrasi Stroop Test',
    desc: 'Fokus baca tulisan warnanya, jangan terkecoh dengan warna tintanya!',
    icon: '🎨',
    category: 'Fokus & Konsentrasi',
    bgCard: 'from-pink-300 to-rose-400',
    borderCard: 'border-pink-500',
    scoreKey: 'score_tebak_warna_cepat',
    status: 'ready'
  },
  {
    id: 19,
    title: 'Bantu Kupu-kupu',
    subtitle: 'Perbandingan Lebih Banyak',
    desc: 'Hinggapi bunga dengan jumlah kelopak paling mekar dan banyak!',
    icon: '🦋',
    category: 'Analisis Visual',
    bgCard: 'from-teal-200 to-cyan-400',
    borderCard: 'border-teal-500',
    scoreKey: 'score_bantu_kupu_kupu',
    status: 'ready'
  },
  {
    id: 20,
    title: 'Juara Kelas',
    subtitle: 'Boss Stage 2 Menit!',
    desc: 'Kombinasi pamungkas matematika, logika & bahasa untuk raih Piala Emas!',
    icon: '🏆',
    category: 'Tantangan Utama',
    bgCard: 'from-amber-400 to-yellow-500',
    borderCard: 'border-yellow-600',
    scoreKey: 'score_juara_kelas',
    status: 'ready'
  }
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [activeGameId, setActiveGameId] = useState(null);

  // Loading Screen Timer
  useEffect(() => {
    const progressTimer = setTimeout(() => {
      setProgressLoaded(true);
    }, 100);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(timer);
    };
  }, []);

  const handleOpenGame = (game) => {
    playSound('click');
    setActiveGameId(game.id);
  };

  const handleBackToMenu = () => {
    playSound('click');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveGameId(null);
  };

  // 1. Loading Screen Component (Kids-Friendly)
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-300 via-pink-200 to-yellow-200 flex flex-col items-center justify-center p-6 text-center select-none">
        {/* Animated Jumping Mascots */}
        <div className="flex items-center justify-center gap-6 mb-6 text-7xl md:text-[100px]">
          <span className="animate-bounce inline-block" style={{ animationDelay: '0ms' }}>
            🦕
          </span>
          <span className="animate-bounce inline-block" style={{ animationDelay: '150ms' }}>
            🚀
          </span>
          <span className="animate-bounce inline-block" style={{ animationDelay: '300ms' }}>
            🧸
          </span>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl md:text-3xl font-black text-indigo-950 animate-pulse drop-shadow-sm mb-6 max-w-md leading-relaxed">
          Tunggu sebentar ya... Sedang menyiapkan mainan! 🎈
        </h2>

        {/* Animated Progress Bar */}
        <div className="rounded-full h-8 w-72 md:w-80 bg-white/50 border-4 border-white shadow-lg overflow-hidden p-1 flex items-center">
          <div
            className={`bg-gradient-to-r from-green-400 to-blue-400 h-full rounded-full transition-all duration-[3000ms] ease-out ${
              progressLoaded ? 'w-full' : 'w-0'
            }`}
          />
        </div>

        {/* Playful Subtext */}
        <span className="text-xs md:text-sm font-extrabold text-indigo-900/80 mt-4 tracking-wider">
          Membuka Gerbang Wahana Bermain & Belajar... ✨
        </span>
      </div>
    );
  }

  // 2. Main Portal & 20 Games View
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-pink-100 to-yellow-100 text-gray-800 flex flex-col items-center py-6 px-4 md:px-8 selection:bg-pink-300 selection:text-pink-900">
      {/* Header Banner */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/80 backdrop-blur-md px-8 py-5 rounded-3xl shadow-lg border-4 border-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full flex items-center justify-center text-4xl shadow-md border-2 border-white animate-bounce-slow">
            🎡
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Taman Bermain Ceria
            </h1>
            <p className="text-sm md:text-base font-bold text-gray-600">
              20 Wahana Edukasi Lengkap untuk Anak Cerdas Indonesia 🇮🇩
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerConfetti();
              playSound('success');
            }}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 active:scale-95 text-white font-black px-5 py-2.5 rounded-full shadow-md transition flex items-center gap-2 border-2 border-white"
          >
            <span>🎉</span> Tabur Confetti!
          </button>
        </div>
      </header>

      {/* Main Container - 20 Games Routing */}
      <main className="w-full max-w-6xl flex flex-col items-center flex-1">
        {activeGameId === 1 && <DinoPintar onBack={handleBackToMenu} />}
        {activeGameId === 2 && <TebakHewan onBack={handleBackToMenu} />}
        {activeGameId === 3 && <KeretaAlfabet onBack={handleBackToMenu} />}
        {activeGameId === 4 && <PahlawanSampah onBack={handleBackToMenu} />}
        {activeGameId === 5 && <LompatKatak onBack={handleBackToMenu} />}
        {activeGameId === 6 && <BalonKata onBack={handleBackToMenu} />}
        {activeGameId === 7 && <TekaTekiBuah onBack={handleBackToMenu} />}
        {activeGameId === 8 && <JamBerapa onBack={handleBackToMenu} />}
        {activeGameId === 9 && <KasirCilik onBack={handleBackToMenu} />}
        {activeGameId === 10 && <PancingIkanAngka onBack={handleBackToMenu} />}
        {activeGameId === 11 && <BulanBintang onBack={handleBackToMenu} />}
        {activeGameId === 12 && <SusunMenara onBack={handleBackToMenu} />}
        {activeGameId === 13 && <LabirinKelinci onBack={handleBackToMenu} />}
        {activeGameId === 14 && <PianoKucing onBack={handleBackToMenu} />}
        {activeGameId === 15 && <TebakBendera onBack={handleBackToMenu} />}
        {activeGameId === 16 && <KuisTataSurya onBack={handleBackToMenu} />}
        {activeGameId === 17 && <MasakSupCeria onBack={handleBackToMenu} />}
        {activeGameId === 18 && <TebakWarnaCepat onBack={handleBackToMenu} />}
        {activeGameId === 19 && <BantuKupuKupu onBack={handleBackToMenu} />}
        {activeGameId === 20 && <JuaraKelas onBack={handleBackToMenu} />}

        {/* Dashboard Grid when no game is active */}
        {!activeGameId && (
          <div className="w-full flex flex-col items-center">
            {/* Mascot greetings banner */}
            <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5 rounded-3xl shadow-md mb-8 flex items-center justify-between border-4 border-white">
              <div className="flex items-center gap-4">
                <span className="text-5xl animate-bounce">🎈</span>
                <div>
                  <h2 className="text-xl md:text-2xl font-black">
                    Pilih Wahana Belajarmu Sekarang!
                  </h2>
                  <p className="text-xs md:text-sm font-semibold opacity-90">
                    Semua 20 Game siap dimainkan tanpa batas! Kumpulkan bintang dan raih gelar Juara Kelas!
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm font-extrabold text-sm">
                <span>🌟 20 / 20 Games Terbuka Penuh</span>
              </div>
            </div>

            {/* 20 Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full pb-12">
              {GAMES_LIST.map((game) => {
                const localScore = localStorage.getItem(game.scoreKey) || '0';

                return (
                  <div
                    key={game.id}
                    onClick={() => handleOpenGame(game)}
                    className={`group relative cursor-pointer bg-gradient-to-br ${game.bgCard} rounded-3xl p-5 shadow-lg border-4 ${game.borderCard} transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:scale-95 flex flex-col justify-between`}
                  >
                    {/* Badge Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-white/90 text-gray-800 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                        #{game.id} {game.category}
                      </span>
                      <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow animate-pulse flex items-center gap-1">
                        <span>🟢</span> MAIN
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex flex-col items-center my-3 text-center">
                      <div className="text-6xl mb-3 transform transition-transform group-hover:scale-125 duration-300 drop-shadow-md">
                        {game.icon}
                      </div>
                      <h3 className="text-2xl font-black text-white drop-shadow-sm">
                        {game.title}
                      </h3>
                      <h4 className="text-xs font-extrabold text-white/90 uppercase tracking-wider mb-2">
                        {game.subtitle}
                      </h4>
                      <p className="text-xs font-semibold text-white/95 line-clamp-2 leading-relaxed">
                        {game.desc}
                      </p>
                    </div>

                    {/* Footer / High Score */}
                    <div className="mt-4 pt-3 border-t-2 border-white/30 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-white font-extrabold text-xs">
                        <span>⭐ Skor:</span>
                        <span className="bg-white text-gray-800 px-2 py-0.5 rounded-full font-black">
                          {localScore}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center font-black shadow transition group-hover:bg-yellow-300">
                        ➔
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mt-8 text-center text-xs font-bold text-gray-500 py-4 border-t border-gray-300/40">
        Taman Bermain Ceria © 2026 — Didesain khusus untuk edukasi & perkembangan kognitif anak Sekolah Dasar.
      </footer>
    </div>
  );
}
