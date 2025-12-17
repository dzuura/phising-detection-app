'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  ShieldCheck, Lock, AlertTriangle, ChevronDown,
  KeyRound, Phone, ShieldAlert, ArrowRight,
  Mail, Target, Copy, Crown, MessageSquare, PhoneCall, CheckCircle2,
  Fish, User, Building2, ChevronUp, Loader2
} from 'lucide-react';

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false);

  // State Data (Dikosongkan dulu, nanti diisi API)
  const [phishingCategories, setPhishingCategories] = useState<any[]>([]);
  const [mitigationData, setMitigationData] = useState<any>({ individual: [], organization: [] });
  const [loading, setLoading] = useState(true);

  // State UI
  const [activeTab, setActiveTab] = useState<'individual' | 'organization'>('individual');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // Base URL Backend
  const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

  // --- 1. FETCH DATA DARI API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Panggil 2 endpoint sekaligus biar cepat (Parallel)
        const [phishingRes, mitigationRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/info/phishing?lang=id`),
          axios.get(`${API_BASE_URL}/info/mitigation?lang=id`)
        ]);

        setPhishingCategories(phishingRes.data.categories);
        setMitigationData(mitigationRes.data);
      } catch (error) {
        console.error("Gagal mengambil data edukasi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. HELPER: MEMILIH IKON BERDASARKAN TIPE ---
  // Karena API cuma kirim teks string, kita cocokkan manual dengan ikon Lucide
  const getIconByType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('email')) return <Mail className="w-8 h-8 text-emerald-400" />;
    if (t.includes('spear')) return <Target className="w-8 h-8 text-blue-400" />;
    if (t.includes('clone')) return <Copy className="w-8 h-8 text-purple-400" />;
    if (t.includes('whaling')) return <Crown className="w-8 h-8 text-yellow-400" />;
    if (t.includes('smishing') || t.includes('sms')) return <MessageSquare className="w-8 h-8 text-pink-400" />;
    if (t.includes('vishing') || t.includes('voice')) return <PhoneCall className="w-8 h-8 text-orange-400" />;
    return <AlertTriangle className="w-8 h-8 text-slate-400" />; // Default icon
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 100) setShowNavbar(true);
    else setShowNavbar(false);
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div
      onScroll={handleScroll}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-slate-950 text-slate-200 no-scrollbar"
    >

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 transform ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
        <div className="backdrop-blur-md bg-slate-900/80 border-b border-slate-800 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
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

      {/* --- SECTION 1: HOOK (PERTANYAAN) --- */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-4 shrink-0">
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

      {/* --- SECTION 2: DEFINISI UMUM --- */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-4 bg-slate-950 shrink-0">
        <div className="max-w-4xl w-full text-center space-y-8 animate-in slide-in-from-bottom-20 duration-1000">

          <div className="inline-block p-6 rounded-full bg-slate-900 border border-slate-800 mb-4 shadow-xl relative group">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
            <Fish className="w-16 h-16 text-red-500 relative z-10" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            Upaya <span className="text-red-500">penipuan digital</span> untuk mencuri identitas Anda.
          </h2>

          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-light">
            Pelaku menyamar sebagai pihak resmi (Bank, Media Sosial, Kantor) menggunakan pesan atau link palsu untuk
            <span className="text-emerald-400 font-semibold italic"> "memancing"</span> Anda memberikan data sensitif.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl"><p className="text-white font-bold">Password & PIN</p></div>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl"><p className="text-white font-bold">Nomor Kartu Kredit</p></div>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl"><p className="text-white font-bold">Data Pribadi (NIK)</p></div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: EDUKASI (INFINITE LOOP SCROLL) --- */}
      <section className="h-screen w-full snap-start flex flex-col justify-center bg-slate-950 relative shrink-0 overflow-hidden">

        {/* Header */}
        <div className="px-8 mb-10 text-center z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Kenali Musuhmu</h2>
          <p className="text-slate-400">Pahami berbagai metode serangan siber modern</p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500">Mengambil data edukasi...</p>
          </div>
        ) : (
          /* Infinite Scroll Container */
          // Trik: Kita render list 2 KALI agar looping mulus
          <div className="relative w-full overflow-hidden">

            {/* Gradient Overlay Kiri & Kanan (Supaya halus) */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <div className="flex w-max py-3 animate-scroll hover:pause-scroll"> {/* <-- Class animasi kuncinya */}

              {/* RENDER PERTAMA & KEDUA (Duplikasi untuk efek infinite) */}
              {[...phishingCategories, ...phishingCategories].map((item, index) => (
                <div
                  key={index}
                  className="w-[350px] md:w-[400px] bg-slate-900/50 border border-slate-800 p-8 rounded-3xl mx-4 flex-shrink-0 flex flex-col h-[450px] hover:border-emerald-500/30 hover:scale-[1.02] transition-all duration-300 shadow-xl group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-emerald-500/20 transition-colors">
                      {getIconByType(item.type)}
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight">{item.type}</h3>
                  </div>

                  <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                    {item.description}
                  </p>

                  <div className="space-y-4 mt-auto">
                    <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                      <p className="text-xs font-bold text-red-400 uppercase mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Indikator
                      </p>
                      <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                        {item.indicators.slice(0, 2).map((ind: string, i: number) => <li key={i}>{ind}</li>)}
                      </ul>
                    </div>

                    <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                      <p className="text-xs font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Contoh
                      </p>
                      <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                        {item.examples.slice(0, 2).map((ex: string, i: number) => <li key={i}>{ex}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- SECTION 4: MITIGASI (FETCHED FROM API) --- */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-6 bg-slate-950/50 shrink-0">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Langkah Pencegahan</h2>
            <p className="text-slate-400">Bagaimana cara melindungi diri dan organisasi Anda?</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('individual')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'individual'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                >
                  <User className="w-5 h-5" /> Individu
                </button>
                <button
                  onClick={() => setActiveTab('organization')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'organization'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                >
                  <Building2 className="w-5 h-5" /> Organisasi
                </button>
              </div>

              {/* Accordion List */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {mitigationData[activeTab]?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-bold text-lg text-slate-200">{item.title}</span>
                      {openAccordion === index ? (
                        <ChevronUp className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    <div className={`px-5 pb-5 transition-all duration-300 ${openAccordion === index ? 'block opacity-100' : 'hidden opacity-0 h-0'
                      }`}>
                      <p className="text-slate-400 text-sm mb-3 italic">{item.description}</p>
                      <ul className="space-y-3">
                        {item.steps.map((step: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </section>

      {/* --- SECTION 5: CTA (TETAP SAMA) --- */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-4 bg-gradient-to-b from-slate-950 to-emerald-950/30 shrink-0">
        <div className="text-center space-y-8">
          <ShieldCheck className="w-24 h-24 text-emerald-500 mx-auto animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-black text-white">Jangan Ragu, <br /> Cek Dulu.</h2>
          <p className="text-xl text-slate-400 max-w-xl mx-auto">Punya link mencurigakan? Analisis menggunakan AI kami sebelum Anda membukanya.</p>
          <Link href="/scan">
            <button className="group mt-8 px-8 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xl font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] flex items-center gap-3 mx-auto">
              Cek URL Sekarang
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
        <footer className="absolute bottom-8 text-slate-500 text-sm">© 2025 PhishGuard AI Project</footer>
      </section>

    </div>
  );
}