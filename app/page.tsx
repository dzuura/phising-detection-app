'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, AlertTriangle, ChevronDown, 
  KeyRound, Phone, ShieldAlert, ArrowRight 
} from 'lucide-react';

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false);

  // Logika Navbar muncul saat scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 100) setShowNavbar(true);
    else setShowNavbar(false);
  };

  return (
    // CONTAINER UTAMA (Scroll Snap)
    <div 
      onScroll={handleScroll} 
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-slate-950 text-slate-200 no-scrollbar"
    >
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 transform ${
        showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="backdrop-blur-md bg-slate-900/80 border-b border-slate-800 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-emerald-400" />
              <span className="font-bold text-xl tracking-tight text-white">PhishGuard</span>
            </div>
            <Link href="/scan">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors">
                Cek URL
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- SECTION 1: PERTANYAAN (HOOK) --- */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-4">
        {/* Background Hiasan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="z-10 text-center space-y-6 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
            APA ITU <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
              PHISHING?
            </span>
          </h1>
          <p className="text-slate-500 mt-12 animate-bounce absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-sm uppercase tracking-widest">Scroll untuk jawaban</span>
            <ChevronDown className="w-6 h-6" />
          </p>
        </div>
      </section>


      {/* --- SECTION 2: JAWABAN (DEFINISI) --- */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-4 bg-slate-950">
        <div className="max-w-4xl w-full text-center space-y-8 animate-in slide-in-from-bottom-20 duration-1000">
          <div className="inline-block p-4 rounded-full bg-slate-900 border border-slate-800 mb-4 shadow-xl">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Upaya <span className="text-red-400">penipuan digital</span> untuk mencuri identitas Anda.
          </h2>
          
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Pelaku menyamar sebagai pihak resmi (Bank, Media Sosial, Kantor) menggunakan link palsu untuk memancing Anda memberikan 
            <span className="text-white font-semibold"> Password</span>, 
            <span className="text-white font-semibold"> PIN</span>, atau 
            <span className="text-white font-semibold"> Data Kartu Kredit</span>.
          </p>
        </div>
      </section>


      {/* --- SECTION 3: SOLUSI (APA YANG HARUS DILAKUKAN) --- */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-4 bg-slate-950/50">
        <div className="max-w-5xl w-full text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white">
            Terlanjur Klik Link Phishing? <br/>
            <span className="text-emerald-400">Lakukan Ini Segera:</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <KeyRound className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ganti Password</h3>
              <p className="text-slate-400 text-sm">Segera ubah password akun yang terdampak dan akun lain yang menggunakan password sama.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hubungi Bank</h3>
              <p className="text-slate-400 text-sm">Jika terkait data keuangan, segera telepon pihak bank untuk memblokir kartu/rekening.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Scan Antivirus</h3>
              <p className="text-slate-400 text-sm">Pastikan tidak ada malware yang terunduh otomatis ke perangkat Anda.</p>
            </div>
          </div>
        </div>
      </section>


      {/* --- SECTION 4: CALL TO ACTION (CEK URL) --- */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-4 bg-gradient-to-b from-slate-950 to-emerald-950/30">
        <div className="text-center space-y-8">
          <ShieldCheck className="w-24 h-24 text-emerald-500 mx-auto animate-pulse" />
          
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Jangan Ragu, <br/> Cek Dulu.
          </h2>
          
          <p className="text-xl text-slate-400 max-w-xl mx-auto">
            Punya link mencurigakan? Analisis menggunakan AI kami sebelum Anda membukanya.
          </p>

          <Link href="/scan">
            <button className="group mt-8 px-8 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xl font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] flex items-center gap-3 mx-auto">
              Cek URL Sekarang
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
        
        <footer className="absolute bottom-8 text-slate-600 text-sm">
          © 2025 PhishGuard AI Project
        </footer>
      </section>

    </div>
  );
}