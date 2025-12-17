'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  ShieldCheck, ShieldAlert, Search, Loader2, Activity, 
  ArrowLeft, AlertTriangle, History, Trash2, Clock, 
  Globe, Lock, MapPin, Server, ChevronDown, XCircle, MousePointerClick
} from 'lucide-react';

interface ScanHistory {
  url: string;
  is_phishing: boolean | number;
  confidence: number;
  timestamp: string;
  full_result: any;
}

export default function ScanPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  // State History & Dropdown
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const API_URL = 'http://127.0.0.1:8000/api/v1/predict'; 

  // Load History
  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveToHistory = (data: any, scannedUrl: string) => {
    // Hapus duplikat URL lama biar yang baru naik ke atas
    const filteredHistory = history.filter(item => item.url !== scannedUrl);

    const newRecord: ScanHistory = {
      url: scannedUrl,
      is_phishing: data.is_phishing,
      confidence: data.confidence, 
      full_result: data, 
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [newRecord, ...filteredHistory].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scanHistory');
    setResult(null);
  };

  // --- FUNGSI UTAMA SCANNING (DIPISAH SUPAYA BISA DIPANGGIL HISTORY) ---
  const analyzeUrl = async (targetUrl: string) => {
    // 1. Validasi & Auto-HTTPS
    let formattedUrl = targetUrl.trim();
    if (!formattedUrl) return;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // 2. Update State UI
    setUrl(formattedUrl); // Masukkan ke form
    setLoading(true);
    setError('');
    setResult(null);
    setShowHistory(false); // Tutup dropdown

    // 3. Panggil API
    try {
      const response = await axios.post(API_URL, { url: formattedUrl });
      setResult(response.data);
      saveToHistory(response.data, formattedUrl);
    } catch (err: any) {
      console.error(err);
      if (err.code === "ERR_NETWORK") {
        setError('Gagal terhubung ke Backend. Pastikan port backend benar!');
      } else {
        setError(err.response?.data?.detail || 'Terjadi kesalahan saat analisis.');
      }
    } finally {
      setLoading(false);
    }
  };
  // ---------------------------------------------------------------------

  // Handler Tombol "Scan" Manual
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeUrl(url);
  };

  // Handler Klik History -> Langsung Scan Ulang (Fresh)
  const handleHistoryClick = (item: ScanHistory) => {
    // Opsi A: Gunakan data cache (Instant, tanpa loading)
    // setUrl(item.url);
    // setResult(item.full_result);
    // setShowHistory(false);
    
    // Opsi B: Scan Ulang (Fresh API Call) - Sesuai requestmu "tombol scan otomatis terklik"
    analyzeUrl(item.url);
  };

  const getMapUrl = (lat: string, lon: string) => {
    const delta = 0.05; 
    const bbox = `${parseFloat(lon)-delta},${parseFloat(lat)-delta},${parseFloat(lon)+delta},${parseFloat(lat)+delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 relative font-sans">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[128px]" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-6 px-4">
        <Link href="/">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali</span>
          </button>
        </Link>

        {/* History Dropdown */}
        <div className="relative" ref={historyRef}>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              showHistory ? 'bg-slate-800 border-emerald-500 text-white' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">Riwayat</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>

          {showHistory && (
            <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scan Terakhir</span>
                <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {history.length === 0 ? (
                  <p className="text-center text-slate-600 text-sm py-4">Belum ada riwayat.</p>
                ) : (
                  history.map((item, idx) => (
                    // BUTTON KLIK HISTORY -> TRIGGER SCAN
                    <button 
                      key={idx} 
                      onClick={() => handleHistoryClick(item)} 
                      className="w-full text-left p-3 hover:bg-slate-800/50 rounded-lg group transition-all border border-transparent hover:border-slate-700 active:scale-95"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-slate-300 text-xs font-mono truncate w-48 group-hover:text-emerald-400 transition-colors">
                          {item.url}
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          item.is_phishing ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {item.is_phishing ? 'PHISHING' : 'SAFE'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                           <Clock className="w-3 h-3" />
                           {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 font-bold">
                           <MousePointerClick className="w-3 h-3" /> Scan Ulang
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-5xl mx-auto mt-8 pb-20">
        
        {/* Search Bar Big */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-lg">
            <Activity className="w-4 h-4 animate-pulse" />
            AI Detection System Active
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Scanner Keamanan URL
          </h1>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <form onSubmit={handleSubmit} className="relative bg-slate-900 rounded-xl p-2 flex items-center border border-slate-800 shadow-2xl">
              <Search className="w-6 h-6 text-slate-500 ml-4 mr-2" />
              <input 
                type="text"
                placeholder="cth: google.com atau faceb00k.com" 
                className="w-full bg-transparent border-none outline-none text-slate-200 placeholder-slate-600 text-lg h-12"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading || !url}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-12 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Scan'}
              </button>
            </form>
          </div>
          
          {error && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* --- RESULT DASHBOARD --- */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* --- 1. STATUS CARD (LEFT COL) --- */}
            <div className={`md:col-span-8 p-8 rounded-3xl border relative overflow-hidden flex flex-col justify-center items-center text-center min-h-[300px] ${
              result.is_phishing 
                ? 'bg-red-950/20 border-red-500/30 shadow-[0_0_50px_-10px_rgba(239,68,68,0.2)]' 
                : 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)]'
            }`}>
              <div className={`absolute inset-0 opacity-20 blur-3xl rounded-full ${
                result.is_phishing ? 'bg-red-600' : 'bg-emerald-600'
              } -z-10 scale-50`} />

              <div className={`p-4 rounded-full mb-6 ${
                result.is_phishing ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {result.is_phishing ? <ShieldAlert className="w-16 h-16" /> : <ShieldCheck className="w-16 h-16" />}
              </div>

              <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                {result.is_phishing ? 'BERBAHAYA (PHISHING)' : 'AMAN (SAFE)'}
              </h2>
              <p className="text-slate-400 font-mono text-sm max-w-lg break-all border border-slate-800 bg-slate-900/50 px-3 py-1 rounded-lg">
                {result.url}
              </p>

              {/* Impersonation Warning */}
              {result.impersonation && (
                <div className="mt-6 flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 px-5 py-3 rounded-xl animate-pulse w-full max-w-md">
                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                  <div className="text-left">
                    <p className="text-orange-200 text-xs font-bold uppercase">Impersonation Detected</p>
                    <p className="text-orange-400 text-sm font-semibold">Meniru: {result.impersonation.brand} ({(result.impersonation.similarity * 100).toFixed(0)}%)</p>
                  </div>
                </div>
              )}
            </div>

            {/* --- 2. STATS COLUMN (RIGHT COL) --- */}
            <div className="md:col-span-4 flex flex-col gap-6">
              
              {/* Confidence Card */}
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex-1 flex flex-col justify-center items-center relative overflow-hidden min-h-[200px]">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">AI Confidence</p>
                <div className="relative z-10">
                  <span className="text-6xl font-black text-white tracking-tighter">
                    {(result.confidence * 100).toFixed(0)}
                  </span>
                  <span className="text-xl text-slate-500 font-bold">%</span>
                </div>
                <svg className="absolute w-full h-full inset-0 pointer-events-none opacity-20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke={result.is_phishing ? "#ef4444" : "#10b981"} strokeWidth="1" />
                </svg>
              </div>
              
              {/* Timing Card */}
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center justify-between h-[100px]">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Waktu Analisis</p>
                  <p className="text-2xl font-bold text-white mt-1">{result.analysis_time_ms} <span className="text-sm text-slate-500">ms</span></p>
                </div>
                <Activity className="w-8 h-8 text-blue-500/50" />
              </div>
            </div>

            {/* --- 3. RISK INDICATORS (FULL ROW) --- */}
            {result.risk_indicators && result.risk_indicators.length > 0 && (
              <div className="md:col-span-12 bg-red-950/20 border border-red-500/20 rounded-3xl p-6 animate-in slide-in-from-bottom-2">
                <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Indikator Risiko Ditemukan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.risk_indicators.map((indicator: string, index: number) => (
                    <div key={index} className="bg-red-950/50 p-3 rounded-xl border border-red-500/10 flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-red-200 text-sm font-medium">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- 4. NETWORK & GEOLOCATION (MAP) --- */}
            {result.network_info && result.network_info.location && result.network_info.location.lat ? (
              <div className="md:col-span-12 bg-slate-900/40 border border-slate-800 rounded-3xl p-1 overflow-hidden">
                <div className="bg-slate-950/80 p-4 flex flex-wrap gap-6 items-center border-b border-slate-800/50 backdrop-blur-sm relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><Server className="w-5 h-5 text-blue-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">IP Address</p>
                      <p className="text-white font-mono text-sm">{result.network_info.ip_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg"><Globe className="w-5 h-5 text-purple-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">ISP / Hosting</p>
                      <p className="text-white font-medium text-sm">{result.network_info.location.isp || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg"><MapPin className="w-5 h-5 text-orange-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Lokasi Server</p>
                      <p className="text-white font-medium text-sm">
                        {result.network_info.location.city}, {result.network_info.location.country}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative w-full h-64 bg-slate-800">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={getMapUrl(result.network_info.location.lat, result.network_info.location.lon)}
                    className="opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  ></iframe>
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(2,6,23,1)]"></div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-12 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex items-center justify-center text-slate-500 italic">
                <Globe className="w-5 h-5 mr-2" /> Data lokasi server tidak tersedia.
              </div>
            )}

            {/* --- 5. TECHNICAL FEATURES GRID --- */}
            <div className="md:col-span-12">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" /> Analisis Fitur Teknis
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {result.features && Object.entries({
                  "HTTPS Valid": result.features.is_https ? "Yes" : "No",
                  "Domain Length": result.features.domain_length || result.features.tld?.length + 5 || "N/A",
                  "Subdomains": result.features.no_of_subdomains || result.features.no_of_dot_in_url || 0,
                  "Similarity": `${(result.features.url_similarity_index || 0).toFixed(1)}%`,
                  "Special Chars": result.features.special_chars || result.features.no_of_other_special_chars_in_url || 0,
                  "Has Login": result.features.has_submit_button ? "Detected" : "No",
                  "Obfuscation": result.features.char_continuation_rate > 0.3 ? "Possible" : "Low",
                  "TLD": `.${result.features.tld || 'com'}`,
                  "Status": result.features.url_is_live ? "Live" : "Offline",
                  "Redirects": result.network_info?.redirect_chain?.length || 0
                }).map(([key, value], i) => (
                  <div key={i} className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center hover:border-slate-600 transition-colors">
                    <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">{key}</span>
                    <span className={`font-mono font-bold ${
                      (value === "No" || value === "Offline" || value === "Possible") && key !== "HTTPS Valid" ? "text-red-400" : 
                      (value === "No" && key === "HTTPS Valid") ? "text-red-400" : "text-white"
                    }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}